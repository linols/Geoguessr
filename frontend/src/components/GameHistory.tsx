import React from 'react';
import { HistoryScore } from '../types/maps';
import { Trophy, ArrowRight, Loader, Globe2, Crown, Calendar } from 'lucide-react';

interface GameHistoryProps {
  history: HistoryScore[];
  onStartNewGame: () => void;
  currentScore: number | null;
  isLastRound: boolean;
  isLoading?: boolean;
}

const GameHistory: React.FC<GameHistoryProps> = ({ 
  history, 
  onStartNewGame, 
  currentScore,
  isLastRound,
  isLoading = false
}) => {
  const sortedHistory = [...history].sort((a, b) => b.score - a.score);
  const topScores = sortedHistory.slice(0, 10);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              Enregistrement du score...
            </h2>
          </div>
          <div className="p-20 flex items-center justify-center">
            <div className="animate-spin">
              <Loader className="w-12 h-12 text-indigo-500" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Globe2 className="w-8 h-8" />
            {currentScore !== null ? 'Bienvenue sur LinoGuessr !' : 'GeoGuessr Clone'}
          </h2>
          <p className="text-indigo-200 mt-2">Testez vos connaissances géographiques</p>
        </div>

        {currentScore !== null && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 border-b border-indigo-100">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-lg text-indigo-900 font-medium">Score final</p>
                <p className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {currentScore} points
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Crown className="w-6 h-6 text-amber-500" />
            <h3 className="text-2xl font-bold text-white">Meilleurs scores</h3>
          </div>
          
          <div className="space-y-4">
            {topScores.map((score, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-6">
                  <span className={`text-2xl font-bold ${
                    index === 0 ? 'text-amber-500' :
                    index === 1 ? 'text-gray-300' :
                    index === 2 ? 'text-amber-700' :
                    'text-gray-500'
                  }`}>#{index + 1}</span>
                  <div>
                    <p className="text-2xl font-bold text-white">{score.score} points</p>
                    <p className="text-sm text-indigo-200 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(score.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onStartNewGame}
            className="mt-8 w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium text-lg shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            Nouvelle partie
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameHistory;