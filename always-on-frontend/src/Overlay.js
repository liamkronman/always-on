// import logo from './logo.svg';
import "./App.css";
import { useRef, useEffect, useState } from "react";
import { PlayerCursor } from "./Cursor";
import Peer from "peerjs";

function Overlay() {
	const [peerId, setPeerId] = useState();
	const [myCursorLoc, setMyCursorLoc] = useState([0, 0]);
	const [otherCursors, setOtherCursors] = useState(new Map());
	const peerInstance = useRef(null);

	useEffect(() => {
		const peer = new Peer();

		peer.on("open", (id) => {
			console.log("Overlay PeerId is", id);
			setPeerId(id);
		});
		/*
		 * You are the server
		 */
		peer.on("connection", async (conn) => {
			conn.on("data", (data) => {
				console.log("Received data", data);
				setOtherCursors((prev) => {
					prev[data.user] = { ...prev[data.user], ...data.data };
					return prev;
				});
			});
		});

		peerInstance.current = peer;
	}, []);

	return (
		<div
			id="Overlay"
			onMouseMove={(event) => setMyCursorLoc([event.clientX, event.clientY])}
			style={{ height: "100vh", width: "100vw" }}
		>
			{Object.entries(otherCursors).forEach((key, val) => {
				const { content, ...rest } = val;
				return <PlayerCursor {...rest}>content</PlayerCursor>;
			})}
		</div>
	);
}

export default Overlay;
