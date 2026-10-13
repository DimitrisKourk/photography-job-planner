# Photography Job Planner

A full-stack **management system for a photography studio**: quotes, booked jobs, scheduling, payments to associates, contracts and financial analytics, all in one place.

Built with **Node.js / Express**, **MySQL**, vanilla **JavaScript**, **Chart.js** and the **Google Calendar API**.

> **About this repository:** the app was built for, and used in production by, a real photography studio (2024–2025). This is a **sanitized demo version**: the client's branding, public website, credentials and real data have been removed, and the database ships with **fictional demo data**. The interface is in Greek, as it was built for a Greek business.

## Features

Behind a login, at `/management`:

| Section | What it does |
|---|---|
| **Offers** | Create and edit customer quotes, filtered by month, and turn an accepted offer into a job |
| **Jobs** | Booked jobs with full details, an 11-step task checklist for tracking progress, products/packages and filtering by month |
| **Availability** | A schedule of booked dates and the crew on each job. Jobs can be pushed to a shared **Google Calendar** with reminders 3 days before (optional). |
| **Payments** | Customer payments per job, and what each associate (photographers, videographers, drone, editor, album printer) is owed and has been paid |
| **Associates & Products** | Settings for the studio's collaborators and the products it sells |
| **Financials dashboard** | Monthly income vs expenses, income per category, expenses per type, job counts and per-associate payment analytics, drawn with **Chart.js** |
| **PDF export** | Job sheets, balance sheets and schedules exported to PDF in the browser with **html2pdf.js** |
| **Contracts** | Upload PDFs (via **multer**), attach them to jobs and offers and download them later |
| **Archive** | Past jobs and offers, which can be restored or deleted |

## Tech stack

| Layer | Technologies |
|---|---|
| Front end | HTML, CSS, vanilla JavaScript, Chart.js, html2pdf.js |
| Back end | Node.js, Express 4, express-session, multer, googleapis |
| Database | MySQL 8 or MariaDB through **mysql2** (connection pools, parameterized queries); works with a local server or a hosted one such as **Aiven** over SSL |

## Architecture

```
Browser (HTML / CSS / vanilla JS + Chart.js)
        │  fetch() → JSON REST API
        ▼
Express server
  ├── app.js                    setup: sessions, static files, mounts the routers
  ├── middleware/requireLogin   every /api route requires a logged-in session
  ├── routes/*.js               one router per section of the app
  └── config/db.js              mysql2 connection pools, parameterized queries (? placeholders)
        │                                     │
        ▼                                     ▼
MySQL / MariaDB (local or hosted)    Google Calendar API (optional)
```

Each route file is a small Express router. Route handlers are wrapped in `utils/handle.js`, so a failed query is logged and answered with a 500 and the error message instead of crashing the server.

### Project structure

| Path | Contents |
|---|---|
| `app.js` | Server setup: sessions, static files, mounting the routers, error handler |
| `config/db.js` | Database connection pools (with optional port and SSL settings) and a promise-based `query()` helper |
| `middleware/requireLogin.js` | Sends the login page to anyone who isn't logged in |
| `utils/handle.js` | Error handling wrapper for async routes |
| `routes/auth.js` | Login and the HTML pages (`/`, `/management`, `/auth`, `/management/home`) |
| `routes/offers.js` | Customer quotes |
| `routes/jobs.js` | Booked jobs, task checklist and schedule |
| `routes/archive.js` | Archiving, restoring and deleting past offers and jobs |
| `routes/settings.js` | Associates and products |
| `routes/payments.js` | Customer payments per job |
| `routes/dashboard.js` | Financial dashboard and per-associate analytics queries |
| `routes/calendar.js` | Google Calendar integration (optional) |
| `routes/pdfs.js` | Contract PDF upload, download and linking to offers/jobs |
| `scripts/index.html`, `app_scripts.js` | Management system single-page front end |
| `scripts/mycharts.js` | Chart.js dashboard charts |
| `scripts/login.html` | Login page |
| `CSS/` | Stylesheets for the app and the login page |
| `DB_Structure_data_demo.sql` | Database structure with fictional demo data |
| `tools/reset-db.js` | Wipes the database and reloads the demo data (`npm run db:reset`) |
| `PDFs/` | Uploaded contracts are stored here |

## Running locally

### Requirements
- **Node.js 20.6+** (the npm scripts load `.env` with `--env-file`)
- **MySQL 8 or MariaDB**, either on your machine or hosted (e.g. Aiven)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure the environment:** copy `.env.example` to `.env` and fill it in (see [Configuration](#configuration)).

3. **Create an empty database** (skip this for a hosted database that already has one, such as Aiven's `defaultdb`):
   ```bash
   mysql -u root -p -e "CREATE DATABASE photography_job_planner CHARACTER SET utf8mb4"
   ```

4. **Load the demo data**
   ```bash
   npm run db:reset
   ```

5. **Start the server**
   ```bash
   npm start
   ```

Open [http://localhost:4000](http://localhost:4000) and log in with the demo account: **username `demo`, password `demo`**.

### Configuration

All settings live in `.env`, which is git-ignored:

| Variable | Required | Description |
|---|---|---|
| `db_host`, `db_name`, `db_user`, `db_password` | yes | Database connection |
| `db_port` | no | Database port (default `3306`) |
| `db_ssl_ca` | no | Path to the server's CA certificate, e.g. `./ca.pem`. Turns on SSL with certificate verification, which hosted databases such as Aiven require. |
| `SESSION_SECRET` | yes | Any long random string, used to sign the login cookie |
| `port` | no | Port for the web server (default `4000`) |
| `NODE_ENV` | no | Set to `production` when serving over HTTPS, so the login cookie is https-only |
| `GOOGLE_KEY_FILE`, `GOOGLE_PROJECT_NUMBER`, `GOOGLE_CALENDAR_ID` | no | Google Calendar sync (see below) |

#### Using a hosted database (Aiven)
Set `db_host`, `db_port`, `db_user` and `db_password` from the service's connection details, download the service's CA certificate as `ca.pem` into the project root and set `db_ssl_ca=./ca.pem`. Both `.env` and `*.pem` files are git-ignored, so credentials stay on your machine.

### Resetting the database
`npm run db:reset` drops **every table** in the database configured in `.env` and rebuilds it from `DB_Structure_data_demo.sql`. It shows the host and the tables it will drop, then asks you to type the database name to confirm (`npm run db:reset -- --yes` skips the question).

### Google Calendar (optional)
Calendar sync is disabled unless configured. To enable it, create a Google Cloud **service account**, share the target calendar with it, save its JSON key in the project root (e.g. `service-account.json`, which is git-ignored) and set `GOOGLE_KEY_FILE`, `GOOGLE_PROJECT_NUMBER` and `GOOGLE_CALENDAR_ID` in `.env`.

## Notes on the demo

- The background images for the printable **offer PDFs** were the studio's own artwork and are not included, so the offer printout has a plain background.
- The production version ran on shared hosting (cPanel) with MariaDB, behind HTTPS.
- The server was originally a single 2,000-line `app.js`; it has since been reorganized into the route modules above and moved to `mysql2` for MySQL 8 support. A production rewrite would also add password hashing and CSRF protection.

---

Built by **Dimitris Kourkoutas**.
