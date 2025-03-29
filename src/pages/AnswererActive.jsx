import { useState, useEffect, useContext } from "react";
import AnswerCard from "../components/AnswerCard";
import AnswerButton from "../components/AnswerButton";
import GameContext from "../GameContext";
import socket from "../socket";

const AnswererActive = () => {
    const [cardAnims, setCardAnims] = useState("");
    const [buttonAnims, setButtonAnims] = useState("");
    const [display, setDisplay] = useState(false);
    const [clickable, setClickable] = useState(false);
    const { questionerName, questionerID, question, qaState } = useContext(GameContext);

    // Send answer and remove from current list to answer
    const sendAnswer = answer => {
        socket.emit("send_answer", questionerID, `${question}${answer}`);
        setCardAnims("animate-slide-out-left");

        setClickable(false)
        setTimeout(() => {
            if (qaState === "active") {
                setCardAnims("animate-slide-in-top");
                setTimeout(() => setClickable(true), 200);
            }
        }, 200);
    };

    useEffect(() => {
        if (qaState === "active") {
            setDisplay(true);
            setCardAnims("animate-slide-in-top");
            setButtonAnims("animate-fade-in");

            setTimeout(() => setClickable(true), 200);
        } else if (qaState === "waiting") {
            setTimeout(() => setDisplay(false), 200);
        } else {
            setDisplay(false);
        }
    }, [qaState]);

    return (
        <>
            {
                display &&
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <div className={"w-1/2 h-1/2 flex flex-col items-center justify-center " + cardAnims}>
                        <AnswerCard questionerName={questionerName} question={question} />
                    </div>
                    {
                        qaState === "active" &&
                        <div className={"w-1/2 flex justify-around " + buttonAnims}>
                            <AnswerButton color="bg-green-500" icon="Y" sendAnswer={sendAnswer} clickable={clickable} />
                            <AnswerButton color="bg-red-500" icon="N" sendAnswer={sendAnswer} clickable={clickable} />
                            <AnswerButton color="bg-gray-500" icon="?" sendAnswer={sendAnswer} clickable={clickable} />
                        </div>
                    }
                    {
                        qaState === "waiting" &&
                        <div className="h-12"></div>
                    }
                </div>
            }
        </>
    );
};

export default AnswererActive;