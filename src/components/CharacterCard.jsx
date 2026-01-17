import { useState, useEffect, useContext } from "react";
import GameContext from "../GameContext.jsx";
import GameButton from "./GameButton.jsx";
import socket from "../socket.js";

let prevChar = "";

const CharacterCard = () => {
    const { qaState, gameState } = useContext(GameContext);
    const [char, setChar] = useState(gameState === "overview" ? prevChar : "");

    useEffect(() => {
        window.addEventListener('beforeunload', sendChar);
    }, []);

    const sendChar = () => {
        if (char.length > 0) {
            socket.emit("set_char", char);
            prevChar = char;
        }
    };

    return (
        <div className="flex justify-center items-center px-4">
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden w-full max-w-lg">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                    <h3 className="text-white font-semibold text-lg flex items-center justify-center">
                        🎭 Your Character
                    </h3>
                </div>
                
                <div className="p-6">
                    <div className="bg-blue-50 rounded-xl p-4">
                        <label className="block text-blue-700 font-medium mb-3 text-center">
                            {qaState === "selection" ? "Choose your character:" : "Your character is:"}
                        </label>
                        
                        {qaState !== "selection" ? (
                            <div className="bg-white rounded-lg p-4 min-h-[60px] flex items-center justify-center">
                                <p className="text-2xl font-bold text-blue-900 text-center">
                                    {char || "No character set"}
                                </p>
                            </div>
                        ) : (
                            <input
                                className="w-full bg-white rounded-lg px-4 py-3 text-2xl text-center text-blue-900 placeholder-blue-400 border-2 border-blue-200 focus:border-blue-400 focus:outline-none transition-colors font-medium"
                                id="char"
                                value={char}
                                placeholder="e.g., Albert Einstein"
                                onChange={e => setChar(e.target.value)}
                                maxLength={50}
                            />
                        )}
                    </div>
                    
                    {qaState === "selection" && (
                        <div className="mt-6 text-center">
                            <GameButton 
                                onClick={() => sendChar()} 
                                text="🎯 Set Character"
                                disabled={!char.trim()}
                            />
                            <div className="mt-3">
                                <p className="text-sm text-gray-600">
                                    💡 Choose someone famous, fictional, or historical
                                </p>
                                <div className="text-xs text-gray-500 mt-1">
                                    {char.length}/50 characters
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CharacterCard;