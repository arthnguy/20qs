import { useContext } from "react";
import GameContext from "../GameContext";

const QuestionerWin = () => {
    const { qaState, gameState } = useContext(GameContext);

    return (
        <>
        {
            qaState === "win" && gameState !== "overview" &&
            <div className="absolute w-full h-full flex flex-col justify-center items-center animate-scale-spike">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-3xl">🎉</span>
                    </div>
                    <h2 className="text-4xl font-bold text-green-800 mb-3">
                        Correct!
                    </h2>
                    <p className="text-xl text-green-600 mb-6">
                        You guessed the character!
                    </p>
                    
                    <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 max-w-sm">
                        <p className="text-green-700 font-semibold mb-2">🏆 Points Earned!</p>
                        <p className="text-sm text-green-600">
                            You'll get bonus points for remaining questions
                        </p>
                    </div>
                </div>
            </div>
        }
        </>
    );
};

export default QuestionerWin;