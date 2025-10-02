# FutureFunds

A Next.js app to calculate, save, and manage retirement scenarios. Uses Firebase Authentication and MongoDB for persistent storage.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript, Tailwind CSS
- Firebase Authentication (email/password + Google)
- MongoDB (Node driver v5)
- Radix UI + shadcn/ui components

## Quick Start
1) Install dependencies
```bash
npm i
```

2) Configure environment variables (create `.env.local`)
```bash
# Firebase (Web App config)
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_WEB_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=XXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_APP_ID=1:XXXXXXXXXXXX:web:XXXXXXXXXXXX

# MongoDB (local or Atlas)
# Either specify a DB name here…
# MONGODB_DB=yourdb
# …or include it directly in the URI path
MONGODB_URI=mongodb://localhost:27017/yourdb
```

3) Firebase Console setup
- Authentication → Sign-in method: Enable Email/Password and Google
- Authentication → Settings: Add Authorized domain `localhost`
- If using Google Cloud OAuth client, add `http://localhost:3000` to allowed origins and redirect URIs

4) Run the app
```bash
npm run dev
```
Open `http://localhost:3000`.

## Features
- Calculator with charts and results
- Save scenarios (name, inputs, outputs) to MongoDB (`futureFunds` collection)
- View, edit, and delete scenarios
- Firebase Authentication (email/password & Google)

## API
- `GET /api/scenarios?userId=UID`
  - Returns scenarios for the user
- `POST /api/scenarios`
  - Body: `{ name, input, output, userId }`
  - Inserts a new scenario into `futureFunds`
- `DELETE /api/scenarios?id=SCENARIO_ID&userId=UID`
  - Deletes a scenario by id for the user

## Common Issues
- Firebase: `auth/api-key-not-valid`
  - Use the correct Web API Key from Firebase Project settings and restart dev server
- Google sign-in: "The requested action is invalid" or popup blocked
  - Enable Google provider, add `localhost` to Authorized domains, allow popups
- MongoDB: Missing database name
  - Provide `MONGODB_DB` or include db name in `MONGODB_URI` path (e.g., `mongodb://localhost:27017/yourdb`)
- 401/Unauthorized on save
  - Ensure `userId` is sent from the client (user must be signed in)

## Project Structure (key paths)
- `app/` — Next.js routes (pages, API)
  - `app/api/scenarios/route.ts` — scenarios CRUD API
  - `app/calculator/page.tsx` — calculator + results
  - `app/scenarios/page.tsx` — list/manage scenarios
- `components/` — UI and feature components
- `lib/` — helpers
  - `lib/auth.ts` — Firebase auth helpers
  - `lib/firebase.ts` — Firebase client init
  - `lib/mongodb.ts` — MongoDB client (server-only)
  - `lib/scenarios.ts` — client-side scenarios API wrapper

## Scripts
```bash
npm run dev       # start dev server
npm run build     # build for production
npm run start     # start production server
```

## License
MIT
EOF"