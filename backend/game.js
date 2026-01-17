const GAME_CONSTANTS = {
    DEFAULT_QUESTIONS: 20,
    DEFAULT_ROUNDS: 3,
    DEFAULT_QUESTION_TIME: 30,
    MIN_QUESTION_TIME: 5,
    MIN_ROUNDS: 1,
    MAX_PLAYERS: 8,
    OVERVIEW_DELAY: 5000,
    FINAL_DELAY: 10000
};

class Player {
    constructor(id, name) {
        this._id = id;
        this._name = name;
        this._remainingQs = GAME_CONSTANTS.DEFAULT_QUESTIONS;
        this._guessedChar = false;
        this._late = false;
        this._currScore = 0;
        this._totalScore = 0;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get remainingQs() {
        return this._remainingQs;
    }

    get hasQs() {
        return this._remainingQs !== 0;
    }

    get guessedChar() {
        return this._guessedChar;
    }

    get late() {
        return this._late;
    }

    get score() {
        return this._totalScore;
    }
    
    guessed() {
        this._guessedChar = true;
    }

    useQ() {
        --this._remainingQs;
    }

    resetState() {
        this._remainingQs = GAME_CONSTANTS.DEFAULT_QUESTIONS;
        this._guessedChar = false;
    }

    resetCurrScore() {
        this._currScore = 0;
    }

    resetTotalScore() {
        this._totalScore = 0;
    }

    addCurrScore(score) {
        this._currScore += score;
    }

    addCurrToTotalScore(maxTime) {
        if (this._guessedChar) {
            this._totalScore += Math.round((this._currScore + maxTime * this._remainingQs) * (1 + this._remainingQs / 10));
        }
        
        this.resetCurrScore();
    }
}

class Game {
    constructor(io, roomID) {
        this._io = io;
        this._players = [];
        this._qs = [];
        this._inProgress = false;
        this._roomID = roomID;
        this._currRound = 0;
        this._roundCount = GAME_CONSTANTS.DEFAULT_ROUNDS;
        this._questionTime = GAME_CONSTANTS.DEFAULT_QUESTION_TIME;
        this._answererIndex = 0;
        this._char = "";
    }

    get players() {
        return this._players;
    }

    get host() {
        return this._players[0]?.id;
    }

    get answerer() {
        if (this._answererIndex >= this._players.length || this._players.length === 0) {
            return null;
        }
        return this._players[this._answererIndex].id;
    }

    get hasQs() {
        return this._qs.length !== 0;
    }

    get roomID() {
        return this._roomID;
    }

    _getPlayerByID(id) {
        return this._players.find(el => el.id === id);
    }

    _isQADone() {
        for (let i = 0; i < this._players.length; ++i) {
            if (i !== this._answererIndex && this._players[i].hasQs && !this._players[i].late && !this._players[i].guessedChar) {
                return false;
            }
        }
        return true;
    }

    _resetPlayers() {
        for (let i = 0; i < this._players.length; ++i) {
            this._players[i].resetState();
            this._players[i].resetCurrScore();
            this._io.to(this._players[i].id).emit("clear_attr_list");
        }
    }

    _getPlayerStatuses() {
        return this._players.map(player => {
            if (player.guessedChar) return "green";
            if (!player.hasQs) return "red";
            if (this.answerer === player.id) return "gray";
            if (player.late) return "blue";
            return "white";
        });
    }

    _broadcastStatuses() {
        this._io.to(this._roomID).emit("update_statuses", this._getPlayerStatuses());
    }

    _handleDoneQA(forced) {
        for (let i = 0; i < this._players.length; ++i) {
            if (this._answererIndex >= this._players.length || this._players[i].id === this.answerer) {
                continue;
            }

            this._players[i].addCurrToTotalScore(this._questionTime);
        }
        this._io.to(this._roomID).emit("update_scores", this._players.map(el => el.score));
        
        this._resetPlayers();
        this.clearLates();
        this._io.to(this._roomID).emit("set_game_state", "overview");
        setTimeout(() => {
            if (!forced) {
                ++this._answererIndex;
                
                if (this._answererIndex >= this._players.length) {
                    ++this._currRound;
                    this._io.to(this._roomID).emit("set_curr_round", Math.min(this._currRound + 1, this._roundCount));
                    this._answererIndex = 0;
                }
            }

            if (this._players.length > 1) {
                this.startQA();
            } else {
                this._io.to(this._roomID).emit("set_curr_round", 1);
                this._io.to(this._roomID).emit("set_game_state", "lobby");
            }
        }, GAME_CONSTANTS.OVERVIEW_DELAY);
    }

