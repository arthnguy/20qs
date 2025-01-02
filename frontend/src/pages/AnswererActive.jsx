import { useState, useEffect, useContext } from "react";
import AnswerCard from "../components/AnswerCard";
import AnswerButton from "../components/AnswerButton";
import GameContext from "../GameContext";
import socket from "../socket";

const AnswererActive = () => {
    const [cardAnims, setCardAnims] = useState("");
    const [buttonAnims, setButtonAnims] = useState("");
    const { questionerName, questionerID, question, qaState } = useContext(GameContext);

    let timer;

    // Send answer and remove from current list to answer
    const sendAnswer = answer => {
        socket.emit("send_answer", questionerID, `${question}${answer}`);
        setCardAnims("animate-slide-out-left");
        
        timer = setTimeout(() => {
            setCardAnims("animate-slide-in-top");
        }, 200);
    };

    useEffect(() => {
        if (qaState === "active") {
            setCardAnims("animate-slide-in-top");
            setButtonAnims("animate-fade-in");
        } else if (qaState === "waiting") {
            setCardAnims("animate-slide-out-left")
        }
    }, [qaState]);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className={"w-1/2 h-1/2 flex flex-col items-center justify-center " + cardAnims}>
                <AnswerCard questionerName={questionerName} question={question} />
            </div>
            {
                qaState === "active" &&
                <div className={"w-1/2 flex justify-around " + buttonAnims}>
                    <AnswerButton color="bg-green-500" icon="Y" sendAnswer={sendAnswer} />
                    <AnswerButton color="bg-red-500" icon="N" sendAnswer={sendAnswer} />
                    <AnswerButton color="bg-gray-500" icon="?" sendAnswer={sendAnswer} />
                </div>
            }
            {
                qaState === "waiting" &&
                <div className="h-12"></div>
            }
        </div>
    );
};

export default AnswererActive;