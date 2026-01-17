import { useState } from "react";

const InfoWindow = ({setShowInfo}) => {
    const [closed, setClosed] = useState(false);

    const onClose = () => {
        setClosed(true);
        setTimeout(() => setShowInfo(false), 200);
    };

    return (
        <div className={"flex justify-center items-center p-4 w-full h-full fixed z-20 animate-fade-in bg-black bg-opacity-60" + (closed ? " animate-fade-out" : "")}>
            <div className="flex flex-col w-full max-w-2xl border-blue-400 bg-white p-8 border-2 rounded-2xl shadow-2xl">
                <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                        ?
                    </div>
                    <h2 className="text-2xl font-bold text-blue-800">How to Play 20qs</h2>
                </div>
                
                <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                        <strong className="text-blue-700">20qs</strong> is an online multiplayer version of the classic parlor game "20 Questions".
                    </p>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Game Flow:</h3>
                        <ul className="space-y-1 text-sm">
                            <li>• Each player takes turns being the <strong>answerer</strong></li>
                            <li>• The answerer picks a character (real or fictional)</li>
                            <li>• Other players ask yes/no questions to guess the character</li>
                            <li>• Each questioner has 20 questions maximum</li>
                        </ul>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">Scoring:</h3>
                        <p className="text-sm">
                            Points are awarded based on how efficiently you guess the character. 
                            The fewer questions you use, the more points you earn!
                        </p>
                    </div>

                    <p className="text-sm text-gray-600">
                        Information from your questions will be stored on the right side during gameplay. 
                        The player with the most points after all rounds wins!
                    </p>
                </div>
                
                <button 
                    className="mt-8 mx-auto px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white 
                             rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 
                             transition-all duration-200 disabled:opacity-50" 
                    onClick={() => onClose()}
                    disabled={closed}
                >
                    Got it! Let's play 🎯
                </button>
            </div>
        </div>
    )
};

export default InfoWindow;