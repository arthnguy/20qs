import { useContext } from "react";
import GameContext from "../GameContext";

const Late = () => {
    const { gameState, currRound, roundCount } = useContext(GameContext);

    return (
        <>
            {
                gameState === "late" &&
                <div className="w-full h-full flex flex-col justify-center items-center animate-fade-in">
                    <div className="text-center max-w-md">
                        <div className="mb-8">
                            <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-3xl">⏳</span>
                            </div>
                            <h2 className="text-3xl font-bold text-blue-800 mb-2">Game in Progress</h2>
                            <p className="text-lg text-blue-600">
                                Round {currRound} of {roundCount} is currently active
                            </p>
                        </div>
                        
                        <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                            <p className="text-blue-700 mb-4">
                                You joined during an active round. Don't worry!
                            </p>
                            <div className="space-y-2 text-sm text-blue-600">
                                <p>• Watch the current round as a spectator</p>
                                <p>• You'll join the action in the next round</p>
                                <p>• Use this time to see how the game works</p>
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                            </div>
                            <p className="text-sm text-blue-500 mt-2">Waiting for next round...</p>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default Late;