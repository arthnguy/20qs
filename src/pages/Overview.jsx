import { useContext, useState, useEffect } from "react";
import GameContext from "../GameContext";

const Overview = () => {
    const { char, gameState, currRound, roundCount } = useContext(GameContext);
    const [showCharacter, setShowCharacter] = useState(false);

    useEffect(() => {
        if (gameState === "overview") {
            // Delay the character reveal for dramatic effect
            setTimeout(() => setShowCharacter(true), 500);
        } else {
            setShowCharacter(false);
        }
    }, [gameState]);

    return (
        <>
            {
                gameState === "overview" &&
                <div className="absolute w-full h-full flex flex-col justify-center items-center animate-fade-in">
                    <div className="text-center max-w-lg">
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                                Round {currRound} Complete!
                            </h2>
                            
                            <div className="mb-6">
                                <p className="text-lg text-blue-600 mb-4">The character was:</p>
                                <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200">
                                    {showCharacter ? (
                                        <p className="text-4xl font-bold text-blue-800 animate-scale-spike">
                                            {char}
                                        </p>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-1">
                                            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                                            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <p className="text-blue-700 text-sm">
                                    {currRound < roundCount 
                                        ? `Preparing for round ${currRound + 1}...` 
                                        : "Calculating final scores..."
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default Overview;