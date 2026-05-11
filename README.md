# 💍 Wedding Website — Filip & Matea

> A full-stack wedding website featuring a save-the-date landing page, invite-code–gated RSVP system, admin dashboard, automated email reminders, and a full Docker setup for self-hosting.

**Wedding date:** August 28th, 2026

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Running with Docker (recommended)](#running-with-docker-recommended)
- [Running Locally (development)](#running-locally-development)
  - [Prerequisites](#prerequisites)
  - [Database Setup](#database-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Generating Invite Links](#generating-invite-links)
- [Email Reminders](#email-reminders)
- [API Reference](#api-reference)
- [Pages](#pages)

---

## Features

- **Save the Date** landing page with animated hero section and real wedding photos
- **Invite-code system** — each guest gets a unique UUID link; name is pre-filled from the DB (not exposed in the URL)
- **RSVP form** — first name, last name, optional email for reminders
- **Venue section** — ceremony & reception cards with website links, map buttons, and embedded Google Maps
- **Admin dashboard** — live RSVP list with email column, refresh, CSV export
- **Invite generator GUI** — upload an Excel file with guest names, generate shareable links in-browser
- **Email reminders** — send a test email, blast all RSVPs manually, or let the cron job fire automatically 24h before the ceremony
- **Docker Compose** setup — one command deploys everything (frontend + backend + MySQL)

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI library |
| [Vite 7](https://vite.dev/) | Build tool & dev server |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [Lucide React](https://lucide.dev/) | Icons |

### Backend
| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) | Runtime |
| [Express 5](https://expressjs.com/) | HTTP server |
| [MySQL2](https://github.com/sidorares/node-mysql2) | Database client |
| [Nodemailer](https://nodemailer.com/) | Email sending |
| [node-cron](https://github.com/node-cron/node-cron) | Scheduled reminder |
| [xlsx](https://github.com/SheetJS/sheetjs) | Excel file parsing |
| [multer](https://github.com/expressjs/multer) | File upload handling |
| [uuid](https://github.com/uuidjs/uuid) | Invite code generation |

### Infrastructure
| Technology | Purpose |
|---|---|
| [Docker + Docker Compose](https://docs.docker.com/compose/) | Containerisation & orchestration |
| [nginx](https://nginx.org/) | Serves frontend, proxies `/api` to backend |
| [MySQL 8](https://www.mysql.com/) | Database |

---

## Project Structure

```
wedding-website/
├── docker-compose.yml         # Orchestrates all services
├── init.sql                   # Creates DB tables on first Docker boot
├── .env                       # SMTP secrets for docker-compose (not committed)
├── .gitignore
├── README.md
├── wedding-frontend/
│   ├── Dockerfile             # Multi-stage: build → nginx
│   ├── nginx.conf             # Serves SPA + proxies /api → backend
│   ├── vite.config.js         # Includes dev proxy for local development
│   └── src/
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── RSVPPage.jsx
│       │   ├── AdminLoginPage.jsx
│       │   └── AdminDashboardPage.jsx
│       └── styles/
│           └── animations.css
└── wedding-backend/
    ├── Dockerfile
    ├── server.js              # Express API + cron job
    ├── generate-invites.js    # CLI invite generator (legacy)
    └── .env                   # Local dev only (not committed)
```

---

## Running with Docker (recommended)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed on your server/machine

### Steps

1. **Clone the repo** onto your server
2. **Fill in SMTP credentials** in the root `.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your@gmail.com
   SMTP_PASS=your16charapppassword
   ```
3. **Build and start everything:**
   ```bash
   docker compose up -d --build
   ```
4. The site is live at **`http://<server-ip>`**

On first boot, Docker automatically creates the MySQL database and tables from `init.sql`.

### Useful Docker commands

```bash
docker compose up -d --build      # Build images and start (detached)
docker compose down               # Stop all containers
docker compose logs -f backend    # Stream backend logs
docker compose logs -f frontend   # Stream nginx logs
docker compose restart backend    # Restart one service
```

Database data is stored in a Docker volume (`db_data`) and **persists across restarts and rebuilds**.

---

## Running Locally (development)

### Prerequisites

- **Node.js** v18 or higher
- **MySQL 8** running locally

### Database Setup

Run the contents of `init.sql` in your MySQL client, or:

```bash
mysql -u root -p < init.sql
```

### Backend Setup

```bash
cd wedding-backend
npm install
```

Create `wedding-backend/.env` (see [Environment Variables](#environment-variables)), then:

```bash
node server.js
```

API available at `http://localhost:5000`.

### Frontend Setup

```bash
cd wedding-frontend
npm install
npm run dev
```

App available at `http://localhost:5173`. Vite automatically proxies `/api` requests to `localhost:5000` — no CORS issues.

---

## Environment Variables

### `wedding-backend/.env` (local dev)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=wedding_db
PORT=5000
NODE_ENV=development

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=your16charapppassword
```

### Root `.env` (Docker / production)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=your16charapppassword
```

> **Gmail note:** Regular passwords are blocked. Generate a 16-character [App Password](https://myaccount.google.com/apppasswords) (requires 2FA enabled).

---

## Generating Invite Links

### Via Admin Dashboard (recommended)

1. Go to `http://<host>/?admin=true` and log in
2. In the **Generate Invite Links** panel:
   - Enter your site URL (e.g. `https://yourwedding.com`)
   - Optionally upload an `.xlsx` file — put one guest name per row in the first column
   - Click **Generate Links** — copy-able links appear instantly

### Via CLI (legacy)

```bash
cd wedding-backend
node generate-invites.js
```

The script prompts for guest names and your website URL, then prints links.

### How links work

- Each link is `/?invite=<uuid>` — the guest name is **not in the URL**
- When a guest opens their link, the frontend calls `GET /api/invite/:code` to fetch their name from the DB and pre-fill the form
- General links can be used by any number of people

---

## Email Reminders

### Automatic (cron)

A cron job in `server.js` fires at **17:30 on August 27th 2026** (24h before the ceremony) and sends the reminder to every RSVP that has an email address. The server must be running at that time.

### Manual (admin dashboard)

- **Test Email** panel — sends a sample reminder to any address you type, to verify SMTP settings
- **Send Reminders** panel — manually blasts the reminder to all guests with email

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/invite/:code` | Returns `{ guestName }` for the given invite code |
| `POST` | `/api/rsvp` | Submit an RSVP |
| `GET` | `/api/rsvp-list` | Get all RSVPs (admin) |
| `POST` | `/api/invites/generate` | Generate invite codes from an Excel upload |
| `POST` | `/api/email/test` | Send a test reminder email |
| `POST` | `/api/email/send-reminders` | Send reminders to all RSVPs with email |

### `POST /api/rsvp`

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "inviteCode": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

### `POST /api/invites/generate`

`multipart/form-data` with:
- `baseUrl` — your site URL
- `file` *(optional)* — `.xlsx` file, guest names in first column

---

## Pages

| URL | Page | Description |
|---|---|---|
| `/` | Landing Page | Animated "Save the Date" hero |
| `/?invite=<code>` | RSVP Page | RSVP form + venue info + embedded maps |
| `/?admin=true` | Admin Login | Password-protected entry |
| `/?admin=true` (after login) | Admin Dashboard | RSVPs, invite generator, email tools |
