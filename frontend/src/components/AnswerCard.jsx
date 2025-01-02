const AnswerCard = ({ questionerName, question }) => {
    return (
        <div className="flex flex-col w-full h-full justify-center items-center">
            <div className="w-full h-full bg-gray-50 mb-2 border-gray-200 border-2 p-2 flex flex-col shadow-md">
                <div className="flex justify-between">
                    <p>My question is:</p>
                    <p>From: {questionerName}</p>
                </div>
                <p className="text-xl font-input break-all overflow-auto">{question}</p>
            </div>
        </div>
    );
};

export default AnswerCard;