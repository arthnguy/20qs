const AnswerCard = ({ questionerName, question }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-lg flex items-center">
                        ❓ Question for You
                    </h3>
                    <div className="bg-green-400 bg-opacity-30 px-3 py-1 rounded-full">
                        <span className="text-white text-sm font-medium">
                            From: {questionerName}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="p-6">
                <div className="bg-green-50 rounded-xl p-6 min-h-[120px] flex items-center">
                    <p className="text-xl text-green-900 font-medium break-words w-full leading-relaxed">
                        {question || "No question received"}
                    </p>
                </div>
                
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        💭 Think about your character and answer honestly
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AnswerCard;