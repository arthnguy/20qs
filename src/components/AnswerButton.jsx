const AnswerButton = ({ color, icon, label, sendAnswer, clickable }) => {
    const getButtonStyles = () => {
        const baseStyles = "flex flex-col items-center justify-center w-24 h-20 rounded-xl border-2 font-bold transition-all duration-200 transform";
        
        if (!clickable) {
            return `${baseStyles} opacity-50 cursor-not-allowed pointer-events-none`;
        }
        
        const hoverStyles = "hover:scale-105 hover:shadow-lg active:scale-95";
        
        switch (color) {
            case "bg-green-500":
                return `${baseStyles} ${hoverStyles} bg-green-500 border-green-600 text-white hover:bg-green-600`;
            case "bg-red-500":
                return `${baseStyles} ${hoverStyles} bg-red-500 border-red-600 text-white hover:bg-red-600`;
            case "bg-gray-500":
                return `${baseStyles} ${hoverStyles} bg-gray-500 border-gray-600 text-white hover:bg-gray-600`;
            default:
                return `${baseStyles} ${hoverStyles} ${color} border-gray-600 text-white`;
        }
    };

    const getIconDisplay = () => {
        switch (icon) {
            case "Y": return "✅";
            case "N": return "❌";
            case "?": return "❓";
            default: return icon;
        }
    };

    return (
        <button 
            className={getButtonStyles()}
            onClick={() => sendAnswer(icon)}
            disabled={!clickable}
            title={label}
        >
            <span className="text-2xl mb-1">{getIconDisplay()}</span>
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
};

export default AnswerButton;