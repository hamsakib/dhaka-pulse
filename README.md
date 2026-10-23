# Dhaka Pulse

Discover what's happening in Dhaka this week: live music, tech meetups, food walks, art shows, workshops and more. Dhaka Pulse is a Next.js (App Router) event discovery app with Firebase authentication. Anyone can browse events; signed-in users can add their own events and manage them.

**Live site:** {{LIVE_URL}}

## Key features

- **Event discovery:** search by keyword and filter by category, area of Dhaka and price, with sorting by date or price
- **Event details:** dynamic `/items/[id]` pages with image, full description, date, venue, price, capacity and related events
- **Firebase authentication:** email and password registration and login, plus Google sign-in; the user is stored in React Context and redirected home after login
- **Protected pages:** `/items/add` and `/items/manage` redirect visitors to `/login`
- **Add events:** validated form (title, descriptions, category, date, price, image URL) with toast confirmation
- **Manage events:** table of all events with View and Delete actions
- **Polished UI:** sticky responsive navbar with a user dropdown, light and dark mode, uniform cards with hover and focus states

## Tech stack

Next.js 16 (App Router) · React 19 · Firebase Authentication · Tailwind CSS 4 · next-themes · lucide-react · sonner

Seed events ship with the app and events you add are saved in your browser's localStorage.

## Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Landing page: navbar, hero, categories, upcoming events, why Dhaka Pulse, testimonials, footer |
| `/items` | Public | All events with search, filters and sorting |
| `/items/[id]` | Public | Event details with related events |
| `/about` | Public | About Dhaka Pulse |
| `/login` | Public | Email/password and Google login |
| `/register` | Public | Create an account |
| `/items/add` | Protected | Add a new event |
| `/items/manage` | Protected | View and delete events |

## Setup and installation

```bash
git clone https://github.com/hamsakib/dhaka-pulse.git
cd dhaka-pulse
npm install
cp .env.example .env.local   # fill in your Firebase web app config
npm run dev
```

Open http://localhost:3000.

### Environment variables

Create a Firebase project, enable **Email/Password** and **Google** sign-in under Authentication, register a web app and copy its config into `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Author

Hasan Al Mahmud · [Portfolio](https://hasan-al-mahmud-dev.vercel.app) · [GitHub](https://github.com/hamsakib)
