import { promises as fs } from "fs";
import path from "path";
import jwt from "jsonwebtoken";

// In a real app, use a secure environment variable
const JWT_SECRET = "game-prediction-prototype-secret";

// Helper function to read the data file
export async function readDataFile() {
  const filePath = path.join(process.cwd(), "data", "data.json");
  const fileData = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileData);
}

// Helper function to write to the data file
export async function writeDataFile(data) {
  const filePath = path.join(process.cwd(), "data", "data.json");
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function getUsers() {
  const data = await readDataFile();
  return data.users;
}

export async function updateUserScore(userId, scoreToAdd) {
  const data = await readDataFile();
  const userIndex = data.users.findIndex((u) => u.id === userId);

  if (userIndex !== -1) {
    // Initialize totalScore if it doesn't exist
    if (typeof data.users[userIndex].totalScore !== "number") {
      data.users[userIndex].totalScore = 0;
    }

    data.users[userIndex].totalScore += scoreToAdd;
    await writeDataFile(data);

    return data.users[userIndex];
  }

  return null;
}

export async function getGames() {
  const data = await readDataFile();
  return data.games;
}

export async function getPlayerScores() {
  const data = await readDataFile();
  return data.playerScores || [];
}

export async function savePlayerScore(
  gameId,
  userId,
  username,
  predictionScore,
  actualScore,
  pointsEarned
) {
  const data = await readDataFile();

  // Initialize playerScores array if it doesn't exist
  if (!data.playerScores) {
    data.playerScores = [];
  }

  // Check if there's already a score for this user and game
  const existingScoreIndex = data.playerScores.findIndex(
    (s) => s.gameId === gameId && s.userId === userId
  );

  const scoreEntry = {
    gameId,
    userId,
    username,
    predictionScore,
    actualScore,
    pointsEarned,
    scoredAt: new Date().toISOString(),
  };

  if (existingScoreIndex >= 0) {
    // Update existing score
    data.playerScores[existingScoreIndex] = scoreEntry;
  } else {
    // Add new score
    data.playerScores.push(scoreEntry);
  }

  await writeDataFile(data);
  return scoreEntry;
}

export async function calculateScore(predictionScore, actualScore) {
  // Calculate points based on the scoring system
  if (predictionScore === actualScore) {
    return 6; // Exact match = 6 points
  } else if (Math.abs(predictionScore - actualScore) <= 2) {
    return 3; // Within 2 points = 3 points
  } else if (Math.abs(predictionScore - actualScore) <= 3) {
    return 1; // Within 3 points = 1 point
  }
  return 0; // More than 3 points off = 0 points
}

export async function saveGames(games) {
  const data = await readDataFile();
  data.games = games;
  await writeDataFile(data);
}

export async function authenticateUser(username, password) {
  const users = await getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return null;
  }

  // Generate token
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  };
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