    _endGame() {
        this._inProgress = false;
        this._answererIndex = 0;
        this._qs = [];
        this._char = "";

        for (let i = 0; i < this._players.length; ++i) {
            this._players[i].resetTotalScore();
            this._io.to(this._players[i].id).emit("set_score", 0);
            this._currRound = 0;
        }
        
        this.clearLates();
        this._io.to(this._roomID).emit("set_game_state", "final");
        this._broadcastStatuses();
        // Removed auto-redirect - players stay on final screen
    }

    clearLates() {
        this._players.forEach(player => player._late = false);
    }

    setRoundCount(roundCount) {
        this._roundCount = Math.max(roundCount, GAME_CONSTANTS.MIN_ROUNDS);
        this._io.to(this._roomID).emit("set_game_settings", this._roundCount, this._questionTime);
        return this;
    }

    setQuestionTime(questionTime) {
        this._questionTime = Math.max(questionTime, GAME_CONSTANTS.MIN_QUESTION_TIME);
        this._io.to(this._roomID).emit("set_game_settings", this._roundCount, this._questionTime);
        return this;
    }

    resetHost() {
        if (this._players.length > 0) {
            this._io.to(this._players[0].id).emit("first_player");
        }
    }

    addPlayer(socket, name) {
        // Check if game is already at max capacity
        if (this._players.length >= GAME_CONSTANTS.MAX_PLAYERS) {
            socket.emit("room_full", "This room is full (8 players max)");
            return false;
        }

        this._players.push(new Player(socket.id, name));
        socket.join(this._roomID);

        this._io.to(this._roomID).emit("update_scores", this._players.map(el => el.score));
        this._io.to(this._roomID).emit("update_player_list", this._players.map(el => el.name));
        this._io.to(this._roomID).emit("set_game_settings", this._roundCount, this._questionTime);
        this._io.to(socket.id).emit("set_player_index", this._players.length - 1);
        this._io.to(socket.id).emit("update_room_id", this._roomID);
        this._io.to(socket.id).emit("in_game");
        
        if (this._inProgress) {
            this._getPlayerByID(socket.id)._late = true;
            this._broadcastStatuses();
            this._io.to(socket.id).emit("set_game_state", "late");
        }

        return true;
    }

    removePlayer(playerID) {
        const player = this._getPlayerByID(playerID);
        if (!player) return;

        const removedIndex = this._players.indexOf(player);
        const wasAnswerer = this.answerer === playerID;
        
        if (removedIndex < this._answererIndex) {
            --this._answererIndex;
        } else if (removedIndex === this._answererIndex && this._answererIndex >= this._players.length - 1) {
            this._answererIndex = 0;
        }

        this._players = this._players.filter(e => e.id !== playerID);
        
        if (this._answererIndex >= this._players.length) {
            this._answererIndex = 0;
        }

        for (let i = 0; i < this._players.length; ++i) {
            this._io.to(this._players[i].id).emit("set_player_index", i);
        }
        this._io.to(this._roomID).emit("update_player_list", this._players.map(el => el.name));
        this._io.to(this._roomID).emit("update_scores", this._players.map(el => el.score));

        if (this._players.length === 0) {
            return;
        }
        if (this._players.length === 1) {
            this._inProgress = false;
            this._answererIndex = 0;
            this._qs = [];
            this._char = "";

            for (let i = 0; i < this._players.length; ++i) {
                this._players[i].resetTotalScore();
                this._io.to(this._players[i].id).emit("set_score", 0);
                this._currRound = 0;
            }
            
            this.clearLates();
            this._io.to(this._roomID).emit("set_game_state", "lobby");
            this._broadcastStatuses();
            return;
        }
        
        this.resetHost();

        if (wasAnswerer && this._inProgress) {
            this._handleDoneQA(true);
        }

        this._broadcastStatuses();
    }

    setChar(char) {
        this._char = char;
        this._io.to(this._roomID).emit("set_char", char);
    }

