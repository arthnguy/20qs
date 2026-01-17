const AttrList = ({ attrs, remainingQs }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3">
                <h3 className="text-white font-semibold flex items-center justify-between">
                    <span>📝 Q&A History</span>
                    <span className="text-purple-100 text-sm">
                        {attrs.length} questions asked
                    </span>
                </h3>
            </div>
            
            <div className="p-4 h-full overflow-hidden flex flex-col">
                {attrs.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🤔</div>
                            <p>No questions yet</p>
                            <p className="text-sm">Start asking to learn about the character!</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto space-y-3">
                        {attrs.map((element, index) => {
                            const question = element.slice(0, -1);
                            const answer = element.slice(-1);
                            const isYes = answer === "Y";
                            const isNo = answer === "N";
                            
                            return (
                                <div 
                                    key={index} 
                                    className="bg-gray-50 rounded-xl p-3 animate-fade-in border-l-4 border-l-purple-300"
                                >
                                    <p className="text-sm text-gray-700 mb-2 break-words">
                                        {question}
                                    </p>
                                    <div className="flex items-center justify-center">
                                        <span className={`
                                            px-3 py-1 rounded-full text-sm font-medium
                                            ${isYes ? 'bg-green-100 text-green-700' : 
                                              isNo ? 'bg-red-100 text-red-700' : 
                                              'bg-gray-100 text-gray-700'}
                                        `}>
                                            {isYes ? '✅ Yes' : isNo ? '❌ No' : '❓ Unknown'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                
                {attrs.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="text-center text-sm text-gray-600">
                            💡 Use this info to make your final guess!
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttrList;