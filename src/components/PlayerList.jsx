import PlayerCard from "./PlayerCard";

const PlayerList = ({ names, scores, statuses, playerIndex, compact = false }) => {
    if (compact) {
        return (
            <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-hide">
                {names.map((name, index) => (
                    <PlayerCard 
                        key={index} 
                        playerName={name} 
                        score={scores[index]} 
                        color={statuses[index]} 
                        bold={playerIndex === index}
                        compact={true}
                        isCurrentPlayer={playerIndex === index}
                    />
                ))}
            </div>
        );
    }

    // Original vertical layout (fallback)
    return (
        <div className="z-10 flex flex-col height-full">
            {names.map((element, index) => (
                <PlayerCard 
                    key={index} 
                    playerName={element} 
                    score={scores[index]} 
                    color={statuses[index]} 
                    bold={playerIndex === index} 
                />
            ))}
        </div>
    );
};

export default PlayerList;