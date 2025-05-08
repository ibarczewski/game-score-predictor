import { useState, useEffect } from "react";
import { getUserFromCookie } from "../lib/auth";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const user = getUserFromCookie();
        if (!user) return;

        const response = await fetch("/api/scores", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Sort by total score in descending order
          const sortedScores = [...data.totalScores].sort(
            (a, b) => b.totalScore - a.totalScore
          );
          setScores(sortedScores);
        } else {
          setError("Failed to fetch leaderboard data");
        }
      } catch (err) {
        setError("Error loading leaderboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (scores.length === 0) {
    return <div className="text-center py-4">No scores available yet.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-semibold mb-4">Leaderboard</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Rank</th>
              <th className="py-2 px-4 text-left">Player</th>
              <th className="py-2 px-4 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((player, index) => (
              <tr
                key={player.userId}
                className={`border-b ${index === 0 ? "bg-yellow-50" : ""}`}
              >
                <td className="py-2 px-4">
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : index + 1}
                </td>
                <td className="py-2 px-4">{player.username}</td>
                <td className="py-2 px-4 text-right font-semibold">
                  {player.totalScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
