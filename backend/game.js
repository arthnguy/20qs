class Player {
    constructor(id, name) {
        this._id = id;
        this._name = name;
        this._remainingQs = 20;
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
        this._remainingQs = 20;
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
        this._roundCount = 3;
        this._questionTime = 30;
        this._answererIndex = 0;
        this._char = "";
    }

    get players() {
        return this._players;
    }

    get host() {
        return this._players[0].id;
    }

    get answerer() {
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
        }, 5000);
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
        this._io.to(this._roomID).emit("update_statuses", this._players.map(_ => "white"));
        setTimeout(() => {
            this.clearLates();
            this._io.to(this._roomID).emit("set_curr_round", 1);
            this._io.to(this._roomID).emit("set_game_state", "lobby");
        }, 10000);
    }

    clearLates() {
        for (let i = 0; i < this._players.length; ++i) {
            this._players[i]._late = false;
        }
    }

    setRoundCount(roundCount) {
        this._roundCount = Math.max(roundCount, 1);
        this._io.to(this._roomID).emit("set_game_settings", this._roundCount, this._questionTime);
        return this;
    }

    setQuestionTime(questionTime) {
        this._questionTime = Math.max(questionTime, 5);
        this._io.to(this._roomID).emit("set_game_settings", this._roundCount, this._questionTime);
        return this;
    }

    resetHost() {
        this._io.to(this._players[0].id).emit("first_player");
    }

    addPlayer(socket, name) {
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
            this._io.to(this._roomID).emit("update_statuses", this._players.map(el => (el.guessedChar ? "green" : (!el.hasQs ? "red" : ((this.answerer === el.id) ? "gray" : (el.late ? "blue" : "white"))))));
            this._io.to(socket.id).emit("set_game_state", "late");
        }
    }

    removePlayer(playerID) {
        const progress = this.answerer === playerID;
        const removedIndex = this._players.indexOf(this._getPlayerByID(playerID));

        if (removedIndex < this._answererIndex) {
            --this._answererIndex;
        }

        this._players = this._players.filter(e => e.id !== playerID);
        for (let i = 0; i < this._players.length; ++i) {
            this._io.to(this._players[i].id).emit("set_player_index", i);
        }
        this._io.to(this._roomID).emit("update_player_list", this._players.map(el => el.name));

        // Nothing else to do
        if (this._players.length === 0) {
            return;
        }
        // Nobody to play with, back to lobby
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
            this._io.to(this._roomID).emit("update_statuses", this._players.map(_ => "white"));
            return;
        }
        
        this._io.to(this.host).emit("first_player");

        if (progress && this._inProgress) {
            this._handleDoneQA(true);
            this._io.to(this._roomID).emit("update_statuses", this._players.map(el => (el.guessedChar ? "green" : (!el.hasQs ? "red" : (el.late ? "blue" : "white")))));
        }
    }

    setChar(char) {
        this._char = char;
        this._io.to(this._roomID).emit("set_char", char);
    }

    checkChar(questionerID, char) {
        this._getPlayerByID(questionerID).useQ();
        this._io.to(questionerID).emit("receive_remaining_qs", this._getPlayerByID(questionerID).remainingQs);

        if (this._char.toLowerCase().trim() === char.toLowerCase().trim()) {
            this._getPlayerByID(questionerID).guessed();
            this._io.to(this._roomID).emit("update_statuses", this._players.map(el => (el.guessedChar ? "green" : (!el.hasQs ? "red" : ((this.answerer === el.id) ? "gray" : (el.late ? "blue" : "white"))))));
            
            if (!this._isQADone()) {
                this._io.to(questionerID).emit("set_qa_state", "win");
            } else {
                this._handleDoneQA(false);
            }
        } else {
            this._io.to(questionerID).emit("receive_answer", char + "N");
        }

        if (!this._getPlayerByID(questionerID).hasQs) {
            this._io.to(questionerID).emit("set_qa_state", "lose");
            this._io.to(this._roomID).emit("update_statuses", this._players.map(el => (el.guessedChar ? "green" : (!el.hasQs ? "red" : ((this.answerer === el.id) ? "gray" : (el.late ? "blue" : "white"))))));
            this._handleDoneQA(false);
        }
    }

    startQA() {
        if (this._currRound !== this._roundCount) {
            this._inProgress = true;
            this.clearLates();
            this._io.to(this._roomID).except(this.answerer).emit("set_game_state", "questioner");
            this._io.to(this._roomID).except(this.answerer).emit("receive_remaining_qs", 20);
            this._io.to(this.answerer).emit("set_game_state", "answerer");
            this._io.to(this._roomID).emit("set_qa_state", "selection");
            this._io.to(this._roomID).emit("update_scores", this._players.map(el => el.score));
            this._io.to(this._roomID).emit("update_statuses", this._players.map(el => (el.guessedChar ? "green" : (!el.hasQs ? "red" : ((this.answerer === el.id) ? "gray" : "white")))));
        } else {   
            this._endGame();
        }
    }

    finishSelection() {
        this._io.to(this._roomID).except(this.answerer).emit("set_qa_state", "active");
        this._io.to(this.answerer).emit("set_qa_state", "waiting");
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
        this._io.to(this.answerer).emit("receive_question", this._getPlayerByID(questionerID).name, questionerID, question, guessingChar);
        this._io.to(this.answerer).emit("set_qa_state", "active");
    }
    
    sendA(questionerID, answer) {
        const player = this._getPlayerByID(questionerID);

        if (answer.slice(-1) !== "?") {
            player.useQ();
        }

        this._io.to(questionerID).emit("receive_answer", answer);
        this._io.to(questionerID).emit("receive_remaining_qs", player.remainingQs);
        this._io.to(questionerID).emit("set_qa_state", "active");
        this._qs.shift();
        this.sendQ();

        if (!this._getPlayerByID(questionerID).hasQs) {
            this._io.to(questionerID).emit("set_qa_state", "lose");
            this._io.to(this._roomID).emit("update_statuses", this._players.map(el => (el.guessedChar ? "green" : (!el.hasQs ? "red" : ((this.answerer === el.id) ? "gray" : (el.late ? "blue" : "white"))))));
        }

        if (this._qs.length === 0) {
            this._io.to(this.answerer).emit("set_qa_state", "waiting");
        }

        if (this._isQADone()) {
            this._handleDoneQA(false);
        }
    }

    addScoreTo(questionerID, timeLeft) {
        this._getPlayerByID(questionerID).addCurrScore(timeLeft);
    }
}

export default Game;