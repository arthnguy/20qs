import { useState, useEffect, useContext } from "react";
import GameContext from "../GameContext.jsx";
import AttrList from "../components/AttrList.jsx";
import QuestionerSelection from "./QuestionerSelection.jsx";
import QuestionerActive from "./QuestionerActive.jsx";
import QuestionerWaiting from "./QuestionerWaiting.jsx";
import QuestionerWin from "./QuestionerWin.jsx";
import QuestionerLose from "./QuestionerLose.jsx";

const Questioner = () => {
    const { qaState, gameState, attrList, remainingQs } = useContext(GameContext);
    const [listAnims, setListAnims] = useState("");
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

    useEffect(() => {
        if (gameState === "questioner") {
            setListAnims("animate-slide-from-right");
        }
        if (gameState === "overview") {
            setListAnims("animate-slide-to-right");
        }
    }, [qaState, gameState])

    return (
        <>
            {
                gameState !== "final" &&
                <div className="absolute w-full h-full flex justify-between">
                    <div className="relative w-5/6 h-full">
                        {components[qaState]}
                        {components[prevState]}
                    </div>
                    <div className={"w-1/6 h-full p-2 " + listAnims}>
                        <AttrList attrs={attrList} remainingQs={remainingQs} />
                    </div>
                </div>
            }
        </>
    );
};

export default Questioner;