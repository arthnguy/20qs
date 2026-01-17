const GameButton = ({ text, onClick }) => {
    return (
        <button 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
            onClick={() => onClick()}
        >
            {text}
        </button>
    );
};

export default GameButton;