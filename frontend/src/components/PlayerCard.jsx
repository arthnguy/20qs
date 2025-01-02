import { useState, useEffect, useContext } from "react";
import GameContext from "../GameContext";

let recent;

const PlayerCard = ({ playerName, score, color, bold }) => {
    const { gameState } = useContext(GameContext);
    const [currScore, setCurrScore] = useState(0);

    let queued;

    const countUp = (newScore) => {
        const steps = 1000 / 16.67;
        const increment = (newScore - currScore) / steps;

        const timer = setInterval(() => {
            console.log(recent);
            if (recent !== "overview") {
                clearInterval(timer);
                setCurrScore(newScore);
            }

            setCurrScore(prevScore => {
                const nextScore = Math.ceil(prevScore + increment);

                if (nextScore >= newScore) {
                    clearInterval(timer);
                    return newScore;
                }

                return nextScore;
            });
        }, 16.67);
    };

    useEffect(() => { recent = gameState }, [gameState]);

    useEffect(() => {
        clearTimeout(queued);

        if (currScore < score && gameState !== "late") {
            queued = setTimeout(() => countUp(score), 2000);
        } else {
            setCurrScore(score);
        }
    }, [score]);

    return (
        <div className={"border-blue-400 p-2 text-xl border-2 border-l-0 w-40 rounded-r-lg animate-slide-from-left truncate " + ((color === "green") ? "bg-green-100" : ((color === "red") ? "bg-red-100" : ((color === "gray") ? "bg-gray-200" : ((color === "blue") ? "bg-blue-100" : "bg-white"))))}>
            <p className={"text-lg text-transparent bg-clip-text bg-gradient-to-r from-black via-black to-transparent " + (bold ? "font-semibold" : "")}>{playerName}</p>
            <div className="flex flex-row">
                <p className="justify-self-start text-xs">Score: {currScore}</p>
                {currScore !== score && <p className="text-xs text-green-500 ml-auto animate-fade-from-right">+{score - currScore}</p>}
            </div>
        </div>
    );
}

export default PlayerCard;