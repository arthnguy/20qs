import { useState, useEffect, useContext } from "react";
import GameContext from "../GameContext.jsx";
import GameButton from "./GameButton.jsx";
import socket from "../socket.js";

let prevChar = "";

const CharacterCard = () => {
    const { qaState, gameState } = useContext(GameContext);
    const [char, setChar] = useState(gameState === "overview" ? prevChar : "");

    useEffect(() => {
        window.addEventListener('beforeunload', sendChar);
    }, []);

    const sendChar = () => {
        if (char.length > 0) {
            socket.emit("set_char", char);
            prevChar = char;
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="w-1/2 bg-gray-50 mb-2 border-gray-200 border-2 p-2 flex flex-col items-center shadow-md">
                <p>Your character is:</p>
                {
                    qaState !== "selection" &&
                    <p className="h-12 text-3xl">{char}</p>
                }
                {
                    qaState === "selection" &&
                    <input
                        className="w-full focus:outline-none h-12 text-3xl text-center"
                        id="char"
                        value={char}
                        placeholder="John Doe"
                        onChange={e => setChar(e.target.value)}
                    />
                }
            </div>
            {
                qaState === "selection" &&
                <GameButton onClick={() => sendChar()} text="Set character"/>
            }
        </div>
    );
};

export default CharacterCard;