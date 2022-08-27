// import logo from './logo.svg';
import "./App.css";
import VideoPage from './VideoPage';

import { useEffect, useState } from "react";
import Auth from './Auth';
import useSocket from './useSocket';

function App() {
	const [token, setToken] = useState(null);
    const { connect, addFriendReqListener } = useSocket();

	// check if authenticated on load
	useEffect(() => {
		setToken(localStorage.getItem("accessToken"));
        //addFriendReqListener((username) => alert(username + 'added you'))
	}, []);

    useEffect(() => {
        connect(token);
    }, [token, connect]);

	return (
		<div className="App">
			{
				token
				? <VideoPage setToken={setToken} token={token} />
				: <Auth setToken={setToken} />
			}
		</div>
	);
}

export default App;
