import { useContext } from "react";
import GameContext from "../GameContext";

const AnswererWaiting = () => {
    const { qaState, gameState, char } = useContext(GameContext);
    return (
        <>
            {
                qaState === "waiting" && gameState !== "overview" &&
                <div className="absolute w-full h-full flex flex-col justify-center items-center animate-fade-in">
                    {/* Character Reminder Card */}
                    {char && (
                        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden max-w-sm">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3">
                                <h3 className="text-white font-semibold text-center">
                                    🎭 Your Character
                                </h3>
                            </div>
                            <div className="p-6 text-center">
                                <p className="text-2xl font-bold text-blue-900 mb-2">
                                    {char}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Remember this when answering questions!
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">❓</span>
                        </div>
                        <h3 className="text-2xl font-semibold text-green-800 mb-2">
                            Ready to Answer
                        </h3>
                        <p className="text-lg text-green-600 mb-6">
                            Waiting for the next question...
                        </p>
                        
                        <div className="bg-green-50 rounded-xl p-4 border border-green-200 max-w-sm">
                            <p className="text-sm text-green-700">
                                💡 Think about your character while you wait!
                            </p>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default AnswererWaiting;