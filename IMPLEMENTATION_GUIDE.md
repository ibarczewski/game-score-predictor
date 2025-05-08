# Game Score Prediction App Implementation Guide

This document provides guidance on how to set up and run the prototype application, as well as notes for future development.

## Getting Started

1. **Initial Setup**:

   - Ensure you have Node.js and npm installed
   - Clone the repository and navigate to the project directory
   - Run `npm install` to install dependencies

2. **Setting Up Game Cover Images**:

   - Create a folder at `public/images/`
   - Add two game cover images:
     - `doom.jpg` for "DOOM: The Dark Ages"
     - `elden-ring.jpg` for "Elden Ring: Nightreign"
   - Alternatively, update the paths in `data/data.json` to point to your images

3. **Starting the Development Server**:
   - Run `npm run dev`
   - The app will be available at http://localhost:3000

## Authentication

The prototype uses a simple authentication system with predefined users in `data/data.json`:

- **Players**: player1, player2, player3, player4, player5 (all have matching passwords)
- **Admin**: admin/admin

Authentication is handled by:

- `pages/api/auth.js` - API endpoint for login
- `lib/auth.js` - Authentication utilities
- Cookies for storing user state

## Key Components and Pages

### Pages:

- **/** - Dashboard showing all games
- **/login** - Login page
- **/games/[id]** - Individual game page where:
  - Players can make predictions before release
  - Admins can set actual review scores
  - Scores are color-coded based on value (red, yellow, green)

### Components:

- **Layout.js** - Page wrapper with navbar and footer
- **NavBar.js** - Navigation with authentication status
- **GameCard.js** - Card component for game display on dashboard

## Data Storage

Currently, all data is stored in `data/data.json`, which contains:

- User accounts
- Game information
- Player predictions

## Future Enhancements

1. **Database Integration**:

   - Replace JSON file storage with a proper database
   - Recommended: PostgreSQL, MongoDB, or MySQL
   - Update data access functions in `lib/auth.js`

2. **Security Improvements**:

   - Hash passwords (using bcrypt)
   - Implement proper JWT secret management
   - Add CSRF protection

3. **Feature Additions**:

   - Leaderboard for player predictions
   - Ability to add new games (admin)
   - Profile pages for players
   - Notification system for game releases

4. **UI Enhancements**:

   - Improved mobile responsiveness
   - Dark mode
   - Animation effects
   - Richer game details (genres, platforms, etc.)

5. **Testing**:
   - Add unit tests with Jest
   - Add integration tests
   - Add end-to-end tests with Cypress

## Deployment

For production deployment:

1. Build the application: `npm run build`
2. Start the production server: `npm start`
3. Consider deployment platforms like Vercel, Netlify, or AWS
