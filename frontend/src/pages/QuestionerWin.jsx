import { useContext } from "react";
import GameContext from "../GameContext";

const QuestionerWin = () => {
    const { qaState, gameState } = useContext(GameContext);

    return (
        <>
        {
            qaState === "win" && gameState !== "overview" &&
            <div className="absolute animate-scale-spike w-full h-full flex justify-center items-center">
                <p className="text-4xl">You guessed right!</p>
            </div>
        }
        </>
    );
};

export default QuestionerWin;