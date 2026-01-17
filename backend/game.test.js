import Game from './game.js';
import GameManager from './game-manager.js';

const mockIO = {
    to: jest.fn().mockReturnThis(),
    except: jest.fn().mockReturnThis(),
    emit: jest.fn()
};

const mockSocket = {
    id: 'test-socket-1',
    join: jest.fn()
};

describe('Game', () => {
    let game;

    beforeEach(() => {
        game = new Game(mockIO, 'test-room');
        jest.clearAllMocks();
    });

    describe('Player Management', () => {
        test('should add player correctly', () => {
            game.addPlayer(mockSocket, 'TestPlayer');
            
            expect(game.players).toHaveLength(1);
            expect(game.players[0].name).toBe('TestPlayer');
            expect(game.players[0].id).toBe('test-socket-1');
        });

        test('should handle answerer getter with empty players', () => {
            expect(game.answerer).toBeNull();
        });

        test('should handle answerer getter with valid index', () => {
            game.addPlayer(mockSocket, 'TestPlayer');
            expect(game.answerer).toBe('test-socket-1');
        });

        test('should handle answerer getter with out of bounds index', () => {
            game.addPlayer(mockSocket, 'TestPlayer');
            game._answererIndex = 5;
            expect(game.answerer).toBeNull();
        });

        test('should remove player and adjust answerer index', () => {
            const socket1 = { id: 'player1', join: jest.fn() };
            const socket2 = { id: 'player2', join: jest.fn() };
            const socket3 = { id: 'player3', join: jest.fn() };

            game.addPlayer(socket1, 'Player1');
            game.addPlayer(socket2, 'Player2');
            game.addPlayer(socket3, 'Player3');
            
            game._answererIndex = 2;
            game.removePlayer('player1');
            
            expect(game.players).toHaveLength(2);
            expect(game._answererIndex).toBe(1);
        });

        test('should handle removing current answerer', () => {
            const socket1 = { id: 'player1', join: jest.fn() };
            const socket2 = { id: 'player2', join: jest.fn() };

            game.addPlayer(socket1, 'Player1');
            game.addPlayer(socket2, 'Player2');
            
            game._answererIndex = 0;
            game.removePlayer('player1');
            
            expect(game.players).toHaveLength(1);
            expect(game._answererIndex).toBe(0);
        });

        test('should reset to lobby when only one player remains', () => {
            const socket1 = { id: 'player1', join: jest.fn() };
            const socket2 = { id: 'player2', join: jest.fn() };

            game.addPlayer(socket1, 'Player1');
            game.addPlayer(socket2, 'Player2');
            game._inProgress = true;
            
            game.removePlayer('player1');
            
            expect(game._inProgress).toBe(false);
            expect(mockIO.emit).toHaveBeenCalledWith('set_game_state', 'lobby');
        });
    });

    describe('Game Flow', () => {
        beforeEach(() => {
            const socket1 = { id: 'player1', join: jest.fn() };
            const socket2 = { id: 'player2', join: jest.fn() };
            game.addPlayer(socket1, 'Player1');
            game.addPlayer(socket2, 'Player2');
        });

        test('should start QA round correctly', () => {
            game.startQA();
            
            expect(game._inProgress).toBe(true);
            expect(mockIO.except).toHaveBeenCalledWith('player1');
            expect(mockIO.emit).toHaveBeenCalledWith('set_game_state', 'questioner');
        });

        test('should end game when max rounds reached', () => {
            game._currRound = 3;
            game._roundCount = 3;
            
            game.startQA();
            
            expect(game._inProgress).toBe(false);
            expect(mockIO.emit).toHaveBeenCalledWith('set_game_state', 'final');
        });

        test('should handle character guess correctly', () => {
            game._char = 'Batman';
            
            // Add a third player so QA doesn't end immediately
            const socket3 = { id: 'player3', join: jest.fn() };
            game.addPlayer(socket3, 'Player3');
            
            const player2Before = game._getPlayerByID('player2');
            expect(player2Before.guessedChar).toBe(false);
            
            game.checkChar('player2', 'Batman');
            
            const player2After = game._getPlayerByID('player2');
            expect(player2After.guessedChar).toBe(true);
            expect(player2After.remainingQs).toBe(19);
            
            // Verify win state was emitted (since QA is not done yet)
            expect(mockIO.emit).toHaveBeenCalledWith("set_qa_state", "win");
        });

        test('should complete round when all questioners are done', () => {
            game._char = 'Batman';
            
            // Player2 guesses correctly - this should end the QA phase
            game.checkChar('player2', 'Batman');
            
            // Verify _handleDoneQA was called (round completed)
            expect(mockIO.emit).toHaveBeenCalledWith("set_game_state", "overview");
            
            // Verify player state was reset
            const player2After = game._getPlayerByID('player2');
            expect(player2After.guessedChar).toBe(false); // Reset!
            expect(player2After.remainingQs).toBe(20); // Reset!
        });

        test('should handle wrong character guess', () => {
            // Add third player so QA doesn't end
            const socket3 = { id: 'player3', join: jest.fn() };
            game.addPlayer(socket3, 'Player3');
            
            game._char = 'Batman';
            game.checkChar('player2', 'Superman');
            
            const player2 = game._getPlayerByID('player2');
            expect(player2.guessedChar).toBe(false);
            expect(player2.remainingQs).toBe(19);
            expect(mockIO.emit).toHaveBeenCalledWith("receive_answer", "SupermanN");
        });
    });

    describe('Question Management', () => {
        beforeEach(() => {
            const socket1 = { id: 'player1', join: jest.fn() };
            const socket2 = { id: 'player2', join: jest.fn() };
            game.addPlayer(socket1, 'Player1');
            game.addPlayer(socket2, 'Player2');
        });

        test('should add question to queue', () => {
            game.addQ('player2', 'Is it a superhero?', false);
            
            expect(game.hasQs).toBe(true);
            expect(game._qs).toHaveLength(1);
        });

        test('should send first question automatically', () => {
            game.addQ('player2', 'Is it a superhero?', false);
            game.sendQ();
            
            expect(mockIO.emit).toHaveBeenCalledWith('receive_question', 'Player2', 'player2', 'Is it a superhero?', false);
        });

        test('should process answer and move to next question', () => {
            game.addQ('player2', 'Is it a superhero?', false);
            game.sendA('player2', 'Y');
            
            expect(game._qs).toHaveLength(0);
            expect(mockIO.emit).toHaveBeenCalledWith('receive_answer', 'Y');
        });
    });
});

