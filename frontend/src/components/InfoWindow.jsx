import { useState } from "react";

const InfoWindow = ({setShowInfo}) => {
    const [closed, setClosed] = useState(false);

    const onClose = () => {
        setClosed(true);
        setTimeout(() => setShowInfo(false), 200);
    };

    return (
        <div className={"flex justify-center items-center p-2 w-full h-full fixed z-20 animate-fade-in bg-black bg-opacity-50" + (closed ? " animate-fade-out" : "")}>
            <div className="flex flex-col w-1/2 border-blue-400 bg-white p-2 border-2 rounded-xl">
                <p className="text-xl">
                    20qs is an online multiplayer game based on the real life parlor game "20 Questions".
                    There will be a set number of rounds. In each round, each player gets the chance to be the answerer in a Q&A.
                    In each Q&A, the answerer comes up with a character that the other players, questioners, will have to deduce using yes/no questions.
                    Information gained will be stored on the right side.
                    After all the questioners either guess the character correctly or use up their 20 questions, 
                    they will gain points based on how question efficient they were in regards to deducing the character.
                    Whoever has the most points after all the rounds wins.
                </p>
                <button 
                    className="m-auto mt-5 text-2xl bg-blue-600 text-white p-2 rounded-md" 
                    onClick={() => onClose()}
                    disabled={closed}
                >
                    Okey-dokey
                </button>
            </div>
        </div>
    )
};

export default InfoWindow;