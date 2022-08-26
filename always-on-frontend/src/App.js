// import logo from './logo.svg';
import "./App.css";
import VideoPage from './VideoPage';

import { useEffect, useState } from "react";
import Auth from './Auth';

function App() {
	const [token, setToken] = useState(null);

	// check if authenticated on load
	useEffect(() => {
		setToken(localStorage.getItem("accessToken"));
	}, []);

	return (
		<div className="App">
			{
				token
				? <VideoPage />
				: <Auth setToken={setToken} />
			}
		</div>
	);
}

export default App;
