import { useState } from "react";

const JoinRoom = ({ onJoinRoom }) => {
    const [roomID, setRoomID] = useState("");
    const [playerName, setPlayerName] = useState("");

    return (
        <div className="flex justify-between">
            <div>
                <input
                    className="border-black border-2"
                    value={roomID}
                    onChange={e => setRoomID(e.target.value)}
                    placeholder="Room ID"
                />
                <input
                    className="border-black border-2"
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value)}
                    placeholder="Display name"
                />
            </div>
            <button 
                onClick={() => onJoinRoom(roomID, playerName)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
                Join Room
            </button>
        </div>
    );
};

export default JoinRoom;