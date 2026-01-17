import { useState, useEffect, useContext, useRef } from "react";
import QuestionCard from "../components/QuestionCard.jsx";
import QuestionCharCard from "../components/QuestionCharCard.jsx";
import socket from "../socket";
import GameContext from "../GameContext";

const QuestionerActive = () => {
    const { qaState, gameState, questionTime, remainingQs, attrList } = useContext(GameContext);
    const [time, setTime] = useState(questionTime);
    const [guessingChar, setGuessingChar] = useState(false);
    const [question, setQuestion] = useState("");
    const [viewMode, setViewMode] = useState('question'); // 'question' or 'review'
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shake, setShake] = useState(false);
    const timerRef = useRef(null);
    
    // Listen for wrong character guess to trigger shake
    useEffect(() => {
        const handleReceiveAnswer = (answer) => {
            // Check if it's a wrong character guess (ends with 'N' and we're guessing)
            if (guessingChar && answer.slice(-1) === 'N') {
                setShake(true);
                setTimeout(() => setShake(false), 500);
            }
        };

        socket.on("receive_answer", handleReceiveAnswer);
        
        return () => {
            socket.off("receive_answer", handleReceiveAnswer);
        };
    }, [guessingChar]);
    
    useEffect(() => {
        if (gameState !== "questioner") {
            return;
        }

        if (qaState === "active") {
            // Reset submitting state when new question arrives
            setIsSubmitting(false);
        }
        // Don't reset isSubmitting when going to waiting - let it stay hidden
    }, [qaState, gameState]);

    useEffect(() => {
        if (qaState === "active" && !timerRef.current) {
            timerRef.current = setInterval(() => {
                setTime(prev => prev - 1);
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [qaState]);

    useEffect(() => {
        if (time === 0) {
            setTime(questionTime);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            // Only trigger animation for regular questions, not character guesses
            if (!guessingChar) {
                setIsSubmitting(true);
                setTimeout(() => {
                    socket.emit("send_question", question, guessingChar, 0);
                }, 250);
            } else {
                // Character guess - send immediately without animation
                socket.emit("send_question", question, guessingChar, 0);
            }
        }
    }, [time, question, guessingChar, questionTime]);

    const sendQuestion = () => {
        // Only trigger slide up animation for regular questions, not character guesses
        if (!guessingChar) {
            setIsSubmitting(true);
            setTimeout(() => {
                socket.emit("send_question", question, guessingChar, time);
                setTime(questionTime);
            }, 250);
        } else {
            // Character guess - send immediately without animation
            socket.emit("send_question", question, guessingChar, time);
            setTime(questionTime);
        }
    };

    const getTimerColor = () => {
        if (time <= 5) return "text-red-600 bg-red-100";
        if (time <= 10) return "text-orange-600 bg-orange-100";
        return "text-blue-600 bg-blue-100";
    };

    const getTimerProgress = () => {
        return (time / questionTime) * 100;
    };

    return (
        <>
            {
                gameState === "questioner" &&
                <div className="w-full h-full absolute flex flex-col">
                    {/* Top Status Bar */}
                    {qaState === "active" && (
                        <div className="bg-white border-b border-gray-200 px-4 py-3 animate-fade-in">
                            <div className="max-w-4xl mx-auto flex items-center justify-between">
                                {/* Left: Timer */}
                                <div className="flex items-center space-x-3">
                                    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-bold ${getTimerColor()}`}>
                                        <span>⏱️</span>
                                        <span className="text-lg">{time}s</span>
                                    </div>
                                    <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-1000 ${
                                                time <= 5 ? 'bg-red-500' : time <= 10 ? 'bg-orange-500' : 'bg-blue-500'
                                            }`}
                                            style={{ width: `${getTimerProgress()}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Center: Mode Toggle */}
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        className={`px-3 py-1.5 rounded-md font-medium transition-all duration-200 text-sm ${
                                            !guessingChar && viewMode === 'question'
                                                ? 'bg-blue-600 text-white shadow-sm' 
                                                : 'text-gray-600 hover:text-blue-600'
                                        }`}
                                        onClick={() => {setGuessingChar(false); setViewMode('question'); setQuestion("");}}
                                    >
                                        ❓ Ask Question
                                    </button>
                                    <button
                                        className={`px-3 py-1.5 rounded-md font-medium transition-all duration-200 text-sm ${
                                            !guessingChar && viewMode === 'review'
                                                ? 'bg-purple-600 text-white shadow-sm' 
                                                : 'text-gray-600 hover:text-purple-600'
                                        }`}
                                        onClick={() => {setGuessingChar(false); setViewMode('review');}}
                                        disabled={attrList.length === 0}
                                    >
                                        📝 Review Answers ({attrList.length})
                                    </button>
                                    <button
                                        className={`px-3 py-1.5 rounded-md font-medium transition-all duration-200 text-sm ${
                                            guessingChar 
                                                ? 'bg-green-600 text-white shadow-sm' 
                                                : 'text-gray-600 hover:text-green-600'
                                        }`}
                                        onClick={() => {setGuessingChar(true); setViewMode('question'); setQuestion("");}}
                                    >
                                        🎯 Guess Character
                                    </button>
                                </div>

                                {/* Right: Questions Remaining */}
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-600 text-sm">Questions:</span>
                                    <span className={`font-bold px-2 py-1 rounded text-sm ${
                                        remainingQs <= 3 ? 'text-red-600 bg-red-100' : 
                                        remainingQs <= 7 ? 'text-orange-600 bg-orange-100' : 
                                        'text-green-600 bg-green-100'
                                    }`}>
                                        {remainingQs}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content Area - Two Screen Approach */}
                    <div className="flex-1 flex items-center justify-center p-6">
                        
                        {/* Question Input Screen */}
                        {viewMode === 'question' && (
                            <div className="w-full max-w-2xl">
                                {!guessingChar && qaState === "active" && (
                                    <div className={isSubmitting ? "animate-slide-up-fade-out" : ""}>
                                        <QuestionCard 
                                            question={question} 
                                            setQuestion={setQuestion} 
                                            editable={qaState === "active"} 
                                            sendQuestion={sendQuestion} 
                                        />
                                        
                                        {/* Quick hint to check answers */}
                                        {attrList.length > 0 && qaState === "active" && (
                                            <div className="text-center mt-6">
                                                <button
                                                    onClick={() => setViewMode('review')}
                                                    className="text-purple-600 hover:text-purple-800 text-sm underline"
                                                >
                                                    💡 Check previous answers for ideas
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {guessingChar && qaState === "active" && (
                                    <div className={shake ? "animate-shake" : ""}>
                                        {qaState === "waiting" && (
                                            <div className="text-center mb-6">
                                                <h2 className="text-2xl font-bold text-green-800 mb-2">
                                                    Guess Submitted!
                                                </h2>
                                                <p className="text-green-600">
                                                    Waiting for the result...
                                                </p>
                                            </div>
                                        )}
                                        <QuestionCharCard char={question} setChar={setQuestion} sendChar={sendQuestion} />
                                        
                                        {/* Quick hint to review answers */}
                                        {attrList.length > 0 && qaState === "active" && (
                                            <div className="text-center mt-6">
                                                <button
                                                    onClick={() => setViewMode('review')}
                                                    className="text-purple-600 hover:text-purple-800 text-sm underline"
                                                >
                                                    🔍 Review all answers before guessing
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Review Answers Screen */}
                        {viewMode === 'review' && (
                            <div className="w-full max-w-5xl">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-purple-800 mb-2">
                                        🤔 What We've Learned So Far
                                    </h2>
                                    <p className="text-purple-600 text-lg">
                                        Review your questions and answers to plan your next move
                                    </p>
                                </div>
                                
                                {attrList.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="text-6xl mb-4">🎯</div>
                                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No Questions Yet!</h3>
                                        <p className="text-gray-600 mb-6">Start asking questions to learn about the character</p>
                                        <button
                                            onClick={() => setViewMode('question')}
                                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                        >
                                            ❓ Ask Your First Question
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-wrap justify-center gap-6 mb-8">
                                            {attrList.map((element, index) => {
                                                const question = element.slice(0, -1);
                                                const answer = element.slice(-1);
                                                const isYes = answer === "Y";
                                                const isNo = answer === "N";
                                                
                                                return (
                                                    <div 
                                                        key={index} 
                                                        className={`
                                                            bg-white rounded-2xl p-6 shadow-lg border-2 w-80 transform hover:scale-105 transition-all duration-200 cursor-default
                                                            ${isYes ? 'border-green-300 bg-green-50' : 
                                                              isNo ? 'border-red-300 bg-red-50' : 
                                                              'border-gray-300 bg-gray-50'}
                                                        `}
                                                        style={{
                                                            transform: `rotate(${(index % 5 - 2) * 1.5}deg) scale(1)`
                                                        }}
                                                    >
                                                        <div className="text-center">
                                                            <div className="mb-4">
                                                                <span className="text-xs text-gray-500 uppercase tracking-wide">
                                                                    Question #{index + 1}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-800 mb-4 font-medium text-lg leading-relaxed" title={question}>
                                                                "{question}"
                                                            </p>
                                                            <div className={`
                                                                inline-flex items-center px-6 py-3 rounded-full font-bold text-xl shadow-md
                                                                ${isYes ? 'bg-green-500 text-white' : 
                                                                  isNo ? 'bg-red-500 text-white' : 
                                                                  'bg-gray-500 text-white'}
                                                            `}>
                                                                {isYes ? '✅ YES!' : isNo ? '❌ NOPE!' : '❓ DUNNO'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        
                                        <div className="text-center">
                                            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200 inline-block">
                                                <h3 className="text-xl font-bold text-blue-800 mb-3">Ready for your next move?</h3>
                                                <div className="flex gap-4 justify-center">
                                                    <button
                                                        onClick={() => setViewMode('question')}
                                                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                                    >
                                                        ❓ Ask Another Question
                                                    </button>
                                                    <button
                                                        onClick={() => {setGuessingChar(true); setViewMode('question');}}
                                                        className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                                    >
                                                        🎯 Make Your Guess!
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            }
        </>
    );
};

export default QuestionerActive;