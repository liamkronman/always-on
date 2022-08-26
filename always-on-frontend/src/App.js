// import logo from './logo.svg';
import "./App.css";
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
				? <></>
				: <Auth setToken={setToken} />
			}
		</div>
	);
}

export default App;
