// import logo from './logo.svg';
import "./App.css";
import { useRef, useEffect, useState } from "react";
import { PlayerCursor } from "./Cursor";
import Peer from "peerjs";

function Overlay() {
	const [peerId, setPeerId] = useState();
	const [myCursorLoc, setMyCursorLoc] = useState([0, 0]);
	const [otherCursors, setOtherCursors] = useState({});
	const peerInstance = useRef(null);

	useEffect(() => {
		const peer = new Peer();

		peer.on("open", (id) => {
			setPeerId(id);
		});
		/*
		 * You are the server
		 */
		peer.on("connection", async (conn) => conn.on("data", (data) => setOtherCursors((prev) => ({...prev, [data.user]: {...prev[data.user], ...data.data}}))));

		peerInstance.current = peer;
	}, []);

	return (
		<div
			id="Overlay"
			onMouseMove={(event) => setMyCursorLoc([event.clientX, event.clientY])}
			style={{ height: "100vh", width: "100vw" }}
		>
			<span
				style={{
					color: "rgba(0, 255, 0, 0.5)",
					fontSize: 30,
					fontStyle: "bold",
					background: "rgba(0, 0, 0, 0.5)",
					padding: "1em",
				}}
			>
				{peerId}
			</span>
			{Object.entries(otherCursors).map((val, index) => {
				return <PlayerCursor point={val[1].point}>test</PlayerCursor>;
			})}
		</div>
	);
}

export default Overlay;
