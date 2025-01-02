import { useState, useEffect, useContext } from "react";
import GameContext from "../GameContext.jsx";
import CharacterCard from "../components/CharacterCard.jsx";
import AnswererActive from "./AnswererActive.jsx";
import AnswererWaiting from "./AnswererWaiting.jsx";

const Answerer = () => {
    const { gameState, qaState } = useContext(GameContext);
    const [prevState, setPrevState] = useState(qaState);
    const [currState, setCurrState] = useState("");
    const [styles, setStyles] = useState("");
    const components = {
        active: <AnswererActive />,
        waiting: <AnswererWaiting />
    };

    useEffect(() => {
        if (qaState === "selection") {
            setStyles("animate-fade-in");
        } else {
            setStyles("mt-auto animate-slide-from-mid-to-bottom mb-2");
        }

        if (gameState === "overview") {
            setStyles("mt-auto animate-slide-to-bottom mb-2")
        }
    }, [qaState, gameState]);

    useEffect(() => {
        setPrevState(currState);
        
        setTimeout(() => {
            setPrevState("");
            setCurrState(qaState);
        }, 200);
    }, [qaState]);

    return (
        <>
            {
                gameState !== "final" &&
                <div className="absolute w-full h-full flex flex-col justify-center items-center">
                    {components[qaState]}
                    {components[prevState]}
                    <div className={"w-full " + styles}>
                        <CharacterCard editable={qaState === "selection"} />
                    </div>
                </div>
            }
        </>
    )
};

export default Answerer;