import { useContext } from "react";
import GameContext from "../GameContext";

const Late = () => {
    const { gameState } = useContext(GameContext);

    return (
        <>
            {
                gameState === "late" &&
                <div className="w-full h-full flex justify-center items-center">
                    <p className="text-4xl">In progress...</p>
                </div>
            }
        </>
    );
};

export default Late;