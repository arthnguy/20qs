import { useState, useEffect, useContext } from "react";
import GameContext from "../GameContext";

let recent;

const PlayerCard = ({ playerName, score, color, bold, compact = false, isCurrentPlayer = false }) => {
    const { gameState } = useContext(GameContext);
    const [currScore, setCurrScore] = useState(0);

    let queued;

    const countUp = (newScore) => {
        const steps = 1000 / 16.67;
        const increment = (newScore - currScore) / steps;

        const timer = setInterval(() => {
            if (recent !== "overview") {
                clearInterval(timer);
                setCurrScore(newScore);
            }

            setCurrScore(prevScore => {
                const nextScore = Math.ceil(prevScore + increment);

                if (nextScore >= newScore) {
                    clearInterval(timer);
                    return newScore;
                }

                return nextScore;
            });
        }, 16.67);
    };

    useEffect(() => { recent = gameState }, [gameState]);

    useEffect(() => {
        clearTimeout(queued);

        if (currScore < score && gameState === "overview") {
            queued = setTimeout(() => countUp(score), 2000);
        } else {
            setCurrScore(score);
        }
    }, [score]);

    // Status indicator mapping
    const getStatusInfo = (color) => {
        switch (color) {
            case "green": return { bg: "bg-green-100 border-green-300", icon: "✅", label: "Correct!" };
            case "red": return { bg: "bg-red-100 border-red-300", icon: "❌", label: "Out of questions" };
            case "gray": return { bg: "bg-blue-100 border-blue-300", icon: "🎯", label: "Answering" };
            case "blue": return { bg: "bg-purple-100 border-purple-300", icon: "⏳", label: "Joined late" };
            default: return { bg: "bg-white border-blue-200", icon: "🎮", label: "Playing" };
        }
    };

    const statusInfo = getStatusInfo(color);

    if (compact) {
        return (
            <div className={`
                relative flex items-center px-2 py-1 rounded-lg border transition-all duration-200
                ${statusInfo.bg}
                ${bold ? 'font-semibold' : ''}
                min-w-0 flex-shrink-0 w-24 h-12
            `}>
                {/* Status icon - smaller and positioned */}
                <span className="text-xs flex-shrink-0 mr-1">{statusInfo.icon}</span>
                
                {/* Player info container */}
                <div className="min-w-0 flex-1 text-center">
                    <p className="text-xs truncate font-medium leading-tight" title={playerName}>
                        {playerName}
                    </p>
                    
                    {/* Score (only show during game, not lobby) */}
                    {gameState !== "lobby" && (
                        <div className="text-xs text-gray-600 leading-tight">
                            {currScore}
                            {currScore !== score && (
                                <span className="text-green-600 ml-1">+{score - currScore}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Current player indicator - smaller */}
                {isCurrentPlayer && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
                )}
            </div>
        );
    }

    // Original vertical card layout (fallback)
    return (
        <div className={`
            border-blue-400 p-2 text-xl border-2 border-l-0 w-40 rounded-r-lg animate-slide-from-left truncate
            ${statusInfo.bg}
        `}>
            <p className={`text-lg text-transparent bg-clip-text bg-gradient-to-r from-black via-black to-transparent ${bold ? "font-semibold" : ""}`}>
                {playerName}
            </p>
            <div className="flex flex-row">
                <p className="justify-self-start text-xs">Score: {currScore}</p>
                {currScore !== score && <p className="text-xs text-green-500 ml-auto animate-fade-from-right">+{score - currScore}</p>}
            </div>
        </div>
    );
}

export default PlayerCard;