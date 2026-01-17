import { useContext, useState, useEffect } from "react";
import GameContext from "../GameContext.jsx";
import socket from "../socket.js";

const Lobby = () => {
    const { currRoomID, isHost, roundCount, questionTime, playerList, gameState } = useContext(GameContext);
    const [localRoundCount, setLocalRoundCount] = useState(roundCount);
    const [localQuestionTime, setLocalQuestionTime] = useState(questionTime);

    // Update local state when context changes (from other players)
    useEffect(() => {
        setLocalRoundCount(roundCount);
    }, [roundCount]);

    useEffect(() => {
        setLocalQuestionTime(questionTime);
    }, [questionTime]);

    const handleRoundCountChange = (e) => {
        const value = Number(e.target.value);
        // Prevent 0 or negative values
        if (value < 1) return;
        setLocalRoundCount(value);
        // Emit to server
        socket.emit("set_game_settings", currRoomID, value, localQuestionTime);
    };

    const handleQuestionTimeChange = (e) => {
        const value = Number(e.target.value);
        // Prevent values less than 10 (minimum)
        if (value < 10) return;
        setLocalQuestionTime(value);
        // Emit to server
        socket.emit("set_game_settings", currRoomID, localRoundCount, value);
    };

    return (
        <>
            {
                gameState === "lobby" &&
                <div className="flex flex-1 h-full justify-center items-center p-6">
                    <div className="w-full max-w-2xl animate-fade-in">
                        {/* Header Section */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-blue-800 mb-2">Game Lobby</h1>
                            <p className="text-blue-600">
                                {isHost ? "You're the host! Configure the game settings below." : "Waiting for the host to start the game..."}
                            </p>
                        </div>

                        {/* Players Section */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200 mb-6 animate-slide-in-top" style={{animationDelay: '0.1s'}}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-blue-800">Players</h2>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {playerList.length} joined
                                </span>
                            </div>
                            
                            <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                                {playerList.map((player, index) => (
                                    <div 
                                        key={index}
                                        className={`p-3 rounded-xl border-2 ${
                                            index === 0 
                                                ? 'bg-yellow-50 border-yellow-300 text-yellow-800' 
                                                : 'bg-blue-50 border-blue-200 text-blue-800'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <span className="text-lg mr-2">
                                                {index === 0 ? '👑' : '🎮'}
                                            </span>
                                            <span className="font-medium truncate">{player}</span>
                                        </div>
                                        {index === 0 ? 
                                            <span className="text-xs text-yellow-600">Host</span> :
                                            <span className="text-xs text-blue-500">Player</span>
                                        }
                                    </div>
                                ))}
                                
                                {/* Empty slots */}
                                {playerList.length < 8 && (
                                    <div className="p-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-400">
                                        <div className="flex items-center">
                                            <span className="text-lg mr-2">⏳</span>
                                            <span className="font-medium">Open slot</span>
                                        </div>
                                        <span className="text-xs text-gray-400">Waiting...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Game Settings */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200 mb-6 animate-slide-in-top" style={{animationDelay: '0.2s'}}>
                            <h2 className="text-xl font-semibold text-blue-800 mb-4">Game Settings</h2>
                            
                            <div className="space-y-6">
                                {/* Rounds Setting */}
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <label className="text-lg font-medium text-blue-800" htmlFor="round-count">
                                            Number of Rounds
                                        </label>
                                        <p className="text-sm text-blue-600 mt-1">
                                            Each player will be the answerer once per round
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <input
                                            className={`w-20 h-12 text-2xl text-center border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                                                isHost 
                                                    ? 'border-blue-300 bg-white focus:border-blue-500' 
                                                    : 'border-gray-200 bg-gray-50 text-gray-500'
                                            }`}
                                            disabled={!isHost}
                                            id="round-count"
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={localRoundCount}
                                            onChange={handleRoundCountChange}
                                        />
                                    </div>
                                </div>

                                {/* Question Time Setting */}
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <label className="text-lg font-medium text-blue-800" htmlFor="question-time">
                                            Question Time (seconds)
                                        </label>
                                        <p className="text-sm text-blue-600 mt-1">
                                            How long players have to ask each question
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <input
                                            className={`w-20 h-12 text-2xl text-center border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                                                isHost 
                                                    ? 'border-blue-300 bg-white focus:border-blue-500' 
                                                    : 'border-gray-200 bg-gray-50 text-gray-500'
                                            }`}
                                            disabled={!isHost}
                                            id="question-time"
                                            type="number"
                                            min="10"
                                            max="120"
                                            value={localQuestionTime}
                                            onChange={handleQuestionTimeChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Start Game Section */}
                        <div className="text-center animate-slide-in-top" style={{animationDelay: '0.3s'}}>
                            {isHost ? (
                                <div>
                                    <button 
                                        className={`w-full h-16 text-2xl font-semibold rounded-2xl shadow-lg transition-all duration-200 ${
                                            playerList.length > 1 && roundCount > 0 && questionTime > 0
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl transform hover:scale-105'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                        disabled={!isHost || playerList.length === 1 || roundCount === 0 || questionTime === 0}
                                        onClick={() => socket.emit("start_qa")}
                                    >
                                        {playerList.length === 1 
                                            ? 'Waiting for more players...' 
                                            : 'Start Game 🎯'
                                        }
                                    </button>
                                    
                                    {playerList.length === 1 && (
                                        <p className="text-sm text-blue-500 mt-3">
                                            Share the room ID <strong>{currRoomID}</strong> with friends to play!
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                                    <div className="flex items-center justify-center mb-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-lg">⏳</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-blue-800">
                                            Waiting for Host
                                        </h3>
                                    </div>
                                    <p className="text-blue-600">
                                        The host will start the game when everyone's ready
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default Lobby;