# wedding-frontend


React + Vite frontend for the wedding website. For full deployment and environment setup, see the [root README](../README.md).

## Deploying with Coolify

You can deploy this frontend as a static site or Vite app in Coolify:

- **Static Site:** Let Coolify build the project (`npm run build`) and serve the `dist/` folder.
- **Vite App:** For development, Coolify can run `npm run dev` (port 5173 by default).

API requests to `/api` are proxied to the backend in development. In production, configure your frontend to call the backend’s public URL or use Coolify’s proxy features if needed.

## Getting Started

```bash
npm install
npm run dev       # development server at http://localhost:5173
npm run build     # production build
npm run preview   # preview production build
npm run lint      # run ESLint
```

> In dev mode, Vite proxies all `/api` requests to `http://localhost:5000` automatically — no CORS config needed.

## Stack

- **React 19** — UI library
- **Vite 7** — build tool & dev server (with `/api` proxy configured)
- **Tailwind CSS v4** — utility-first styling
- **Lucide React** — icon library

## Structure

```
src/
├── pages/
│   ├── LandingPage.jsx        # "Save the Date" animated hero
│   ├── RSVPPage.jsx           # RSVP form + venue info + embedded maps
│   ├── AdminLoginPage.jsx     # Admin login
│   └── AdminDashboardPage.jsx # RSVP list, invite generator, email tools
├── styles/
│   └── animations.css
├── App.jsx
└── main.jsx
```

## Background images

Local wedding photos are stored in `public/images/` and referenced as `/images/<file>.jpg`.
They are compressed to ≤ 1920px / 80% JPEG quality for web performance.

| File | Used on |
|---|---|
| `landing-bg.jpg` | Landing page |
| `rsvp-bg.jpg` | RSVP page |
| `admin-login-bg.jpg` | Admin login |
| `admin-dashboard-bg.jpg` | Admin dashboard |


