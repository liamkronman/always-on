// import logo from './logo.svg';
import "./App.css";
import { useRef, useEffect, useState } from "react";
import { PlayerCursor } from "./Cursor";
import Peer from "peerjs";

function App() {
	const [peerId, setPeerId] = useState("");
	const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
	const streamRef = useRef({stream: null})
	const remoteVideoRef = useRef(null);
	const peerInstance = useRef(null);
	const peerInstanceCursor = useRef(null);
	const [myCursorLoc, setMyCursorLoc] = useState();
	const [remotePeerCursorIdValue, setRemotePeerCursorIdValue] = useState("");
	const [cursorConn, setCursorConn] = useState();
	const [streamScreenSize, setStreamScreenSize] = useState([800, 600]);

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
		setStreamScreenSize([width, height]);

		streamRef.current.stream = stream;
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
			call.answer(streamRef.current.stream);
		});

		peerInstance.current = peer;

        return () => peer.destroy();
	}, []);

	useEffect(() => {
		const peer = new Peer();

		peer.on("open", (id) => {
			setPeerId(id);
		});

		peerInstanceCursor.current = peer;

        return () => peer.destroy();
	}, []);

	const call = async (remotePeerId) => {
		try {
			console.log("Attempting to call");
			const call = peerInstance.current.call(remotePeerId, streamRef.current.stream);

			console.log("Attempting to stream");
			call.on("stream", (remoteStream) => {
				console.log("Streaming");
				remoteVideoRef.current.srcObject = remoteStream;
				remoteVideoRef.current.play();
			});
			console.log("Set call event listener");
		} catch (e) {
			console.log(e);
		}
	};

	const connect = async (remotePeerId) => {
		console.log("Attempting to connect to peer cursor backend");
		setCursorConn(() => {
			const conn = peerInstanceCursor.current.connect(remotePeerId);
			conn.on("open", () => {
				console.log("Successfully connected to peer cursor backend");
			});
			return conn;
		});
	};

	useEffect(() => {
		if (cursorConn) {
			//console.log("Sent data to peer cursor backend!");

			const boundingBox = remoteVideoRef.current.getBoundingClientRect();

			cursorConn.send({
				user: peerId, // todo: need a better id
				data: {
					point: myCursorLoc && [
						((myCursorLoc[0] - boundingBox.x) * streamScreenSize[0]) /
							boundingBox.width,
						((myCursorLoc[1] - boundingBox.y) * streamScreenSize[1]) /
							boundingBox.height,
					],
				},
			});
		}
	}, [peerId, cursorConn, myCursorLoc, streamScreenSize]);

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
					style={
						{
							//cursor: "none",
						}
					}
				/>
			</div>
			<PlayerCursor point={myCursorLoc} fillColor="rgb(100, 250, 50)">
				Text
			</PlayerCursor>
		</div>
	);
}

export default App;
