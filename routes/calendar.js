// Google Calendar integration (optional): /api/config/calendar, /api/job/createEvent
// Enabled only when GOOGLE_KEY_FILE and GOOGLE_CALENDAR_ID are set in .env
const express = require("express");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const router = express.Router();

const GOOGLE_KEY_FILE = process.env.GOOGLE_KEY_FILE ? path.resolve(__dirname, "..", process.env.GOOGLE_KEY_FILE) : null;
const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER;
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
const calendarEnabled = Boolean(GOOGLE_KEY_FILE && GOOGLE_CALENDAR_ID && fs.existsSync(GOOGLE_KEY_FILE));

const calendar = google.calendar({
  version: "v3",
  project: GOOGLE_PROJECT_NUMBER,
});

// lets the front end know which calendar to embed (if any)
router.get("/config/calendar", (req, res) => {
  res.json({ calendarId: calendarEnabled ? GOOGLE_CALENDAR_ID : null });
});

router.post("/job/createEvent", (req, res) => {
  if (!calendarEnabled) {
    return res.json("Google Calendar is not configured for this installation.");
  }
  const event = {
    summary: req.body.summary,
    location: req.body.location,
    description: "",
    start: {
      dateTime: req.body.start,
      timeZone: "Europe/Athens",
    },
    end: {
      dateTime: req.body.end,
      timeZone: "Europe/Athens",
    },
    attendees: [], // adding attendees requires Google Workspace domain-wide delegation
    guestsCanSeeOtherGuests: false,
    reminders: {
      useDefault: false,
      overrides: [
        { method: "popup", minutes: 3 * 24 * 60 }, // 3 days before the event
        { method: "popup", minutes: 24 * 60 },
      ],
    },
  };
  console.log(event);

  const auth = new google.auth.GoogleAuth({
    keyFile: GOOGLE_KEY_FILE,
    scopes: "https://www.googleapis.com/auth/calendar",
  });
  auth.getClient().then((client) => {
    calendar.events.insert(
      {
        auth: client,
        calendarId: GOOGLE_CALENDAR_ID,
        resource: event,
      },
      function (err, createdEvent) {
        if (err) {
          console.log("There was an error contacting the Calendar service: " + err);
          return;
        }
        console.log("Event created: %s", createdEvent.data);
        res.jsonp("Event successfully created!");
      }
    );
  });
});

module.exports = router;
