import { useState } from "react";
import socket from "../socket.js";
import JoinRoom from "../components/JoinRoom.jsx";
import logo from "../assets/logo.png";

const Home = () => {
    const [roomID, setRoomID] = useState("");
    const [playerName, setPlayerName] = useState("");

    const handleJoinRoom = (roomID, playerName) => {
        // Finds room if there is one
        socket.emit("join_room", roomID, playerName);
        // Switch to game page
        socket.emit("change_state", "game");
    };

    return (
        <div className="flex flex-col justify-evenly items-center h-screen">
            <img className="animate-pulse-scale" src={logo} />
            <input
                className="border-blue-400 border-2 w-1/2 h-12 text-2xl rounded-3xl text-center focus:outline-none shadow-md"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                placeholder="My name is..."
            />
            <div>
                <input
                    className="border-blue-400 mr-4 border-2 pl-2 rounded-2xl text-center focus:outline-none shadow-md"
                    value={roomID}
                    onChange={e => setRoomID(e.target.value)}
                    placeholder="Room ID"
                    />
                <button className="rounded-full border-blue-400 bg-white border-2 w-8 h-8" onClick={() => handleJoinRoom(roomID, playerName)}>{'>'}</button>
            </div>
        </div>
    );
};

export default Home;