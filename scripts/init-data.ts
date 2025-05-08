const fs = require("fs");
const path = require("path");

// Initial data for the application
const initialData = {
  users: [
    {
      id: 1,
      username: "player1",
      password: "player1",
      role: "player",
      totalScore: 0,
    },
    {
      id: 2,
      username: "player2",
      password: "player2",
      role: "player",
      totalScore: 0,
    },
    {
      id: 3,
      username: "player3",
      password: "player3",
      role: "player",
      totalScore: 0,
    },
    {
      id: 4,
      username: "player4",
      password: "player4",
      role: "player",
      totalScore: 0,
    },
    {
      id: 5,
      username: "player5",
      password: "player5",
      role: "player",
      totalScore: 0,
    },
    {
      id: 6,
      username: "admin",
      password: "admin",
      role: "admin",
    },
  ],
  games: [
    {
      id: 1,
      title: "DOOM: The Dark Ages",
      coverArt: "/images/doom.jpg",
      releaseDate: "2025-06-15",
      released: false,
      actualScore: null,
      predictions: [],
    },
    {
      id: 2,
      title: "Elden Ring: Nightreign",
      coverArt: "/images/elden-ring.jpg",
      releaseDate: "2025-07-22",
      released: false,
      actualScore: null,
      predictions: [],
    },
  ],
  playerScores: [],
};

// Path to the data directory and file
const dataDir = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDir, "data.json");

// Check if data directory exists, if not create it
if (!fs.existsSync(dataDir)) {
  console.log("Creating data directory...");
  fs.mkdirSync(dataDir, { recursive: true });
}

// Check if data file exists, if not create it with initial data
if (!fs.existsSync(dataFile)) {
  console.log("Creating initial data.json file...");
  fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2), "utf8");
  console.log("Initial data created successfully!");
} else {
  console.log("data.json already exists, skipping initialization");
}
