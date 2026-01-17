const QuestionCard = ({ question, setQuestion, editable, sendQuestion }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h3 className="text-white font-semibold text-lg flex items-center">
                    ❓ My Question
                </h3>
            </div>
            
            <div className="p-6">
                {!editable ? (
                    <div className="space-y-4">
                        <div className="bg-blue-50 rounded-xl p-4 h-24 flex items-center">
                            <p className="text-xl text-blue-900 font-medium break-words w-full">
                                {question || "No question entered"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <textarea
                            className="w-full h-24 bg-blue-50 rounded-xl p-4 text-lg text-blue-900 placeholder-blue-400 border-2 border-transparent focus:border-blue-300 focus:outline-none resize-none transition-colors"
                            id="question"
                            value={question}
                            placeholder="Is the character a real person?"
                            onChange={e => setQuestion(e.target.value)}
                            maxLength={200}
                        />
                        
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                <span>Ask a yes/no question</span>
                                <span className="ml-4">{question.length}/200</span>
                            </div>
                            <button
                                onClick={() => sendQuestion(question)}
                                disabled={!question.trim()}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform ${
                                    question.trim()
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                ❓ Send Question
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionCard;