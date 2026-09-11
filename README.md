# Burial Ceremony Tribute & Ticketing Frontend

A complete React frontend for a burial ceremony system.

## Tech Stack

- React 18 (JavaScript)
- Vite
- TailwindCSS 3.4
- Recoil (state management)
- Axios (HTTP client)
- React Router v6
- Formik + Yup (forms & validation)
- React Toastify (notifications)
- PrimeIcons + Lucide React (icons)
- date-fns (date formatting)

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Create `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Start the dev server:
   ```bash
   yarn dev
   ```

The app will be available at `http://localhost:5173`.

## Backend

This frontend expects a Django REST Framework backend running at `http://localhost:8000`.

## Features

- Tribute home page with memorial details, photo gallery, and tribute wall
- Ticket request system
- Ticket lookup by reference
- Approved ticket page with QR code
- Admin dashboard with stats
- Admin ticket management (approve/decline)
- Admin check-in desk
- Admin check-in history
- Admin announcements
