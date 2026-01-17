const QuestionCharCard = ({ char, setChar, sendChar }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <h3 className="text-white font-semibold text-lg flex items-center">
                    🎯 Final Guess
                </h3>
            </div>
            
            <div className="p-6">
                <div className="space-y-4">
                    <div className="bg-green-50 rounded-xl p-4">
                        <label className="block text-green-700 font-medium mb-3">
                            I think the character is:
                        </label>
                        <input
                            className="w-full bg-white rounded-lg px-4 py-3 text-xl text-center text-green-900 placeholder-green-400 border-2 border-green-200 focus:border-green-400 focus:outline-none transition-colors font-medium"
                            id="char"
                            value={char}
                            placeholder="Enter character name..."
                            onChange={e => setChar(e.target.value)}
                            maxLength={50}
                        />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            <p>💡 Be specific! Include first and last name if applicable</p>
                            <div className="text-xs text-gray-500 mt-1">
                                {char.length}/50 characters
                            </div>
                        </div>
                        <button
                            onClick={() => sendChar(char)}
                            disabled={!char.trim()}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform ${
                                char.trim()
                                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            🎯 Submit Guess
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCharCard;