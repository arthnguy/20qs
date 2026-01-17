import { useState } from "react";
import socket from "../socket.js";
import logo from "../assets/logo.png";

const Home = () => {
    const [roomID, setRoomID] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [isJoining, setIsJoining] = useState(false);

    const handleJoinRoom = (roomID, playerName) => {
        if (!playerName.trim()) {
            alert("Please enter your name!");
            return;
        }
        
        setIsJoining(true);
        socket.emit("join_room", roomID || generateRoomID(), playerName.trim());
    };

    const generateRoomID = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && playerName.trim()) {
            handleJoinRoom(roomID, playerName);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen px-8">
            {/* Header Section */}
            <div className="flex flex-col items-center mb-16">
                <img 
                    className="w-48 h-auto mb-8 animate-pulse-scale drop-shadow-lg" 
                    src={logo} 
                    alt="20qs Logo"
                />
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-blue-800 mb-3">
                        Welcome to 20qs
                    </h1>
                    <p className="text-lg text-blue-600 max-w-lg leading-relaxed">
                        The classic guessing game, now multiplayer! 
                        Think of a character and challenge your friends.
                    </p>
                </div>
            </div>

            {/* Input Section */}
            <div className="w-full max-w-md space-y-4">
                <div className="relative">
                    <input
                        className="w-full h-14 px-6 text-xl border-2 border-blue-300 rounded-2xl 
                                 text-center focus:outline-none focus:ring-2 focus:ring-blue-300 
                                 focus:border-blue-500 shadow-md transition-all duration-200
                                 placeholder-blue-400 bg-white"
                        value={playerName}
                        onChange={e => setPlayerName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your name..."
                        maxLength={20}
                        disabled={isJoining}
                    />
                </div>

                <div className="relative">
                    <input
                        className="w-full h-12 px-4 text-lg border-2 border-blue-200 rounded-xl 
                                 text-center focus:outline-none focus:ring-2 focus:ring-blue-200 
                                 focus:border-blue-400 shadow-sm transition-all duration-200
                                 placeholder-blue-400 bg-white"
                        value={roomID}
                        onChange={e => setRoomID(e.target.value.toUpperCase())}
                        onKeyPress={handleKeyPress}
                        placeholder="Room ID (optional)"
                        maxLength={6}
                        disabled={isJoining}
                    />
                    <div className="text-xs text-blue-500 mt-2 text-center">
                        Leave empty to create a new room
                    </div>
                </div>

                <button 
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold 
                             rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 
                             transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                             disabled:transform-none"
                    onClick={() => handleJoinRoom(roomID, playerName)}
                    disabled={!playerName.trim() || isJoining}
                >
                    {isJoining ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                            Joining...
                        </div>
                    ) : (
                        roomID ? 'Join Room' : 'Create & Join Room'
                    )}
                </button>
            </div>

            {/* Footer Section */}
            <div className="mt-16 text-center">
                <p className="text-sm text-blue-500 mb-4">
                    New to 20qs? Click the ? button for rules
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm text-blue-400">
                    <span className="flex items-center">
                        <span className="text-lg mr-1">🎯</span>
                        Guess the character
                    </span>
                    <span className="text-blue-300">•</span>
                    <span className="flex items-center">
                        <span className="text-lg mr-1">❓</span>
                        Ask yes/no questions
                    </span>
                    <span className="text-blue-300">•</span>
                    <span className="flex items-center">
                        <span className="text-lg mr-1">🏆</span>
                        Score points
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Home;