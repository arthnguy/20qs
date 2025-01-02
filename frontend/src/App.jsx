import { useState, useContext } from "react";
import GameContext from "./GameContext.jsx";
import InfoWindow from "./components/InfoWindow.jsx";
import Home from "./pages/Home.jsx";
import Game from "./pages/Game.jsx";

function App() {
	const { inGame } = useContext(GameContext);
	const [showInfo, setShowInfo] = useState(false);

	return (
		<div 
			className="w-screen h-screen bg-blue-50 animate-scroll-dots fixed"
			style={{backgroundImage: "radial-gradient(circle, skyblue 15%, transparent 0%)", backgroundSize: "30px 30px"}}
		>
			{showInfo && <InfoWindow setShowInfo={setShowInfo} />}
			<button 
				className="fixed border-blue-400 bg-white z-10 text-xl border-2 w-10 h-10 bottom-3 right-3 rounded-3xl shadow-md"
				onClick={() => setShowInfo(true)}
			>
				?
			</button>
			{
				!inGame &&
				<Home />
			}
			{
				inGame &&
				<Game />
			}
		</div>
	)
}

export default App
