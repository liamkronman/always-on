// import logo from './logo.svg';
import "./App.css";
import { useRef, useEffect, useState } from "react";
import { PlayerCursor } from "./Cursor";
import Peer from "peerjs";

function App() {
	const [peerId, setPeerId] = useState("");
	const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
	const [stream, setStream] = useState(null);
	const remoteVideoRef = useRef(null);
	const peerInstance = useRef(null);
	const [myCursorLoc, setMyCursorLoc] = useState();
	const [remotePeerCursorIdValue, setRemotePeerCursorIdValue] = useState();
	const [cursorConn, setCursorConn] = useState();

	const getStream = async (screenId) => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					mandatory: {
						chromeMediaSource: "desktop",
						chromeMediaSourceId: screenId,
					},
				},
			});

			handleStream(stream);
		} catch (e) {
			console.log(e);
		}
	};

	const handleStream = (stream) => {
		let { width, height } = stream.getVideoTracks()[0].getSettings();

		setStream(stream);
	};

	window.electronAPI.getScreenId((event, screenId) => {
		console.log("Renderer...", screenId);
		getStream(screenId);
	});

	useEffect(() => {
		const peer = new Peer();

		peer.on("open", (id) => {
			setPeerId(id);
		});

		peer.on("call", async (call) => {
			call.answer(stream);
		});

		peerInstance.current = peer;
	}, [stream]);

	const call = async (remotePeerId) => {
		try {
			const call = peerInstance.current.call(remotePeerId, stream);

			call.on("stream", (remoteStream) => {
				remoteVideoRef.current.srcObject = remoteStream;
				remoteVideoRef.current.play();
			});
		} catch (e) {
			console.log(e);
		}
	};

	const connect = async (remotePeerId) => {
		console.log("Attempting to connect to peer cursor backend");
		setCursorConn(() => {
			const conn = peerInstance.current.connect(remotePeerId);
			conn.on("open", () => {
				console.log("Successfully connected to peer cursor backend");
			});
			return conn;
		});
	};

	useEffect(() => {
		if (cursorConn) {
			console.log("Sent data to peer cursor backend!");
			cursorConn.send({
				user: peerId, // todo: need a better id
				data: {
					point: myCursorLoc,
				},
			});
		}
	}, [peerId, cursorConn, myCursorLoc]);

	return (
		<div className="App">
			<h1>Current user id is {peerId}</h1>
			<input
				type="text"
				value={remotePeerIdValue}
				onChange={(e) => setRemotePeerIdValue(e.target.value)}
			/>
			<button onClick={() => call(remotePeerIdValue)}>Connect (Video)</button>
			<input
				type="text"
				value={remotePeerCursorIdValue}
				onChange={(e) => setRemotePeerCursorIdValue(e.target.value)}
			/>
			<button onClick={() => connect(remotePeerCursorIdValue)}>
				Connect (Cursor)
			</button>
			<div>
				<video
					onMouseMove={(event) =>
						setMyCursorLoc([event.clientX, event.clientY])
					}
					onMouseLeave={(event) => setMyCursorLoc(undefined)}
					ref={remoteVideoRef}
				/>
			</div>
			<PlayerCursor point={myCursorLoc} fillColor="rgb(100, 250, 50)">
				Text
			</PlayerCursor>
		</div>
	);
}

export default App;
