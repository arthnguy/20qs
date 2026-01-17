import { useContext } from "react";
import GameContext from "../GameContext";

const QuestionerWaiting = () => {
    const { qaState } = useContext(GameContext);
    return (
        <>
            {
                qaState === "waiting" &&
                <div className="absolute w-full h-full flex flex-col justify-center items-center animate-fade-in">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">💭</span>
                        </div>
                        <h3 className="text-2xl font-semibold text-blue-800 mb-2">
                            Question Sent!
                        </h3>
                        <p className="text-lg text-blue-600 mb-6">
                            Waiting for the answerer to respond...
                        </p>
                        
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default QuestionerWaiting;