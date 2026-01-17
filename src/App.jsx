import { useState, useContext } from "react";
import GameContext from "./GameContext.jsx";
import InfoWindow from "./components/InfoWindow.jsx";
import Home from "./pages/Home.jsx";
import Game from "./pages/Game.jsx";

function App() {
	const { inGame } = useContext(GameContext);
	const [showInfo, setShowInfo] = useState(false);

	return (
		<div className="w-screen h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 fixed overflow-x-hidden overflow-y-auto overscroll-none">
			{/* Floating background elements */}
			<div className="absolute inset-0 pointer-events-none">
				<div 
					className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-full opacity-10"
					style={{
						animation: 'floatingShapes 15s ease-in-out infinite'
					}}
				></div>
				<div 
					className="absolute top-3/4 right-1/4 w-24 h-24 bg-blue-300 rounded-full opacity-15"
					style={{
						animation: 'floatingShapes 15s ease-in-out infinite',
						animationDelay: '5s'
					}}
				></div>
				<div 
					className="absolute top-1/2 left-3/4 w-20 h-20 bg-blue-100 rounded-full opacity-20"
					style={{
						animation: 'floatingShapes 15s ease-in-out infinite',
						animationDelay: '10s'
					}}
				></div>
			</div>
			
			{showInfo && <InfoWindow setShowInfo={setShowInfo} />}
			<button 
				className="fixed border-blue-400 bg-white hover:bg-blue-50 z-10 text-xl font-semibold 
						 border-2 w-12 h-12 bottom-4 right-4 rounded-full shadow-lg hover:shadow-xl
						 transform hover:scale-110 transition-all duration-200 text-blue-600"
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
