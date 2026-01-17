import { useContext, useState } from "react";
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
    const { playerList, scores, statuses, currRoomID, gameState, playerIndex, currRound, roundCount, isHost } = useContext(GameContext);
    const [roomCopied, setRoomCopied] = useState(false);

    const copyRoomCode = async () => {
        try {
            await navigator.clipboard.writeText(currRoomID);
            setRoomCopied(true);
            setTimeout(() => setRoomCopied(false), 2000);
        } catch (err) {
            console.log('Clipboard not supported');
        }
    };

    const getGameStateInfo = () => {
        switch (gameState) {
            case "lobby":
                return {
                    title: "Game Lobby",
                    subtitle: `${playerList.length} player${playerList.length !== 1 ? 's' : ''} joined`,
                    color: "text-blue-800"
                };
            case "questioner":
            case "answerer":
                return {
                    title: `Round ${currRound} of ${roundCount}`,
                    subtitle: gameState === "answerer" ? "You're the answerer!" : "Ask your questions!",
                    color: gameState === "answerer" ? "text-green-800" : "text-blue-800"
                };
            case "overview":
                return {
                    title: `Round ${currRound} Complete`,
                    subtitle: "Calculating scores...",
                    color: "text-purple-800"
                };
            case "final":
                return {
                    title: "Game Complete!",
                    subtitle: "Final results",
                    color: "text-yellow-800"
                };
            case "late":
                return {
                    title: `Round ${currRound} in Progress`,
                    subtitle: "You'll join next round",
                    color: "text-orange-800"
                };
            default:
                return {
                    title: "20qs",
                    subtitle: "",
                    color: "text-blue-800"
                };
        }
    };

    const stateInfo = getGameStateInfo();

    return (
        <div className="flex flex-col h-full">
            <div className="relative bg-white shadow-lg border-b-2 border-blue-400 animate-slide-from-top">
                <div className="flex items-center justify-between px-4 py-4 gap-4 min-h-16">
                    <div className="flex items-center space-x-4 flex-shrink-0">
                        <img className="h-10 w-auto" src={logo} alt="20qs" />
                        <div className="hidden sm:block">
                            <h1 className={`text-lg font-bold ${stateInfo.color}`}>
                                {stateInfo.title}
                            </h1>
                            {stateInfo.subtitle && (
                                <p className="text-sm text-gray-600">
                                    {stateInfo.subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    {gameState !== "lobby" && (
                        <div className="hidden md:flex flex-1 justify-center mx-4 min-w-0 max-w-md">
                            <PlayerList 
                                names={playerList} 
                                scores={scores} 
                                statuses={statuses} 
                                playerIndex={playerIndex} 
                                compact={true} 
                            />
                        </div>
                    )}

                    <div className="flex items-center space-x-3 flex-shrink-0">
                        <div className="text-right">
                            <div className="flex items-center space-x-2">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Room</p>
                                    <p className="text-lg font-mono font-bold text-blue-800">
                                        {currRoomID}
                                    </p>
                                </div>
                                <button
                                    onClick={copyRoomCode}
                                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                                    title="Copy room code"
                                >
                                    {roomCopied ? (
                                        <span className="text-green-600 text-sm">✓</span>
                                    ) : (
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {isHost && (
                            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium border border-yellow-300">
                                👑 Host
                            </div>
                        )}
                    </div>
                </div>

                {gameState !== "lobby" && (
                    <div className="md:hidden px-4 pb-3 border-t border-gray-200">
                        <PlayerList 
                            names={playerList} 
                            scores={scores} 
                            statuses={statuses} 
                            playerIndex={playerIndex} 
                            compact={true} 
                        />
                    </div>
                )}

                {/* Progress Bar for Rounds */}
                {gameState !== "lobby" && gameState !== "final" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                        <div 
                            className="h-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${(currRound / roundCount) * 100}%` }}
                        ></div>
                    </div>
                )}
            </div>
            
            {/* Main content area */}
            <div className="flex-1 relative">
                <Lobby />
                <Questioner />
                <Answerer />
                <Overview />
                <Final />
                <Late />
            </div>
        </div>
    );
};

export default Game;