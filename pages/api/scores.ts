import { getPlayerScores, getUsers, verifyToken } from "../../lib/server-utils";

export default async function handler(req, res) {
  try {
    // Get the token from the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (req.method === "GET") {
      // Get player scores
      const scores = await getPlayerScores();

      // Get all users to include their total scores
      const users = await getUsers();

      // Filter to just return the user's own scores if they're a player
      const filteredScores =
        user.role === "player"
          ? scores.filter((score) => score.userId === user.id)
          : scores;

      // Get total scores for each player
      const totalScores = users
        .filter((u) => u.role === "player")
        .map((u) => ({
          userId: u.id,
          username: u.username,
          totalScore: u.totalScore || 0,
        }));

      return res.status(200).json({
        playerScores: filteredScores,
        totalScores,
      });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
