import { useState, useEffect, useContext } from "react";
import QuestionCard from "../components/QuestionCard.jsx";
import QuestionCharCard from "../components/QuestionCharCard.jsx";
import GameButton from "../components/GameButton.jsx";
import socket from "../socket";
import GameContext from "../GameContext";

let oldQuestion = "";

const QuestionerActive = () => {
    const { qaState, gameState, questionTime } = useContext(GameContext);
    const [time, setTime] = useState(questionTime);
    const [cardAnims, setCardAnims] = useState("");
    const [shake, setShake] = useState("");
    const [guessingChar, setGuessingChar] = useState(false);
    const [question, setQuestion] = useState("");

    let timer = null;
    
    useEffect(() => {
        setCardAnims("animate-fade-in");
    }, [guessingChar]);

    useEffect(() => {
        if (gameState !== "questioner") {
            return;
        }

        if (qaState === "active") {
            setCardAnims("animate-slide-in-left");
        } else if (qaState === "waiting") {
            setCardAnims("animate-slide-out-top");
            setQuestion(oldQuestion);
        } else if (qaState === "win" && qaState === "lose") {
            setCardAnims("animate-fade-out");
        }
    }, [qaState]);

    useEffect(() => {
        if (timer === null) {
            timer = setInterval(() => {
                setTime(prev => --prev);
            }, 1000);
        }
    }, []);

    useEffect(() => {
        if (time === 0)
        {
            setTime(questionTime);
            clearInterval(timer);
            timer = null;
            socket.emit("send_question", question, guessingChar, 0, (response) => {
                setShake(true);
                setTimeout(() => {
                    setShake(false);
                    setCardAnims("");
                }, 200);
            });
        }
    }, [time]);

    // Sends question and waits for response
    const sendQuestion = () => {
        oldQuestion = question;
        socket.emit("send_question", question, guessingChar, 0, (response) => {
            setShake(true);
            setTimeout(() => {
                setShake(false);
                setCardAnims("");
            }, 200);
        });

        setTime(questionTime);            
    };

    return (
        <>
            {
                gameState === "questioner" &&
                <div className="w-full h-full absolute flex flex-col items-center justify-center">
                    {
                        qaState === "active" &&
                        <>
                            <p>Time: {time}</p>
                            <div>
                                <label className="animate-fade-in" htmlFor="guessing-char">Guessing character: </label>
                                <input className="animate-fade-in" value={guessingChar} id="guessing-char" type="checkbox" onChange={() => {setGuessingChar(!guessingChar); setQuestion("");}} />
                            </div>
                        </>
                    }
                    {
                        !guessingChar && (qaState === "active" || qaState === "waiting") &&
                        <div className={"w-1/2 h-1/2 flex flex-col items-center justify-center " + cardAnims}>
                            <QuestionCard question={question} setQuestion={setQuestion} editable={qaState === "active"} sendQuestion={sendQuestion} />
                        </div>
                    }
                    {
                        guessingChar && (qaState === "active" || qaState === "waiting") &&
                        <div className={"w-1/2 flex flex-col items-center justify-center " + cardAnims + (shake ? " animate-shake" : "")}>
                            <QuestionCharCard char={question} setChar={setQuestion} sendChar={sendQuestion} />
                        </div>
                    }
                    {
                        qaState === "active" &&
                        <div className="animate-fade-in">
                            <GameButton onClick={() => sendQuestion(question)} text="Send"/>
                        </div>
                    }
                </div>
            }
        </>
    );
};

export default QuestionerActive;