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
├── init.sql                   # Creates DB tables for MySQL
├── .gitignore
├── README.md
├── wedding-frontend/
│   ├── nginx.conf             # (Optional) For custom proxy setups
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
  ├── server.js              # Express API + cron job
  ├── generate-invites.js    # CLI invite generator (legacy)
  └── .env                   # Local dev only (not committed)
```

---

## Deploying with Coolify

Coolify makes it easy to deploy Node.js, React, and MySQL apps without Docker. Here’s how to deploy this project:

### 1. Prepare the Database

- Provision a MySQL 8 database (Coolify can manage this, or use your own server).
- Run the contents of `init.sql` to create the required tables.

### 2. Deploy the Backend

- Add a new **Node.js app** in Coolify, pointing to the `wedding-backend` folder.
- Set environment variables as described in the [Environment Variables](#environment-variables) section (DB and SMTP settings).
- The backend will run on port 5000 by default.

### 3. Deploy the Frontend

- Add a new **Static Site** or **Vite/React app** in Coolify, pointing to the `wedding-frontend` folder.
- For static hosting: build locally with `npm run build` and deploy the `dist/` folder, or let Coolify build it for you.
- The frontend will run on port 5173 by default (for dev) or be served as static files in production.

### 4. Configure API Proxy (if needed)

- In development, Vite proxies `/api` to the backend automatically.
- In production, if you need to proxy `/api` requests, use Coolify’s built-in proxy features or set up a reverse proxy (nginx, Caddy, etc). For most setups, direct API calls to the backend URL are fine.

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

### Production `.env` (Coolify or other platforms)

Set these as environment variables in your deployment platform (Coolify, etc):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=your16charapppassword
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=wedding_db
PORT=5000
NODE_ENV=production
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
