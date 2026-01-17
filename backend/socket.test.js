import { Server } from 'socket.io';
import { createServer } from 'http';
import Client from 'socket.io-client';

describe('Socket Integration', () => {
    let io, serverSocket, clientSocket, httpServer;

    beforeAll((done) => {
        httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = new Client(`http://localhost:${port}`);
            io.on('connection', (socket) => {
                serverSocket = socket;
            });
            clientSocket.on('connect', done);
        });
    });

    afterAll((done) => {
        if (clientSocket.connected) {
            clientSocket.disconnect();
        }
        httpServer.close(() => {
            io.close();
            done();
        });
    });

    beforeEach(() => {
        // Clear all listeners before each test
        serverSocket.removeAllListeners();
    });

    test('should handle room joining', (done) => {
        serverSocket.on('join_room', (roomID, playerName) => {
            expect(roomID).toBe('test-room');
            expect(playerName).toBe('TestPlayer');
            done();
        });

        clientSocket.emit('join_room', 'test-room', 'TestPlayer');
    });

    test('should handle question sending', (done) => {
        serverSocket.on('send_question', (query, guessingChar, timeLeft) => {
            expect(query).toBe('Is it alive?');
            expect(guessingChar).toBe(false);
            expect(timeLeft).toBe(25);
            done();
        });

        clientSocket.emit('send_question', 'Is it alive?', false, 25);
    });

    test('should handle character guessing', (done) => {
        serverSocket.on('send_question', (query, guessingChar, timeLeft) => {
            expect(query).toBe('Batman');
            expect(guessingChar).toBe(true);
            expect(timeLeft).toBe(15);
            done();
        });

        clientSocket.emit('send_question', 'Batman', true, 15);
    });

    test('should handle answer sending', (done) => {
        serverSocket.on('send_answer', (questionerID, answer, guessingChar) => {
            expect(questionerID).toBe('player123');
            expect(answer).toBe('Yes');
            expect(guessingChar).toBe(false);
            done();
        });

        clientSocket.emit('send_answer', 'player123', 'Yes', false);
    });

    test('should handle character setting', (done) => {
        serverSocket.on('set_char', (char) => {
            expect(char).toBe('Wonder Woman');
            done();
        });

        clientSocket.emit('set_char', 'Wonder Woman');
    });

    test('should handle game settings', (done) => {
        serverSocket.on('set_game_settings', (roomID, roundCount, questionTime) => {
            expect(roomID).toBe('room123');
            expect(roundCount).toBe(5);
            expect(questionTime).toBe(45);
            done();
        });

        clientSocket.emit('set_game_settings', 'room123', 5, 45);
    });
});