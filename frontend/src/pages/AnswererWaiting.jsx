import { useContext } from "react";
import GameContext from "../GameContext";

const AnswererWaiting = () => {
    const { qaState, gameState } = useContext(GameContext);
    return (
        <>
            {
                qaState === "waiting" && gameState !== "overview" &&
                <div className="absolute w-full h-full flex justify-center items-center">
                    <p className="absolute animate-fade-in text-4xl">Waiting for questions...</p>
                </div>
            }
        </>
    );
};

export default AnswererWaiting;