    checkChar(questionerID, char) {
        const player = this._getPlayerByID(questionerID);
        if (!player) {
            return;
        }
        
        player.useQ();
        this._io.to(questionerID).emit("receive_remaining_qs", player.remainingQs);

        if (this._char.toLowerCase().trim() === char.toLowerCase().trim()) {
            player.guessed();
            this._broadcastStatuses();
            
            if (!this._isQADone()) {
                this._io.to(questionerID).emit("set_qa_state", "win");
            } else {
                this._handleDoneQA(false);
            }
            return; // Exit early if they guessed correctly
        } else {
            // Wrong guess - send answer and set state back to active
            this._io.to(questionerID).emit("receive_answer", char + "N");
            
            // Only check for lose condition if they didn't guess correctly
            if (!player.hasQs) {
                this._io.to(questionerID).emit("set_qa_state", "lose");
                this._broadcastStatuses();
                this._handleDoneQA(false);
            } else {
                // Still have questions left, set back to active
                this._io.to(questionerID).emit("set_qa_state", "active");
                
                // If there are pending questions in the queue, send the next one
                if (this._qs.length > 0) {
                    this.sendQ();
                }
            }
        }
    }

    startQA() {
        if (this._currRound !== this._roundCount) {
            this._inProgress = true;
            this.clearLates();
            if (!this.answerer) {
                this._endGame();
                return;
            }
            this._io.to(this._roomID).except(this.answerer).emit("set_game_state", "questioner");
            this._io.to(this._roomID).except(this.answerer).emit("receive_remaining_qs", GAME_CONSTANTS.DEFAULT_QUESTIONS);
            this._io.to(this.answerer).emit("set_game_state", "answerer");
            this._io.to(this._roomID).emit("set_qa_state", "selection");
            this._io.to(this._roomID).emit("update_scores", this._players.map(el => el.score));
            this._broadcastStatuses();
        } else {   
            this._endGame();
        }
    }

    finishSelection() {
        if (this.answerer) {
            this._io.to(this._roomID).except(this.answerer).emit("set_qa_state", "active");
            this._io.to(this.answerer).emit("set_qa_state", "waiting");
        }
    }

    addQ(questionerID, question, guessingChar) {
        this._qs.push({question: question, guessingChar: guessingChar, questionerID: questionerID});
        this._io.to(questionerID).emit("set_qa_state", "waiting");
    }

    sendQ() {
        if (this._qs.length === 0) {
            return;
        }

        const { question, questionerID, guessingChar } = this._qs[0];
        const questioner = this._getPlayerByID(questionerID);
        
        if (this.answerer && questioner) {
            this._io.to(this.answerer).emit("receive_question", questioner.name, questionerID, question, guessingChar);
            this._io.to(this.answerer).emit("set_qa_state", "active");
        } else if (this.answerer && !questioner) {
            // Questioner disconnected, skip this question
            console.log(`Questioner ${questionerID} not found, skipping question`);
            this._qs.shift();
            this.sendQ();
        }
    }
    
    sendA(questionerID, answer) {
        const player = this._getPlayerByID(questionerID);

        if (!player) {
            console.log(`Player ${questionerID} not found in sendA`);
            return;
        }

        if (answer.slice(-1) !== "?") {
            player.useQ();
        }

        this._io.to(questionerID).emit("receive_answer", answer);
        this._io.to(questionerID).emit("receive_remaining_qs", player.remainingQs);
        this._io.to(questionerID).emit("set_qa_state", "active");
        this._qs.shift();

        if (!player.hasQs) {
            this._io.to(questionerID).emit("set_qa_state", "lose");
            this._broadcastStatuses();
        }

        // Check if there are more questions to send
        if (this._qs.length > 0) {
            this.sendQ();
        } else {
            if (this.answerer) {
                this._io.to(this.answerer).emit("set_qa_state", "waiting");
            }
        }

        // Only end Q&A if all players are done (guessed, out of questions, or late)
        if (this._isQADone()) {
            this._handleDoneQA();
        }
    }

    addScoreTo(questionerID, timeLeft) {
        const player = this._getPlayerByID(questionerID);
        if (player) {
            player.addCurrScore(timeLeft);
        }
    }
}

export default Game;