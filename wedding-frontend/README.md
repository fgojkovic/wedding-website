# wedding-frontend

React + Vite frontend for the wedding website. For full project documentation see the [root README](../README.md).

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

## Production build (Docker)

In production the app is built with `npm run build` and served by **nginx**, which also proxies `/api/*` to the backend container. See [wedding-frontend/Dockerfile](Dockerfile) and [nginx.conf](nginx.conf).

