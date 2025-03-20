import React, { useState, useCallback, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import StreetView from './components/StreetView';
import GuessMap from './components/GuessMap';
import ScoreDisplay from './components/ScoreDisplay';
import GameHistory from './components/GameHistory';
import { Location, GameState, getRandomLocation, HistoryScore } from './types/maps';
import { MapPin, Compass } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBwjQC6fpOgmpgtalJ3NAzj6G-KO8LAS2Q';
const TOTAL_ROUNDS = 5;

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [maps, setMaps] = useState<typeof google.maps | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    currentLocation: { lat: 0, lng: 0 },
    guessedLocation: null,
    score: null,
    distance: null,
    isGameOver: false,
    currentRound: 1,
    totalScore: 0,
    gameStarted: false
  });
  const [history, setHistory] = useState<HistoryScore[]>([]);
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then((googleMaps) => {
      setMaps(googleMaps);
      setIsLoaded(true);
      getRandomLocation(googleMaps).then(location => {
        setGameState(prev => ({ ...prev, currentLocation: location }));
      });
    });

    fetch('http://localhost:5000/scores')
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error('Erreur lors du chargement de l\'historique:', err));
  }, []);

  const calculateDistance = (pos1: Location, pos2: Location): number => {
    const R = 6371;
    const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
    const dLon = (pos2.lng - pos1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateScore = (distance: number): number => {
    const maxScore = 5000;
    const maxDistance = 20000;
    return Math.round(Math.max(0, maxScore * (1 - distance / maxDistance)));
  };

  const handleGuess = useCallback((location: Location) => {
    setGameState(prev => ({
      ...prev,
      guessedLocation: location,
    }));
  }, []);

  const submitFinalScore = useCallback(async (totalScore: number) => {
    setIsSubmittingScore(true);
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    try {
      await fetch('http://localhost:5000/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: totalScore,
          date: now
        })
      });

      const response = await fetch('http://localhost:5000/scores');
      const newHistory = await response.json();
      setHistory(newHistory);
    } catch (err) {
      console.error('Erreur lors de l\'envoi du score:', err);
    } finally {
      setIsSubmittingScore(false);
    }
  }, []);

  const handleConfirmGuess = useCallback(() => {
    if (!gameState.guessedLocation) return;

    const distance = calculateDistance(gameState.currentLocation, gameState.guessedLocation);
    const roundScore = calculateScore(distance);
    const newTotalScore = (gameState.totalScore || 0) + roundScore;
    const isLastRound = gameState.currentRound === TOTAL_ROUNDS;

    setGameState(prev => ({
      ...prev,
      distance,
      score: roundScore,
      totalScore: newTotalScore,
      isGameOver: true
    }));

    if (isLastRound) {
      submitFinalScore(newTotalScore);
    }
  }, [gameState.guessedLocation, gameState.currentLocation, gameState.currentRound, gameState.totalScore, submitFinalScore]);

  const startNewGame = useCallback(() => {
    if (!maps) return;
    
    getRandomLocation(maps).then(location => {
      setGameState({
        currentLocation: location,
        guessedLocation: null,
        score: null,
        distance: null,
        isGameOver: false,
        currentRound: 1,
        totalScore: 0,
        gameStarted: true
      });
    });
  }, [maps]);

  const continueToNextRound = useCallback(() => {
    if (!maps) return;
    
    getRandomLocation(maps).then(location => {
      setGameState(prev => ({
        ...prev,
        currentLocation: location,
        guessedLocation: null,
        score: null,
        distance: null,
        isGameOver: false,
        currentRound: prev.currentRound + 1,
      }));
    });
  }, [maps]);

  const handleFinishGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStarted: false }));
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin">
          <Compass className="w-12 h-12 text-indigo-500" />
        </div>
      </div>
    );
  }

  if (!gameState.gameStarted || isSubmittingScore) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-8 flex items-center justify-center">
        <GameHistory 
          history={history} 
          onStartNewGame={startNewGame}
          currentScore={gameState.totalScore}
          isLastRound={gameState.currentRound === TOTAL_ROUNDS && gameState.isGameOver}
          isLoading={isSubmittingScore}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 relative">
      <header className="absolute top-0 left-0 right-0 z-10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <MapPin className="w-10 h-10 text-indigo-500" />
              LinoGuessr
            </h1>
            <div className="text-white">
              <span className="text-indigo-200">Round </span>
              <span className="text-2xl font-bold">{gameState.currentRound}</span>
              <span className="text-indigo-200"> / {TOTAL_ROUNDS}</span>
              <div className="text-sm text-indigo-200">
                Total Score: <span className="text-white font-bold">{gameState.totalScore}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative w-full h-screen">
        <div className="w-full h-full">
          <StreetView position={gameState.currentLocation} />
        </div>
        
        {!gameState.isGameOver ? (
          <div className="absolute bottom-8 right-8 z-10">
            <GuessMap
              onGuess={handleGuess}
              disabled={gameState.isGameOver}
            />
            <button
              onClick={handleConfirmGuess}
              disabled={!gameState.guessedLocation}
              className={`mt-4 w-full py-4 px-6 rounded-xl transition-all transform hover:-translate-y-0.5 font-medium text-lg ${
                gameState.guessedLocation
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Confirmer la position
            </button>
          </div>
        ) : (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-2xl px-4">
            <ScoreDisplay
              distance={gameState.distance!}
              score={gameState.score!}
              onNewGame={gameState.currentRound === TOTAL_ROUNDS ? handleFinishGame : continueToNextRound}
              actualLocation={gameState.currentLocation}
              guessedLocation={gameState.guessedLocation!}
              isLastRound={gameState.currentRound === TOTAL_ROUNDS}
              totalScore={gameState.totalScore}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;