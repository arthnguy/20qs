import { useContext } from "react";
import logo from "../assets/logo.png";
import GameContext from "../GameContext.jsx";
import PlayerList from "../components/PlayerList.jsx";
import Questioner from "./Questioner.jsx";
import Answerer from "./Answerer.jsx";
import Lobby from "./Lobby.jsx";
import Overview from "./Overview.jsx";
import Final from "./Final.jsx";
import Late from "./Late.jsx";

const Game = () => {
    const { playerList, scores, statuses, currRoomID, gameState, playerIndex, currRound, roundCount } = useContext(GameContext);

    return (
        <div className="flex flex-col h-full">
            <div className="relative flex justify-between items-center z-10 bg-white shadow-md border-blue-400 border-b-2 animate-slide-from-top">
                <img className="m-2 h-10 w-auto" src={logo} />
                {gameState !== "lobby" && <p className="w-full text-center absolute text-2xl">Round {currRound}/{roundCount}</p>}
                <p className="m-2 text-lg">Room ID: {currRoomID}</p>
            </div>
            <div className="flex h-full justify-start">
                <PlayerList names={playerList} scores={scores} statuses={statuses} playerIndex={playerIndex} />
                <div className="relative w-full h-full">
                    <Lobby />
                    <Questioner />
                    <Answerer />
                    <Overview />
                    <Final />
                    <Late />
                </div>
            </div>
        </div>
    );
};

export default Game;