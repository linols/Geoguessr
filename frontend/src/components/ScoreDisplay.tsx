import React from 'react';
import { MapPin, Home, Navigation, Target, Trophy } from 'lucide-react';
import GuessMap from './GuessMap';
import { Location } from '../types/maps';

interface ScoreDisplayProps {
  distance: number;
  score: number;
  onNewGame: () => void;
  actualLocation: Location;
  guessedLocation: Location;
  isLastRound: boolean;
  totalScore: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  distance, 
  score, 
  onNewGame,
  actualLocation,
  guessedLocation,
  isLastRound,
  totalScore
}) => {
  const formatDistance = (dist: number) => {
    if (dist < 1) {
      return `${Math.round(dist * 1000)} m`;
    }
    return `${Math.round(dist)} km`;
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-indigo-500/20 max-w-2xl w-full mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Target className="w-8 h-8" />
          Résultats
        </h2>
        <p className="text-indigo-200 mt-2">Voyons voir où vous en êtes...</p>
      </div>
      
      <div className="p-8 space-y-8 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 border border-indigo-500/20 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-indigo-200">Distance</p>
            </div>
            <p className="text-3xl font-bold text-white">{formatDistance(distance)}</p>
          </div>
          
          <div className="bg-gray-800 border border-emerald-500/20 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-indigo-200">Score du round</p>
            </div>
            <p className="text-3xl font-bold text-emerald-400">{score} pts</p>
          </div>

          {isLastRound && (
            <div className="col-span-2 bg-gradient-to-r from-gray-800 to-gray-800/80 border border-indigo-500/20 p-6 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-indigo-200">Score total</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {totalScore} pts
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full h-[300px] bg-gray-800 border border-indigo-500/20 rounded-xl overflow-hidden">
          <GuessMap
            disabled={true}
            actualLocation={actualLocation}
            guessedLocation={guessedLocation}
          />
        </div>

        {isLastRound ? (
          <button
            onClick={onNewGame}
            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium text-lg shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Revenir à l'accueil
          </button>
        ) : (
          <button
            onClick={onNewGame}
            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium text-lg shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transform hover:-translate-y-0.5"
          >
            Round suivant
          </button>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay;