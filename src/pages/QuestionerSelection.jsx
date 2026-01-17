import { useContext } from "react";
import GameContext from "../GameContext";

const QuestionerSelection = () => {
    const { qaState } = useContext(GameContext);

    return (
        <>
            {
                qaState === "selection" &&
                <div className="absolute w-full h-full flex flex-col justify-center items-center animate-fade-in">
                    {/* Main waiting content */}
                    <div className="text-center max-w-lg">
                        {/* Animated character selection icon */}
                        <div className="mb-8">
                            <div className="relative inline-block">
                                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                                    <span className="text-4xl">🎭</span>
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                                    <span className="text-lg">✨</span>
                                </div>
                            </div>
                        </div>

                        {/* Main message */}
                        <h2 className="text-3xl font-bold text-blue-800 mb-4">
                            Character Selection in Progress
                        </h2>
                        <p className="text-xl text-blue-600 mb-8">
                            The answerer is choosing their character...
                        </p>

                        {/* Loading animation */}
                        <div className="flex justify-center items-center space-x-2 mb-8">
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                        </div>

                        {/* Helpful tip */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <span className="text-2xl">💡</span>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800 mb-2">Pro Tip</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        While you wait, think about your strategy! Start with broad questions like 
                                        "Is this character real?" or "Are they alive today?" to narrow down the possibilities quickly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default QuestionerSelection;