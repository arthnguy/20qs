const QuestionCharCard = ({ char, setChar }) => {
    return (
        <div className="w-full flex flex-col justify-center items-center">
            <div className="w-full bg-gray-50 mb-2 border-gray-200 border-2 p-2 flex flex-col items-center shadow-md">
                <p>The character is:</p>
                <input
                    className="w-full focus:outline-none h-12 text-3xl text-center font-input"
                    id="char"
                    value={char}
                    placeholder="Jane Doe"
                    onChange={e => setChar(e.target.value)}
                />
            </div>
        </div>
    );
};

export default QuestionCharCard;