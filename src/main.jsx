import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { GameContextProvider } from './GameContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
	<GameContextProvider>
		<App />
	</GameContextProvider>,
)
