import {
  getGames,
  saveGames,
  verifyToken,
  calculateScore,
  savePlayerScore,
  updateUserScore,
  getPlayerScores,
} from "../../lib/server-utils";

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
      const games = await getGames();
      return res.status(200).json(games);
    }

    if (req.method === "POST") {
      const { gameId, score } = req.body;

      if (!gameId || !score) {
        return res
          .status(400)
          .json({ message: "Game ID and score are required" });
      }

      const games = await getGames();
      const gameIndex = games.findIndex((g) => g.id === gameId);

      if (gameIndex === -1) {
        return res.status(404).json({ message: "Game not found" });
      }

      // Handle prediction submission
      if (req.body.type === "prediction") {
        if (user.role !== "player") {
          return res
            .status(403)
            .json({ message: "Only players can make predictions" });
        }

        const numericScore = parseInt(score);
        if (isNaN(numericScore) || numericScore < 1 || numericScore > 100) {
          return res
            .status(400)
            .json({ message: "Score must be between 1 and 100" });
        }

        // Check if user has already made a prediction
        const existingPredictionIndex = games[gameIndex].predictions.findIndex(
          (p) => p.userId === user.id
        );

        if (existingPredictionIndex >= 0) {
          // Update existing prediction
          games[gameIndex].predictions[existingPredictionIndex].score =
            numericScore;
        } else {
          // Add new prediction
          games[gameIndex].predictions.push({
            userId: user.id,
            username: user.username,
            score: numericScore,
          });
        }

        await saveGames(games);
        return res.status(200).json({ message: "Prediction submitted" });
      }

      // Handle actual score update by admin
      if (req.body.type === "actualScore") {
        if (user.role !== "admin") {
          return res
            .status(403)
            .json({ message: "Only admins can set actual scores" });
        }

        const numericScore = parseInt(score);
        if (isNaN(numericScore) || numericScore < 1 || numericScore > 100) {
          return res
            .status(400)
            .json({ message: "Score must be between 1 and 100" });
        }

        games[gameIndex].actualScore = numericScore;
        games[gameIndex].released = true;

        // Process all player predictions for this game and calculate scores
        for (const prediction of games[gameIndex].predictions) {
          const predictionScore = prediction.score;
          const pointsEarned = await calculateScore(
            predictionScore,
            numericScore
          );

          // Save the player's score for this game
          await savePlayerScore(
            gameId,
            prediction.userId,
            prediction.username,
            predictionScore,
            numericScore,
            pointsEarned
          );

          // Update the player's total score
          await updateUserScore(prediction.userId, pointsEarned);
        }

        await saveGames(games);
        return res.status(200).json({
          message: "Actual score updated and player scores calculated",
        });
      }

      return res.status(400).json({ message: "Invalid update type" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
