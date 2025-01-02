import { useState, useEffect, useContext } from "react";
import GameContext from "../GameContext";

const QuestionerSelection = () => {
    const { qaState, gameState } = useContext(GameContext);
    const [styles, setStyles] = useState("");

    useEffect(() => {
        if (qaState !== "selection") {
            setStyles("animate-fade-out");
        }
    }, [qaState]);

    return (
        <>
            {
                gameState !== "overview" &&
                <div className={"absolute w-full h-full flex justify-center items-center text-2xl animate-fade-in " + styles}>
                    <p>Answerer is choosing character...</p>
                </div>
            }
        </>
    );
};

export default QuestionerSelection;