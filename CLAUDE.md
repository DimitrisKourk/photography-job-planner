# CLAUDE.md

Guidance for Claude Code when working in this repository. See [README.md](README.md) for the user-facing overview and setup.

## What this is

A management web app for a photography studio (offers/quotes, booked jobs, crew scheduling, payments, contracts, financial dashboard). It is a **sanitized demo** of an app that ran in production; the database ships with fictional data. **The UI is in Greek**: keep new user-facing strings in Greek to match.

Stack: Node.js + Express 4, MySQL 8 / MariaDB via `mysql2`, a vanilla-JS single-page front end, Chart.js and html2pdf.js loaded from cdnjs, optional Google Calendar via `googleapis`. No build step, no TypeScript, no framework on the front end.

## Commands

```bash
npm install
npm start                    # node --env-file=.env app.js  → http://localhost:4000 (login: demo / demo)
npm run db:reset             # DROPS EVERY TABLE in the configured DB, reloads DB_Structure_data_demo.sql (asks to confirm)
npm run db:reset -- --yes    # same, no prompt
```

- Requires Node 20.6+ (`--env-file`). Config is in `.env` (copy `.env.example`); variable names are lowercase `db_*` and `port`, plus `SESSION_SECRET`, `NODE_ENV`, `GOOGLE_*`.
- **There are no tests, linter or formatter.** `npm test` is a placeholder that fails. Verify changes by running the server and exercising the UI/API.
- Never run `db:reset` against a database you haven't confirmed is the demo one: it wipes all tables, not only the app's.

## Architecture

- [app.js](app.js): sessions, static mounts (`/images`, `/management/images`, `/css` → `CSS/`, `/scripts` → `scripts/`), mounts routers, final error handler.
- [routes/auth.js](routes/auth.js): `/` → `/management` (login page), `POST /auth`, `/management/home` (serves the app page if logged in).
- Everything under `/api` goes through [middleware/requireLogin.js](middleware/requireLogin.js). Note: an unauthenticated API call gets the **login HTML with status 200**, not a 401.
- One router per section in [routes/](routes/), all mounted at `/api`: `offers`, `jobs`, `archive`, `settings` (associates + products), `payments`, `dashboard` (aggregates + associate analytics), `calendar`, `pdfs`.
- [config/db.js](config/db.js) exports `query(sql, values)` and `multiQuery(sql, values)` (a separate pool with `multipleStatements: true`, used only for multi-statement writes like "INSERT …; DELETE …").
- [utils/handle.js](utils/handle.js) wraps async handlers: errors are logged and returned as `500` with the message.
- Front end: [scripts/index.html](scripts/index.html) + [scripts/app_scripts.js](scripts/app_scripts.js) (~3.9k lines, global functions, HTML built with template strings), charts in [scripts/mycharts.js](scripts/mycharts.js), menu helper `classie.js`. Sections are switched via URL hash (`#prosfores`, `#ergasies`, `#arxeio`, `#oikonomika`, `#diathesimotita`). All `fetch()` wrappers live together around `app_scripts.js` lines 2540–3330.

## Conventions

Match the existing style when adding routes:

```js
router.get("/thing/:id", handle(async (req, res) => {
  const values = [req.params.id];
  const text = `SELECT ... WHERE id = ?`;
  res.json(await query(text, values));
}));
```

- Always use `?` placeholders; never interpolate request data into SQL.
- Responses are JSON; success responses for writes are usually a plain string (`res.json("New Job added")`).
- Multi-value route params are comma-joined in the URL and `split(',')` on the server. **Order differs by route**: list filters (`/offers|jobs|archive/.../filtered/:dates`) take `year,month` (month `0` = whole year), while `/dashboard/monthly*/:date` take `month,year` and `/dashboard/*PerCategory/:data`, `/dashboard/jobCount/:data` take `category,year`.
- CommonJS (`require`), double quotes, semicolons, 2-space indent. Comments are short and lowercase-ish; one header comment per route file naming its endpoints.

## Data model

Defined in [DB_Structure_data_demo.sql](DB_Structure_data_demo.sql) (the only schema source; there are no migrations). Tables: `accounts`, `Associates`, `Products`, `Offers`, `OffersArchive`, `Jobs`, `JobArchive`, `CustomerPayments`. Table names are case-sensitive on Linux MySQL.

- `Jobs` is a wide denormalized table: `task1`–`task11` (0/1 progress checklist, Greek labels in `app_scripts.js` ~line 650), crew columns holding `Associates.id` (`photographer1/2`, `videographer1/2`, `drone`, `video_editor`, `album_printer`), matching `*_payment` amounts and `*_pay_done` flags.
- `job_type` / `offer_type` values: `gamos` (wedding), `baptisi` (baptism), `fotografisi` (photo shoot).
- `offer_package` is an encoded string, `"qty,productId,qty,productId-qty,giftId,..."` (products before `-`, gifts after); parsed client-side in `PackageItemList` / `PackageCostCalculator`.
- `pdf` columns store a filename in [PDFs/](PDFs/) (git-ignored uploads). Uploads are saved as `<Date.now()>-<original name>` so same-named files never overwrite each other; `POST /api/upload-pdf` returns the saved name, which the front end then links via `PUT /api/associate-pdf`. The 13-digit prefix is stripped (`/^\d{13}-/`) for display in `show_pdf` and for the download filename; older files without a prefix are left as-is. Downloads use `path.basename` so they can't escape `PDFs/`; `?inline=1` on the download route serves the file for display instead (the preview iframe in `show_pdf`, hidden on touch devices via `@media (pointer: coarse)` in favour of an open-in-new-tab button).
- Column names are kept as-is, including typos: `recieved_from_editor`, `recieved_from_printer`, mixed-case `EventLocation`. Don't "fix" them without changing schema, routes and front end together.
- Offer → Job: `POST /api/jobs/:offerId` inserts a Job and deletes the Offer. Archiving copies a row to `*Archive` and deletes the original; `JobArchive` keeps the job's id, but restoring gets a **new** auto-increment id and re-links `CustomerPayments` via `LAST_INSERT_ID()`.
- Dashboard totals always `UNION` `Jobs` and `JobArchive`, so archived jobs still count.

**Adding or renaming a job/offer column touches many places**: the SQL file (both the live and the `*Archive` table), the INSERT/UPDATE column lists in `routes/jobs.js` or `routes/offers.js`, the archive and restore statements in `routes/archive.js`, and the front end form readers/fillers (`getJobFormData`, `fill_form`, `getOfferFormData`, detail views). The placeholder count must match the value array exactly.

## Known limitations (intentional in the demo)

- Passwords in `accounts` are stored and compared in plain text; no CSRF protection. The README flags these as out of scope for the demo; don't silently change auth behaviour unless asked.
- Google Calendar is disabled unless `GOOGLE_KEY_FILE` and `GOOGLE_CALENDAR_ID` are set and the key file exists; `/api/config/calendar` tells the front end.
- Offer PDF background artwork was removed, so printed offers have a plain background.

## Secrets

`.env`, `*.pem` (e.g. `ca.pem` for Aiven SSL) and `service-account*.json` are git-ignored and may exist locally with real credentials. Don't print their contents, commit them, or copy their values into tracked files.
