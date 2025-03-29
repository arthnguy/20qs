import { useState, useEffect, createContext } from "react";
import socket from "./socket.js";

const GameContext = createContext(undefined);

export const GameContextProvider = ({ children }) => {
    const [playerList, setPlayerList] = useState([]);
	const [attrList, setAttrList] = useState([]);
	const [scores, setScores] = useState([]);
	const [statuses, setStatuses] = useState([]);
	const [isHost, setIsHost] = useState(false);
	const [inGame, setInGame] = useState(false);
	const [guessingChar, setGuessingChar] = useState(false);
	const [char, setChar] = useState("");
	const [questionerID, setQuestionerID] = useState("");
	const [question, setQuestion] = useState("");
	const [questionerName, setQuestionerName] = useState("");
	const [currRoomID, setCurrRoomID] = useState("");
	const [gameState, setGameState] = useState("lobby");
	const [qaState, setQAState] = useState("selection");
	const [remainingQs, setRemainingQs] = useState(20);
	const [currRound, setCurrRound] = useState(1);
	const [roundCount, setRoundCount] = useState(3);
	const [questionTime, setQuestionTime] = useState(30);
	const [playerIndex, setPlayerIndex] = useState(0);

	useEffect(() => {
		const onUpdateRoomID = newRoomID => {
			setCurrRoomID(newRoomID);
		};

		const onUpdatePlayerList = newList => {
			setPlayerList(newList);
		};

		const onFirstPlayer = () => {
			setIsHost(true);
		};

		const onInGame = () => {
			setInGame(true);
		};

		const onSetGameState = newGameState => {
			setGameState(newGameState);
		};

		const onSetQAState = newQAState => {
			setQAState(newQAState);
		};

		const onSetChar = newChar => {
			setChar(newChar);
		}

		const onReceiveQuestion = (newQuestionerName, newQuestionerID, newQuestion, newGuessingChar) => {
			setQuestionerName(newQuestionerName);
			setQuestionerID(newQuestionerID);
			setQuestion(newQuestion);
			setGuessingChar(newGuessingChar);
		};

		const onReceiveAnswer = answer => {
			setAttrList(prevAttrList => [...prevAttrList, answer]);
		};

		const onClearAttrList = () => {
			setAttrList([]);
		}

		const onReceiveRemainingQs = newRemainingQs => {
			setRemainingQs(newRemainingQs);
		};

		const onSetGameSettings = (newRoundCount, newQuestionTime) => {
			setRoundCount(newRoundCount);
			setQuestionTime(newQuestionTime);
		};

		const onUpdateScores = newScores => {
			setScores(newScores);
		};

		const onUpdateStatuses = newStatuses => {
			setStatuses(newStatuses);
		};

		const onSetCurrRound = newRound => {
			setCurrRound(newRound);
		};

		const onSetPlayerIndex = newIndex => {
			setPlayerIndex(newIndex);
		}

		socket.on("update_room_id", onUpdateRoomID);
		socket.on("update_player_list", onUpdatePlayerList);
		socket.on("first_player", onFirstPlayer);
		socket.on("in_game", onInGame);
		socket.on("set_char", onSetChar);
		socket.on("set_game_state", onSetGameState);
		socket.on("set_qa_state", onSetQAState);
		socket.on("receive_question", onReceiveQuestion);
		socket.on("receive_answer", onReceiveAnswer);
		socket.on("clear_attr_list", onClearAttrList);
		socket.on("receive_remaining_qs", onReceiveRemainingQs);
		socket.on("set_game_settings", onSetGameSettings);
		socket.on("update_scores", onUpdateScores);
		socket.on("update_statuses", onUpdateStatuses);
		socket.on("set_curr_round", onSetCurrRound);
		socket.on("set_player_index", onSetPlayerIndex);

		return () => {
			socket.off("update_room_id", onUpdateRoomID);
			socket.off("update_player_list", onUpdatePlayerList);
			socket.off("first_player", onFirstPlayer);
			socket.off("in_game", onInGame);
			socket.off("set_char", onSetChar);
			socket.off("set_game_state", onSetGameState);
			socket.off("set_qa_state", onSetQAState);
			socket.off("receive_question", onReceiveQuestion);
			socket.off("receive_answer", onReceiveAnswer);
			socket.off("clear_attr_list", onClearAttrList);
			socket.off("receive_remaining_qs", onReceiveRemainingQs);
			socket.off("set_game_settings", onSetGameSettings);
			socket.off("update_scores", onUpdateScores);
			socket.off("update_statuses", onUpdateStatuses);
			socket.off("set_curr_round", onSetCurrRound);
			socket.off("set_player_index", onSetPlayerIndex);
		}
	}, []);

    return (
        <GameContext.Provider
            value={{
				currRoomID,
                playerList,
				attrList,
                isHost,
                inGame,
				char,
				gameState,
				qaState,
                questionerID,
                question,
				questionerName,
                guessingChar,
				remainingQs,
				roundCount,
				currRound,
				questionTime,
				scores,
				statuses,
				playerIndex,
            }}
        >
            {children}
        </GameContext.Provider>
    )
};

export default GameContext;