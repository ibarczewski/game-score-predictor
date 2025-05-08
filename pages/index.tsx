import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import GameCard from "../components/GameCard";
import Leaderboard from "../components/Leaderboard";
import { getUserFromCookie } from "../lib/auth";

export default function Home() {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playerScore, setPlayerScore] = useState(0);
  const [scoreDetails, setScoreDetails] = useState([]);

  useEffect(() => {
    const userFromCookie = getUserFromCookie();
    if (!userFromCookie) {
      router.push("/login");
      return;
    }

    setUser(userFromCookie);

    // Fetch games
    const fetchGames = async () => {
      try {
        const response = await fetch("/api/games", {
          headers: {
            Authorization: `Bearer ${userFromCookie.token}`,
          },
        });

        if (response.ok) {
          const gamesData = await response.json();
          setGames(gamesData);
        } else {
          console.error("Failed to fetch games");
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    // Fetch player scores
    const fetchScores = async () => {
      try {
        const response = await fetch("/api/scores", {
          headers: {
            Authorization: `Bearer ${userFromCookie.token}`,
          },
        });

        if (response.ok) {
          const scoresData = await response.json();

          // Find this player's total score
          const playerTotalScore = scoresData.totalScores.find(
            (s) => s.userId === userFromCookie.id
          );

          if (playerTotalScore) {
            setPlayerScore(playerTotalScore.totalScore);
          }

          setScoreDetails(scoresData.playerScores);
        } else {
          console.error("Failed to fetch scores");
        }
      } catch (error) {
        console.error("Error fetching scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
    fetchScores();
  }, [router]);

  const getUserPrediction = (game) => {
    if (!user) return null;

    const prediction = game.predictions.find((p) => p.userId === user.id);
    return prediction ? prediction.score : null;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard | Game Score Predictor">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Game Dashboard</h1>

        {user && user.role === "player" && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
            <div className="flex items-center">
              <div className="font-bold text-xl">
                Total Score: {playerScore} points
              </div>
            </div>
            <p className="text-sm mt-2">
              Scoring: Exact match = 6 points | Within 2 points = 3 points |
              Within 3 points = 1 point
            </p>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-4">Games To Be Released</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games
            .filter((game) => !game.released)
            .map((game) => (
              <GameCard
                key={game.id}
                game={game}
                userPrediction={getUserPrediction(game)}
                scoreDetails={scoreDetails}
              />
            ))}
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Released Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games
            .filter((game) => game.released)
            .map((game) => (
              <GameCard
                key={game.id}
                game={game}
                userPrediction={getUserPrediction(game)}
                scoreDetails={scoreDetails}
              />
            ))}
          {games.filter((game) => game.released).length === 0 && (
            <p className="text-gray-500">No games have been released yet.</p>
          )}
        </div>

        {/* Leaderboard */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">Leaderboard</h2>
        <Leaderboard />
      </div>
    </Layout>
  );
}
