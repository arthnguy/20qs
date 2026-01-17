import { useState, useEffect, useContext } from "react";
import GameContext from "../GameContext.jsx";
import CharacterCard from "../components/CharacterCard.jsx";
import AnswererActive from "./AnswererActive.jsx";
import AnswererWaiting from "./AnswererWaiting.jsx";

const Answerer = () => {
    const { gameState, qaState } = useContext(GameContext);

    return (
        <>
            {gameState !== "final" && gameState === "answerer" && (
                <div className="absolute w-full h-full">
                    {/* Character Selection Screen */}
                    {qaState === "selection" && (
                        <div className="flex items-center justify-center h-full animate-fade-in">
                            <CharacterCard />
                        </div>
                    )}
                    
                    {/* Active Answering Interface */}
                    {qaState === "active" && <AnswererActive />}
                    
                    {/* Waiting Screen */}
                    {qaState === "waiting" && <AnswererWaiting />}
                </div>
            )}
        </>
    )
};

export default Answerer;