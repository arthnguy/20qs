const GameButton = ({ text, onClick }) => {
    return (
        <button className="w-36 bg-blue-600 rounded-md text-white p-2 border-2 border-black" onClick={() => onClick()}>{text}</button>
    );
};

export default GameButton;