describe('GameManager', () => {
    let gameManager;
    const mockSocket = { id: 'test-socket', join: jest.fn() };

    beforeEach(() => {
        gameManager = new GameManager();
        jest.clearAllMocks();
    });

    test('should create new game when room does not exist', () => {
        const game = gameManager.createOrJoinGame('room1', mockSocket, 'Player1', mockIO);
        
        expect(game).toBeDefined();
        expect(gameManager.getGameByRoom('room1')).toBe(game);
        expect(gameManager.getGameByPlayer('test-socket')).toBe(game);
    });

    test('should join existing game when room exists', () => {
        const game1 = gameManager.createOrJoinGame('room1', mockSocket, 'Player1', mockIO);
        const socket2 = { id: 'test-socket-2', join: jest.fn() };
        const game2 = gameManager.createOrJoinGame('room1', socket2, 'Player2', mockIO);
        
        expect(game1).toBe(game2);
        expect(game1.players).toHaveLength(2);
    });

    test('should remove player and clean up empty rooms', () => {
        gameManager.createOrJoinGame('room1', mockSocket, 'Player1', mockIO);
        
        const game = gameManager.removePlayer('test-socket');
        
        expect(game).toBeDefined();
        expect(gameManager.getGameByRoom('room1')).toBeUndefined();
        expect(gameManager.getGameByPlayer('test-socket')).toBeNull();
    });
});