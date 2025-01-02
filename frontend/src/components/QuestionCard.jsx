const QuestionCard = ({ question, setQuestion, editable }) => {
    return (
        <div className="flex flex-col w-full h-full justify-center items-center">
            <div className="w-full h-full bg-gray-50 mb-2 border-gray-200 border-2 p-2 flex flex-col shadow-md">
                <p>My question is:</p>
                {
                    !editable &&
                    <p className="text-xl font-input break-all">{question}</p>
                }
                {
                    editable &&
                    <textarea
                        className="w-full h-full focus:outline-none text-xl resize-none font-input pl-1 pr-1"
                        id="question"
                        value={question}
                        placeholder="What is love?"
                        onChange={e => setQuestion(e.target.value)}
                    />
                }
            </div>
        </div>
    );
};

export default QuestionCard;