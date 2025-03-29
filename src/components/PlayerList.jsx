import PlayerCard from "./PlayerCard";

const PlayerList = ({ names, scores, statuses, playerIndex }) => {
    return (
        <div className="z-10 flex flex-col height-full">
        {
            names.map((element, index) => (
                <PlayerCard key={index} playerName={element} score={scores[index]} color={statuses[index]} bold={playerIndex === index} />
            ))
        }
        </div>
    );
};

export default PlayerList;