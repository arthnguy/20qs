import { useContext } from "react";
import GameContext from "../GameContext";

const QuestionerWaiting = () => {
    const { qaState } = useContext(GameContext);
    return (
        <>
            {
                qaState === "waiting" &&
                <div className="absolute w-full h-full flex justify-center items-center">
                    <p className="absolute animate-fade-in text-4xl">Waiting for answer...</p>
                </div>
            }
        </>
    );
};

export default QuestionerWaiting;