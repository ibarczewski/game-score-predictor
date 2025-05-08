import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getUserFromCookie } from "../lib/auth";

export default function GameCard({ game, userPrediction, scoreDetails = [] }) {
  const [pointsEarned, setPointsEarned] = useState(null);
  const user = getUserFromCookie();

  useEffect(() => {
    // Find the score for this game if it exists
    if (user && game.released && scoreDetails.length > 0) {
      const gameScore = scoreDetails.find(
        (score) => score.gameId === game.id && score.userId === user.id
      );

      if (gameScore) {
        setPointsEarned(gameScore.pointsEarned);
      }
    }
  }, [game, scoreDetails, user]);

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

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-44 w-full">
        <Image
          src={game.coverArt}
          alt={`${game.title} cover art`}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{game.title}</h2>
        <p className="text-gray-600 mb-2">
          Release Date: {formatDate(game.releaseDate)}
        </p>

        {game.released && game.actualScore && (
          <p className="font-bold mb-2">
            Review Score:{" "}
            <span className={getScoreColor(game.actualScore)}>
              {game.actualScore}
            </span>
            /100
          </p>
        )}

        {userPrediction && (
          <p className="text-gray-600 mb-2">
            Your Prediction: {userPrediction}/100
          </p>
        )}

        {userPrediction && game.released && pointsEarned !== null && (
          <p className="text-indigo-600 font-semibold mb-4">
            Points Earned: {pointsEarned}
          </p>
        )}

        <Link
          href={`/games/${game.id}`}
          className="block text-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          {game.released ? "View Details" : "Make Prediction"}
        </Link>
      </div>
    </div>
  );
}
