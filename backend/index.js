import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import GameManager from "./game-manager.js";

dotenv.config();

const gameManager = new GameManager();

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
    
    socket.on("start_qa", () => {
        const game = gameManager.getGameByPlayer(socket.id);
        if (!game) return;
        
        game.startQA();
    });

    socket.on("send_question", (query, guessingChar, timeLeft, callback) => {
        const game = gameManager.getGameByPlayer(socket.id);
        if (!game) return;

        if (!guessingChar) {
            const firstQ = !game.hasQs;
            game.addQ(socket.id, query);
            game.addScoreTo(socket.id, timeLeft);

            if (firstQ) {
                game.sendQ();
            }
        } else {
            game.checkChar(socket.id, query);
            if (callback && typeof callback === 'function') {
                callback("done");
            }
        }
    });

    socket.on("send_answer", (questionerID, answer, guessingChar) => {
        const game = gameManager.getGameByPlayer(socket.id);
        if (!game) return;

        game.sendA(questionerID, answer, guessingChar);
        if (game.hasQs) {
            game.sendQ(socket.id);
        }
    });

    socket.on("set_char", char => {
        const game = gameManager.getGameByPlayer(socket.id);
        if (!game) return;

        game.setChar(char);
        game.finishSelection();
    });

    socket.on("join_room", (roomID, playerName) => {
        const game = gameManager.createOrJoinGame(roomID, socket, playerName, io);
        if (!game) {
            // Room was full, player couldn't join
            socket.emit("room_full", "This room is full (8 players max)");
        }
    });

    socket.on("set_game_settings", (roomID, roundCount, questionTime) => {
        const game = gameManager.getGameByRoom(roomID);
        if (!game) return;
        
        game.setRoundCount(roundCount).setQuestionTime(questionTime);
    });

    socket.on("disconnect", () => {
        const game = gameManager.removePlayer(socket.id);
        if (game && game.players.length > 0) {
            game.resetHost();
        }
    });
});