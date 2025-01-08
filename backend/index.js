import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Game from "./game.js";

dotenv.config();

const games = new Map();

const app = express();
app.use(cors());

const server = app.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`);
});

const io = new Server(server, {
    cors: {
        origin: process.env.ORIGIN,
        methods: ["GET"],
        allowedHeaders: ["Access-Control-Allow-Origin"]
    }
});

io.on("connection", socket => {
    console.log(`User ${socket.id} connected`);
    
    // Communicates from client to server
    socket.on("start_qa", () => {
        games.get(socket.id).startQA();
    });

    socket.on("send_question", (query, guessingChar, timeLeft) => {
        const game = games.get(socket.id);

        if (!guessingChar) {
            const firstQ = !game.hasQs;
            game.addQ(socket.id, query);
            game.addScoreTo(socket.id, timeLeft);

            if (firstQ) {
                game.sendQ();
            }
        } else {
            game.checkChar(socket.id, query);
        }
    });

    socket.on("send_answer", (questionerID, answer, guessingChar) => {
        const game = games.get(socket.id);

        game.sendA(questionerID, answer, guessingChar);
        if (game.hasQs) {
            game.sendQ(socket.id);
        }
    });

    socket.on("set_char", char => {
        const game = games.get(socket.id);

        game.setChar(char);
        game.finishSelection();
    });

    socket.on("join_room", (roomID, playerName) => {
        // Make game if game is nonexistent
        if (games.get(roomID) === undefined) {
            games.set(roomID, new Game(io, roomID));
        }
        
        const game = games.get(roomID);
        // Join and update player list and current room ID
        games.set(socket.id, game);
        game.addPlayer(socket, playerName);
        game.resetHost();
    });

    socket.on("set_game_settings", (roomID, roundCount, questionTime) => {
        games.get(roomID).setRoundCount(roundCount).setQuestionTime(questionTime);
    });

    socket.on("disconnect", () => {
        if (games.get(socket.id) === undefined) {
            return;
        }

        const roomID = games.get(socket.id).roomID;

        games.get(socket.id).removePlayer(socket.id);
        games.delete(socket.id);
        if (games.get(roomID).players.length === 0) {
            games.delete(roomID);
        } else {
            games.get(roomID).resetHost();
        }
    });
});