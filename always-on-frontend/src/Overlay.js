// import logo from './logo.svg';
import "./App.css";
import { useEffect, useState } from "react";
import { PlayerCursor } from "./Cursor";

function Overlay() {
	const [myCursorLoc, setMyCursorLoc] = useState([0, 0]);
	const [otherCursors, setOtherCursors] = useState({});

    useEffect(() => {
        window.electronAPI.onSetCursorInfo((event, data) => setOtherCursors((prev) => ({...prev, [data.user]: {...prev[data.user], ...data.data}})));
    }, []);

	return (
		<div
			id="Overlay"
			onMouseMove={(event) => setMyCursorLoc([event.clientX, event.clientY])}
			style={{ height: "100vh", width: "100vw" }}
		>
			{Object.entries(otherCursors).map((val, index) => {
				return <PlayerCursor point={val[1].point}>test</PlayerCursor>;
			})}
		</div>
	);
}

export default Overlay;
