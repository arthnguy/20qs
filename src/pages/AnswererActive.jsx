import { useState, useEffect, useContext } from "react";
import AnswerCard from "../components/AnswerCard";
import AnswerButton from "../components/AnswerButton";
import GameContext from "../GameContext";
import socket from "../socket";

const AnswererActive = () => {
    const [cardAnims, setCardAnims] = useState("opacity-0");
    const [buttonAnims, setButtonAnims] = useState("opacity-0");
    const [display, setDisplay] = useState(false);
    const [clickable, setClickable] = useState(false);
    const { questionerName, questionerID, question, qaState } = useContext(GameContext);

    // Send answer and remove from current list to answer
    const sendAnswer = answer => {
        socket.emit("send_answer", questionerID, `${question}${answer}`);
        setClickable(false);
        // No animation when sending answer - just wait for next question
    };

    useEffect(() => {
        if (qaState === "active") {
            setDisplay(true);
            // Fade in from top when new question arrives
            setCardAnims("animate-fade-in-from-top");
            setButtonAnims("animate-fade-in");
            setTimeout(() => setClickable(true), 400);
        } else if (qaState === "waiting") {
            // Just disable clicking while waiting, no animation
            setClickable(false);
        } else {
            setDisplay(false);
            setCardAnims("opacity-0");
            setButtonAnims("opacity-0");
            setClickable(false);
        }
    }, [qaState]);

    return (
        <>
            {display && (
                <div className="w-full h-full flex flex-col">
                    {/* Integrated Header */}
                    <div className="bg-white border-b border-green-200 p-4 animate-fade-in">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center justify-center">
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl">🎯</span>
                                    <div className="text-center">
                                        <h2 className="text-xl font-bold text-green-800">You're the Answerer!</h2>
                                        <p className="text-green-600 text-sm">Answer honestly about your character</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Question Card */}
                    <div className="flex-1 flex items-center justify-center p-6">
                        <div className={`w-full max-w-2xl ${cardAnims}`}>
                            <AnswerCard questionerName={questionerName} question={question} />
                        </div>
                    </div>

                    {/* Integrated Answer Buttons */}
                    <div className="bg-white border-t border-green-200 p-6 animate-fade-in">
                        <div className="max-w-2xl mx-auto">
                            <div className="text-center mb-4">
                                <p className="text-green-700 font-medium">How would you answer this question?</p>
                            </div>
                            
                            <div className={`flex justify-center space-x-4 ${buttonAnims}`}>
                                <AnswerButton 
                                    color="bg-green-500" 
                                    icon="Y" 
                                    label="Yes" 
                                    sendAnswer={sendAnswer} 
                                    clickable={clickable} 
                                />
                                <AnswerButton 
                                    color="bg-red-500" 
                                    icon="N" 
                                    label="No" 
                                    sendAnswer={sendAnswer} 
                                    clickable={clickable} 
                                />
                                <AnswerButton 
                                    color="bg-gray-500" 
                                    icon="?" 
                                    label="Don't Know" 
                                    sendAnswer={sendAnswer} 
                                    clickable={clickable} 
                                />
                            </div>
                            
                            <div className="text-center mt-4">
                                <p className="text-gray-500 text-sm">
                                    💭 Think carefully about your character when answering
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AnswererActive;