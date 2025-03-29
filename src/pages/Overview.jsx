import { useContext } from "react";
import GameContext from "../GameContext";

const Overview = () => {
    const { char, gameState } = useContext(GameContext);

    return (
        <>
            {
                gameState === "overview" &&
                <div className="absolute w-full h-full flex flex-col justify-center items-center animate-slow-fade-out">
                    <p className="text-xl">The character was:</p>
                    <p className="text-4xl">{char}</p>
                </div>
            }
        </>
    );
}

export default Overview;