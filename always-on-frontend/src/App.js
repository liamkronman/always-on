// import logo from './logo.svg';
import "./App.css";
import VideoPage from './VideoPage';

import { useEffect, useState } from "react";
import Auth from './Auth';
import useSocket from './useSocket';

function App() {
	const [token, setToken] = useState(null);
    const { connect } = useSocket();

	// check if authenticated on load
	useEffect(() => {
		setToken(localStorage.getItem("accessToken"));
	}, []);

    useEffect(() => {
        connect(token);
    }, [token, connect]);

	return (
		<div className="App">
			{
				token
				? <VideoPage setToken={setToken} />
				: <Auth setToken={setToken} />
			}
		</div>
	);
}

export default App;
