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
            <button onClick={() => onJoinRoom(roomID, playerName)}>Join Room</button>
        </div>
    );
};

export default JoinRoom;