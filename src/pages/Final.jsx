import { useState, useEffect, useContext } from "react";
import GameContext from "../GameContext";

const Final = () => {
    const { gameState, playerList, scores } = useContext(GameContext);
    const [ranking, setRanking] = useState([]);
    const [gold, setGold] = useState(false);
    const [silver, setSilver] = useState(false);
    const [bronze, setBronze] = useState(false);

    useEffect(() => {
        setRanking(scores.map((element, index) => [element, playerList[index]]).toSorted().toReversed());

        if (gameState === "final") {
            setTimeout(() => setBronze(true), 1000);
            setTimeout(() => setSilver(true), 2000);
            setTimeout(() => setGold(true), 3000);
        }
    }, [gameState]);

    return (
        <>
            {
                gameState === "final" &&
                <div className="relative w-full h-full flex flex-col justify-center items-center">
                    <p className="animate-fade-in text-2xl mt-10">The final results are:</p>
                    <div className="w-full h-full flex flex-col justify-center items-center">
                        <p className={"min-h-[5.5rem] m-10 text-5xl text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,1)] " + (gold ? "animate-overshoot-from-left" : "")}>{gold ? ranking[0][1] : ""}</p>
                        <p className={"min-h-[4.75rem] m-10 text-4xl text-gray-300 drop-shadow-[0_2px_2px_rgba(0,0,0,1)] " + (silver ? "animate-overshoot-from-left" : "")}>{silver ? ranking[1][1] : ""}</p>
                        <p className={"min-h-[4.375rem] m-10 text-3xl text-amber-800 drop-shadow-[0_2px_2px_rgba(0,0,0,1)] " + (bronze ? "animate-overshoot-from-left" : "")}>{(ranking.length > 2 && bronze) ? ranking[2][1] : ""}</p>
                    </div>
                </div>
            }
        </>
    );
};

export default Final;