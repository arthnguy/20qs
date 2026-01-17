import Game from './game.js';

class GameManager {
    constructor() {
        this.games = new Map();
        this.playerToRoom = new Map();
    }

    createOrJoinGame(roomID, socket, playerName, io) {
        if (!this.games.has(roomID)) {
            this.games.set(roomID, new Game(io, roomID));
        }
        
        const game = this.games.get(roomID);
        
        // Try to add player
        const success = game.addPlayer(socket, playerName);
        if (!success) {
            return null; // Room is full
        }
        
        this.playerToRoom.set(socket.id, roomID);
        game.resetHost();
        
        return game;
    }

    getGameByPlayer(playerID) {
        const roomID = this.playerToRoom.get(playerID);
        return roomID ? this.games.get(roomID) : null;
    }

    getGameByRoom(roomID) {
        return this.games.get(roomID);
    }

    removePlayer(playerID) {
        const roomID = this.playerToRoom.get(playerID);
        if (!roomID) return null;

        const game = this.games.get(roomID);
        if (!game) return null;

        game.removePlayer(playerID);
        this.playerToRoom.delete(playerID);

        if (game.players.length === 0) {
            this.games.delete(roomID);
        }

        return game;
    }
}

export default GameManager;