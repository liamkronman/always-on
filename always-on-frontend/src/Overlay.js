// import logo from './logo.svg';
import "./App.css";
import { useState } from "react";
import { PlayerCursor } from "./Cursor";

function Overlay() {
	const [myCursorLoc, setMyCursorLoc] = useState([0, 0]);
	return (
		<div
			id="Overlay"
			onMouseMove={(event) => setMyCursorLoc([event.clientX, event.clientY])}
			style={{ height: "100vh", width: "100vw" }}
		>
			<PlayerCursor point={myCursorLoc} fillColor="rgb(100, 250, 50)">
				Text
			</PlayerCursor>
		</div>
	);
}

export default Overlay;
