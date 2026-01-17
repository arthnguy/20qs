import { useContext } from "react";
import GameContext from "../GameContext";

const QuestionerLose = () => {
    const { qaState, gameState } = useContext(GameContext);

    return (
        <>
        {
            qaState === "lose" && gameState !== "overview" &&
            <div className="absolute w-full h-full flex flex-col justify-center items-center animate-scale-spike">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-3xl">🤔</span>
                    </div>
                    <h2 className="text-3xl font-bold text-orange-800 mb-3">
                        Out of Questions!
                    </h2>
                    <p className="text-lg text-orange-600 mb-6">
                        You used all 20 questions
                    </p>
                    
                    <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200 max-w-sm">
                        <p className="text-orange-700 font-semibold mb-2">Don't worry!</p>
                        <p className="text-sm text-orange-600">
                            You'll see the answer soon and get another chance next round
                        </p>
                    </div>
                </div>
            </div>
        }
        </>
    );
};

export default QuestionerLose;