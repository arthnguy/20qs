import { useContext } from "react";
import GameContext from "../GameContext.jsx";
import socket from "../socket.js";

const Lobby = () => {
    const { currRoomID, isHost, roundCount, questionTime, playerList, gameState } = useContext(GameContext);

    return (
        <>
            {
                gameState === "lobby" &&
                <div className="flex flex-1 h-full justify-center items-center">
                    <div className="flex flex-col items-start justify-around p-2 bg-white border-gray-300 border-2 shadow-md w-3/4 h-1/2">
                        <div className="w-full h-1/2 flex flex-col items-start justify-around">
                            <div className="flex w-full justify-between">
                                <label className="mr-1 text-4xl" htmlFor="round-count">Rounds:</label>
                                <input
                                    className="w-1/2 focus:outline-none text-4xl border-b-2"
                                    disabled={!isHost}
                                    id="round-count"
                                    value={roundCount}
                                    onChange={e => {
                                        socket.emit("set_game_settings", currRoomID, Number(e.target.value), questionTime);
                                    }}
                                />
                            </div>
                            <div className="flex w-full justify-between">
                                <label className="mr-1 text-4xl" htmlFor="question-time">Question Time:</label>
                                <input
                                    className="w-1/2 focus:outline-none text-4xl border-b-2"
                                    disabled={!isHost}
                                    id="question-time"
                                    value={questionTime}
                                    onChange={e => {
                                        socket.emit("set_game_settings", currRoomID, roundCount, Number(e.target.value));
                                    }}
                                />
                            </div>
                        </div>
                        <button 
                            className="self-center w-full h-28 mt-auto bg-blue-600 text-white text-4xl"
                            disabled={!isHost || playerList.length === 1 || roundCount === 0 || questionTime === 0}
                            onClick={() => socket.emit("start_qa")}
                        >
                            Start Game
                        </button>
                    </div>
                </div>
            }
        </>
    );
};

export default Lobby;