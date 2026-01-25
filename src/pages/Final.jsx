import { useState, useEffect, useContext } from "react";
import GameContext from "../GameContext";
import socket from "../socket";

const Final = () => {
    const { gameState, playerList, scores, currRoomID, isHost, roundCount, playerIndex } = useContext(GameContext);
    const [ranking, setRanking] = useState([]);
    const [showPodium, setShowPodium] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [confetti, setConfetti] = useState(false);
    const [currentPlayerRank, setCurrentPlayerRank] = useState(0);

    useEffect(() => {
        if (gameState === "final") {
            const sortedRanking = scores.map((element, index) => [element, playerList[index], index]).toSorted().toReversed();
            setRanking(sortedRanking);
            
            // Find current player's rank using playerIndex from context
            const myRank = sortedRanking.findIndex(([score, name, originalIndex]) => originalIndex === playerIndex) + 1;
            setCurrentPlayerRank(myRank);

            // Staggered reveal animation
            setTimeout(() => setShowPodium(true), 500);
            setTimeout(() => setConfetti(true), 1000);
            setTimeout(() => setShowStats(true), 2000);
            setTimeout(() => setShowActions(true), 3500);
        }
    }, [gameState, scores, playerList, playerIndex]);

    const getMedalEmoji = (rank) => {
        switch (rank) {
            case 1: return "🥇";
            case 2: return "🥈";
            case 3: return "🥉";
            default: return "🏅";
        }
    };

    const getRankSuffix = (rank) => {
        if (rank === 1) return "st";
        if (rank === 2) return "nd";
        if (rank === 3) return "rd";
        return "th";
    };

    const getPersonalMessage = () => {
        if (currentPlayerRank === 1) {
            return "🎉 Congratulations! You're the 20qs Champion! 🎉";
        } else if (currentPlayerRank === 2) {
            return "🥈 Excellent work! You came in 2nd place!";
        } else if (currentPlayerRank === 3) {
            return "🥉 Great job! You earned 3rd place!";
        } else {
            return `🎯 You finished in ${currentPlayerRank}${getRankSuffix(currentPlayerRank)} place - well played!`;
        }
    };

    const startNewGame = () => {
        socket.emit("start_qa");
    };

    return (
        <>
            {gameState === "final" && (
                <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                    {/* Confetti Animation */}
                    {confetti && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {[...Array(50)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-2 h-2 animate-bounce"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `-10px`,
                                        backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)],
                                        animationDelay: `${Math.random() * 3}s`,
                                        animationDuration: `${3 + Math.random() * 2}s`,
                                        transform: `rotate(${Math.random() * 360}deg)`
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    <div className="relative z-10 w-full h-full flex flex-col">
                        {/* Header */}
                        <div className="text-center pt-8 pb-4 animate-slide-from-top">
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                                🏆 Game Complete! 🏆
                            </h1>
                            <p className="text-xl text-purple-200">
                                {roundCount} rounds • {playerList.length} players
                            </p>
                        </div>

                        {/* Personal Achievement Banner */}
                        <div className="text-center mb-6 opacity-0 animate-fade-in" style={{animationDelay: '0.5s'}}>
                            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl mx-4 p-4 border border-white border-opacity-30">
                                <p className="text-2xl font-bold text-white">
                                    {getPersonalMessage()}
                                </p>
                            </div>
                        </div>

                        {/* Podium */}
                        <div className="flex-1 flex items-center justify-center px-4">
                            {showPodium && (
                                <div className="w-full max-w-4xl">
                                    {/* Winner's Circle */}
                                    <div className="flex items-end justify-center space-x-4 mb-8">
                                        {/* 2nd Place */}
                                        {ranking.length > 1 && (
                                            <div className="flex flex-col items-center opacity-0 animate-slide-in-left" style={{animationDelay: '0.8s'}}>
                                                <div className="bg-gradient-to-b from-gray-300 to-gray-500 rounded-t-2xl p-6 text-center min-w-[140px] h-32 flex flex-col justify-center shadow-2xl">
                                                    <div className="text-4xl mb-2">🥈</div>
                                                    <div className="text-white font-bold text-lg">{ranking[1][1]}</div>
                                                    <div className="text-gray-200 text-sm">{ranking[1][0]} pts</div>
                                                </div>
                                                <div className="bg-gray-400 w-full h-16 rounded-b-lg flex items-center justify-center">
                                                    <span className="text-white font-bold text-2xl">2</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* 1st Place */}
                                        <div className="flex flex-col items-center opacity-0 animate-slide-in-top" style={{animationDelay: '1.2s'}}>
                                            <div className="bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-t-2xl p-6 text-center min-w-[160px] h-40 flex flex-col justify-center shadow-2xl border-4 border-yellow-200">
                                                <div className="text-5xl mb-2">👑</div>
                                                <div className="text-yellow-900 font-bold text-xl">{ranking[0][1]}</div>
                                                <div className="text-yellow-800 text-sm">{ranking[0][0]} pts</div>
                                                <div className="text-yellow-700 text-xs mt-1">CHAMPION</div>
                                            </div>
                                            <div className="bg-yellow-500 w-full h-20 rounded-b-lg flex items-center justify-center">
                                                <span className="text-yellow-900 font-bold text-3xl">1</span>
                                            </div>
                                        </div>

                                        {/* 3rd Place */}
                                        {ranking.length > 2 && (
                                            <div className="flex flex-col items-center opacity-0 animate-slide-in-right" style={{animationDelay: '1.0s'}}>
                                                <div className="bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-2xl p-6 text-center min-w-[140px] h-28 flex flex-col justify-center shadow-2xl">
                                                    <div className="text-4xl mb-2">🥉</div>
                                                    <div className="text-amber-100 font-bold text-lg">{ranking[2][1]}</div>
                                                    <div className="text-amber-200 text-sm">{ranking[2][0]} pts</div>
                                                </div>
                                                <div className="bg-amber-700 w-full h-12 rounded-b-lg flex items-center justify-center">
                                                    <span className="text-amber-100 font-bold text-2xl">3</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Full Rankings */}
                                    {showStats && (
                                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 animate-fade-in">
                                            <h3 className="text-2xl font-bold text-white text-center mb-4">📊 Final Standings</h3>
                                            <div className="space-y-3">
                                                {ranking.map(([score, name, originalIndex], index) => (
                                                    <div 
                                                        key={index}
                                                        className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                                                            originalIndex === playerIndex 
                                                                ? 'bg-blue-500 bg-opacity-50 border-2 border-blue-300' 
                                                                : 'bg-white bg-opacity-20'
                                                        }`}
                                                        style={{animationDelay: `${1.5 + index * 0.1}s`}}
                                                    >
                                                        <div className="flex items-center space-x-4">
                                                            <span className="text-2xl">{getMedalEmoji(index + 1)}</span>
                                                            <div>
                                                                <span className="text-white font-bold text-lg">{name}</span>
                                                                {originalIndex === playerIndex && (
                                                                    <span className="ml-2 text-blue-200 text-sm">(You)</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-white font-bold text-xl">{score}</div>
                                                            <div className="text-gray-300 text-sm">points</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {showActions && (
                            <div className="p-6 animate-slide-in-top">
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
                                    {isHost && (
                                        <button
                                            onClick={startNewGame}
                                            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                        >
                                            🎮 Play Again
                                        </button>
                                    )}
                                    
                                    <button
                                        onClick={() => navigator.clipboard.writeText(currRoomID)}
                                        className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                    >
                                        📋 Share Room Code
                                    </button>
                                    
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                    >
                                        🏠 New Game
                                    </button>
                                </div>
                                
                                {!isHost && (
                                    <p className="text-center text-purple-200 mt-4">
                                        Waiting for host to start a new game...
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Final;