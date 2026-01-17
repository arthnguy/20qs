import { useState, useEffect, useContext } from "react";
import GameContext from "../GameContext.jsx";
import QuestionerSelection from "./QuestionerSelection.jsx";
import QuestionerActive from "./QuestionerActive.jsx";
import QuestionerWaiting from "./QuestionerWaiting.jsx";
import QuestionerWin from "./QuestionerWin.jsx";
import QuestionerLose from "./QuestionerLose.jsx";

const Questioner = () => {
    const { qaState, gameState } = useContext(GameContext);
    const [prevState, setPrevState] = useState("");
    const [currState, setCurrState] = useState(qaState);
    const components = {
        selection: <QuestionerSelection />,
        active: <QuestionerActive />,
        waiting: <QuestionerWaiting />,
        win: <QuestionerWin />,
        lose: <QuestionerLose />
    };

    useEffect(() => {
        setPrevState(currState);
        
        setTimeout(() => {
            setPrevState("");
            setCurrState(qaState);
        }, 200);
    }, [qaState, gameState]);

    return (
        <>
            {
                gameState !== "final" &&
                gameState === "questioner" &&
                <div className="absolute w-full h-full">
                    {components[qaState]}
                    {components[prevState]}
                </div>
            }
        </>
    );
};

export default Questioner;