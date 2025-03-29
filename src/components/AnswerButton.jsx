const AnswerButton = ({ color, icon, sendAnswer, clickable }) => {
    return (
        <button className={(clickable ? "pointer-events-auto " : "pointer-events-none ") + " w-12 h-12 text-white border-black border-2 rounded-md text-xl " + color} onClick={() => sendAnswer(icon)}>{icon}</button>
    );
};

export default AnswerButton;