const AnswerButton = ({ color, icon, sendAnswer }) => {
    return (
        <button className={"w-12 h-12 text-white border-black border-2 rounded-md text-xl " + color} onClick={() => sendAnswer(icon)}>{icon}</button>
    );
};

export default AnswerButton;