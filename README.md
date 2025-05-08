# Game Score Prediction App Prototype

This is a Next.js application prototype for a game score prediction system. Players can predict review scores for upcoming games, and admins can set the actual scores once games are released.

## Setup Instructions

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a directory for game cover images:

```bash
mkdir -p public/images
```

4. Add sample game cover images:

   - Add game cover images to the `public/images` folder
   - Name them `doom.jpg` and `elden-ring.jpg`

5. Initialize the data (this will also happen automatically on first run):

```bash
npm run init-data
```

6. Run the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## User Accounts

### Players

- Username: player1, player2, player3, player4, player5
- Password: Same as username (e.g., player1/player1)

### Admin

- Username: admin
- Password: admin

## Features

- User authentication (player and admin roles)
- Dashboard showing upcoming and released games
- Players can make score predictions for unreleased games
- Admins can set actual review scores
- Scoring system for predictions:
  - Exact match: 6 points
  - Within 2 points: 3 points
  - Within 3 points: 1 point
- Score color coding:
  - Green: 75 or above
  - Yellow: 60-74
  - Red: Below 60
- Leaderboard showing player rankings

## Technologies Used

- Next.js
- React
- Tailwind CSS
- JSON file for data storage (will be migrated to a database in the future)

## Project Structure

- `/components` - Reusable UI components
- `/pages` - Next.js pages and API routes
- `/lib` - Utility functions
- `/data` - JSON data storage
- `/public/images` - Game cover images
- `/scripts` - Setup scripts

## Troubleshooting

### CSS/Tailwind Issues

If the styles aren't being applied correctly, run:

```bash
npm run fix-tailwind
```

Then restart your development server:

```bash
npm run dev
```

### App Router Conflict

If you encounter this error:

```
Error: ./ App Router and Pages Router both match path: / Next.js does not support having both App Router and Pages Router routes matching the same path.
```

Run the cleanup script to remove any conflicting App Router files:

```bash
npm run cleanup
```

### Data Initialization

If you encounter any issues with file permissions or data initialization, run:

```bash
npm run init-data
```

This will ensure the data directory and data.json file are properly created.
