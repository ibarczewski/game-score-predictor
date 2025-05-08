import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Layout from "../../components/Layout";
import { getUserFromCookie, isAdmin } from "../../lib/auth";

export default function GameDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [game, setGame] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predictionScore, setPredictionScore] = useState("");
  const [actualScore, setActualScore] = useState("");
  const [submitStatus, setSubmitStatus] = useState({
    message: "",
    isError: false,
  });
  const [pointsEarned, setPointsEarned] = useState(null);

  useEffect(() => {
    const userFromCookie = getUserFromCookie();
    if (!userFromCookie) {
      router.push("/login");
      return;
    }

    setUser(userFromCookie);

    if (id) {
      fetchGame();
      fetchScores();
    }
  }, [id, router]);

  const fetchGame = async () => {
    try {
      const user = getUserFromCookie();
      if (!user) return;

      const response = await fetch("/api/games", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        const games = await response.json();
        const currentGame = games.find((g) => g.id === parseInt(id));

        if (currentGame) {
          setGame(currentGame);

          // Set existing prediction if any
          const userPrediction = currentGame.predictions.find(
            (p) => p.userId === user.id
          );
          if (userPrediction) {
            setPredictionScore(userPrediction.score.toString());
          }

          // Set actual score if available
          if (currentGame.actualScore !== null) {
            setActualScore(currentGame.actualScore.toString());
          }
        } else {
          setSubmitStatus({ message: "Game not found", isError: true });
        }
      } else {
        setSubmitStatus({
          message: "Failed to fetch game details",
          isError: true,
        });
      }
    } catch (error) {
      console.error("Error fetching game:", error);
      setSubmitStatus({ message: "An error occurred", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const fetchScores = async () => {
    if (!id) return;

    try {
      const user = getUserFromCookie();
      if (!user) return;

      const response = await fetch("/api/scores", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        const scoreData = await response.json();
        const gameScore = scoreData.playerScores.find(
          (score) => score.gameId === parseInt(id) && score.userId === user.id
        );

        if (gameScore) {
          setPointsEarned(gameScore.pointsEarned);
        }
      }
    } catch (error) {
      console.error("Error fetching scores:", error);
    }
  };

  const handlePredictionSubmit = async (e) => {
    e.preventDefault();
    try {
      const score = parseInt(predictionScore);
      if (isNaN(score) || score < 1 || score > 100) {
        setSubmitStatus({
          message: "Score must be between 1 and 100",
          isError: true,
        });
        return;
      }

      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          gameId: parseInt(id),
          score,
          type: "prediction",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          message: "Prediction submitted successfully!",
          isError: false,
        });
        fetchGame(); // Refresh game data
      } else {
        setSubmitStatus({
          message: data.message || "Failed to submit prediction",
          isError: true,
        });
      }
    } catch (error) {
      console.error("Error submitting prediction:", error);
      setSubmitStatus({ message: "An error occurred", isError: true });
    }
  };

  const handleActualScoreSubmit = async (e) => {
    e.preventDefault();
    try {
      const score = parseInt(actualScore);
      if (isNaN(score) || score < 1 || score > 100) {
        setSubmitStatus({
          message: "Score must be between 1 and 100",
          isError: true,
        });
        return;
      }

      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          gameId: parseInt(id),
          score,
          type: "actualScore",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          message: "Review score updated successfully!",
          isError: false,
        });
        fetchGame(); // Refresh game data
        fetchScores(); // Refresh score data
      } else {
        setSubmitStatus({
          message: data.message || "Failed to update review score",
          isError: true,
        });
      }
    } catch (error) {
      console.error("Error updating review score:", error);
      setSubmitStatus({ message: "An error occurred", isError: true });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getScoreColor = (score) => {
    if (!score) return "";
    if (score >= 75) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
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

  if (!game) {
    return (
      <Layout>
        <div className="text-center">
          <p className="text-xl text-red-500">Game not found</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${game.title} | Game Score Predictor`}>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Game Cover Art */}
          <div className="md:w-1/3">
            <div className="relative h-80 w-full">
              <Image
                src={game.coverArt}
                alt={`${game.title} cover art`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Game Details */}
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
            <p className="text-gray-600 mb-4">
              Release Date: {formatDate(game.releaseDate)}
            </p>

            {/* Actual Score (if released) */}
            {game.released && game.actualScore && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Review Score</h2>
                <p className="text-2xl font-bold">
                  <span className={getScoreColor(game.actualScore)}>
                    {game.actualScore}/100
                  </span>
                </p>
              </div>
            )}

            {/* Player's Prediction */}
            {user && user.role === "player" && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Your Prediction</h2>
                <form onSubmit={handlePredictionSubmit} className="max-w-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={predictionScore}
                      onChange={(e) => setPredictionScore(e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md"
                      required
                      disabled={game.released}
                    />
                    <span className="text-gray-700">/100</span>

                    {!game.released && (
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ml-2"
                      >
                        Submit
                      </button>
                    )}
                  </div>

                  {game.released && (
                    <p className="text-gray-500 italic">
                      This game has been released and predictions are now
                      closed.
                    </p>
                  )}
                </form>
              </div>
            )}

            {/* Player's Prediction Results */}
            {user &&
              user.role === "player" &&
              game.released &&
              pointsEarned !== null && (
                <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h3 className="text-lg font-semibold text-blue-800">
                    Your Results
                  </h3>
                  <div className="flex items-center mt-2">
                    <span className="text-gray-700 mr-2">Your Prediction:</span>
                    <span className="font-bold">{predictionScore}/100</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-gray-700 mr-2">Actual Score:</span>
                    <span
                      className={`font-bold ${getScoreColor(game.actualScore)}`}
                    >
                      {game.actualScore}/100
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-gray-700 mr-2">Points Earned:</span>
                    <span className="font-bold text-indigo-600">
                      {pointsEarned} points
                    </span>
                  </div>
                </div>
              )}

            {/* Admin Score Update Form */}
            {user && user.role === "admin" && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-semibold mb-2">
                  Admin: Update Actual Review Score
                </h2>
                <form onSubmit={handleActualScoreSubmit} className="max-w-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={actualScore}
                      onChange={(e) => setActualScore(e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                    <span className="text-gray-700">/100</span>

                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded ml-2"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Status Messages */}
            {submitStatus.message && (
              <div
                className={`mt-4 p-3 rounded ${
                  submitStatus.isError
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {submitStatus.message}
              </div>
            )}
          </div>
        </div>

        {/* Player Predictions (Admin view) */}
        {user && user.role === "admin" && game.predictions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Player Predictions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Player</th>
                    <th className="py-2 px-4 text-left">Prediction</th>
                  </tr>
                </thead>
                <tbody>
                  {game.predictions.map((prediction, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-2 px-4">{prediction.username}</td>
                      <td className="py-2 px-4">{prediction.score}/100</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={() => router.push("/")}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
}
