import { useState, useEffect, useContext } from "react";
import GameContext from "../GameContext.jsx";
import CharacterCard from "../components/CharacterCard.jsx";
import AnswererActive from "./AnswererActive.jsx";
import AnswererWaiting from "./AnswererWaiting.jsx";

const Answerer = () => {
    const { gameState, qaState } = useContext(GameContext);
    const [styles, setStyles] = useState("");

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

    return (
        <>
            {
                gameState !== "final" &&
                gameState === "answerer" &&
                <div className="absolute w-full h-full flex flex-col justify-center items-center">
                    <AnswererActive />
                    <AnswererWaiting />
                    <div className={"w-full " + styles}>
                        <CharacterCard editable={qaState === "selection"} />
                    </div>
                </div>
            }
        </>
    )
};

export default Answerer;