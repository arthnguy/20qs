import { useContext } from "react";
import GameContext from "../GameContext";

const QuestionerLose = () => {
    const { qaState, gameState } = useContext(GameContext);

    return (
        <>
        {
            qaState === "lose" && gameState !== "overview" &&
            <div className="absolute animate-scale-spike w-full h-full flex justify-center items-center">
                <p className="text-4xl">You couldn't guess it</p>
            </div>
        }
        </>
    );
};

export default QuestionerLose;