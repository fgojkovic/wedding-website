# Wedding Backend

Express.js REST API for the Filip & Matea wedding website. Handles invites, RSVPs, email reminders, and admin operations.

---

## Tech Stack

| Package | Purpose |
|---|---|
| [Express 5](https://expressjs.com/) | HTTP server |
| [MySQL2](https://github.com/sidorares/node-mysql2) | Database client (promise-based pool) |
| [Nodemailer](https://nodemailer.com/) | Email sending |
| [node-cron](https://github.com/node-cron/node-cron) | Scheduled reminder (Aug 27 at 17:30) |
| [xlsx](https://github.com/SheetJS/sheetjs) | Excel file parsing for bulk invite generation |
| [multer](https://github.com/expressjs/multer) | File upload handling (memory storage) |
| [uuid](https://github.com/uuidjs/uuid) | Invite code generation |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variable loading |
| [cors](https://github.com/expressjs/cors) | Cross-origin resource sharing |

---

## Environment Variables

Create a `.env` file in this directory:

```env
PORT=3001

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=wedding

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=you@example.com
SMTP_PASS=yoursmtppassword
```

---

## Running Locally

```bash
npm install
npm start
```

The server starts on the port defined in `PORT` (default: `3001`).

---

## API Reference

### Invites

#### `GET /api/invite/:code`
Looks up an invite by UUID code. Returns the guest name.

**Response**
```json
{ "guestName": "John Doe" }
```

#### `POST /api/invites/generate`
Generates invite links from an optional Excel file upload plus a general link.

**Form data**
| Field | Type | Required | Description |
|---|---|---|---|
| `baseUrl` | string | yes | Base URL for the generated invite links |
| `file` | file | no | `.xlsx` file with guest names in the first column |

**Response**
```json
{
  "success": true,
  "invites": [
    { "name": "General Invitation", "url": "https://...", "isGeneral": true },
    { "name": "John Doe", "url": "https://...", "isGeneral": false }
  ]
}
```

---

### RSVP

#### `POST /api/rsvp`
Submits a new RSVP for a valid invite code.

**Body**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "inviteCode": "<uuid>"
}
```

#### `GET /api/rsvp-list`
Returns all RSVPs ordered by submission time (newest first). Used by the admin dashboard.

#### `DELETE /api/rsvp/:id`
Deletes an RSVP by its database ID.

---

### Email

#### `POST /api/email/test`
Sends a test reminder email to a specified address.

**Body**
```json
{ "to": "you@example.com" }
```

#### `POST /api/email/send-reminders`
Blasts the wedding reminder email to all RSVPs that provided an email address.

**Response**
```json
{ "success": true, "sent": 12, "failed": 0, "errors": [] }
```

---

## Cron Job

A cron job runs daily at **17:30** and fires the reminder emails on **August 27th** (the day before the wedding):

```
30 17 27 8 *
```

---

## Scripts

| Script | Command | Description |
|---|---|---|
| `start` | `node server.js` | Start the API server |
| `generate-invites` | `node generate-invites.js` | Legacy CLI tool for generating invite links interactively |
