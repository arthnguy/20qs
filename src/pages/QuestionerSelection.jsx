import { useContext } from "react";
import GameContext from "../GameContext";

const QuestionerSelection = () => {
    const { qaState } = useContext(GameContext);

    return (
        <>
            {
                qaState === "selection" &&
                <div className="absolute w-full h-full flex justify-center items-center text-2xl animate-fade-in">
                    <p>Answerer is choosing character...</p>
                </div>
            }
        </>
    );
};

export default QuestionerSelection;