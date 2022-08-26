// import logo from './logo.svg';
import "./App.css";
import { useRef, useEffect, useCallback, useState } from "react";
import { PlayerCursor } from "./Cursor";
import Peer from "peerjs";

function App() {
	const [peerId, setPeerId] = useState("");
	const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
	const streamRef = useRef({ stream: null });
	const remoteVideoRef = useRef(null);
	const peerInstance = useRef(null);
	const [myCursorLoc, setMyCursorLoc] = useState();
	const [cursorConn, setCursorConn] = useState();
	const [streamScreenSize, setStreamScreenSize] = useState([800, 600]);
	const myCursorInputRef = useRef();

	const getStream = async (screenId) => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
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
		console.log("My Screen Resolution", width, height);
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

		peer.on("connection", (conn) =>
			conn.on("data", (data) => window.electronAPI.setCursorInfo(data))
		);

		peer.on("call", async (call) => {
			call.answer(streamRef.current.stream);
		});

		peerInstance.current = peer;

		return () => peer.destroy();
	}, []);

	const call = async (remotePeerId) => {
		try {
			const call = peerInstance.current.call(
				remotePeerId,
				await navigator.mediaDevices.getUserMedia({audio: true})
			);

			call.on("stream", (remoteStream) => {
				remoteVideoRef.current.srcObject = remoteStream;
				remoteVideoRef.current.play();
			});

			setCursorConn(peerInstance.current.connect(remotePeerId));
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (cursorConn) {
			const boundingBox = remoteVideoRef.current.getBoundingClientRect();
			cursorConn.send({
				user: peerId, // todo: need a better id
				data: {
					point: myCursorLoc && [
						(myCursorLoc[0] - boundingBox.x) / boundingBox.width,
						(myCursorLoc[1] - boundingBox.y) / boundingBox.height,
					],
				},
			});
		}
	}, [peerId, cursorConn, myCursorLoc, streamScreenSize]);

	// https://devtrium.com/posts/how-keyboard-shortcut
	const handleKeyPress = useCallback((event) => {
		if (event.key === "Enter") {
			if (
				document.activeElement === document.body ||
				document.activeElement === myCursorInputRef.current
			) {
				if (document.activeElement !== myCursorInputRef.current) {
					setCursorInputContent("");
					myCursorInputRef.current.focus();
				} else document.activeElement.blur();
				event.preventDefault();
			}
		}
	}, []);

	useEffect(() => {
		// attach the event listener
		document.addEventListener("keydown", handleKeyPress);

		// remove the event listener
		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [handleKeyPress]);

	return (
		<div className="App">
			<h1>Current user id is {peerId}</h1>
			<input
				type="text"
				value={remotePeerIdValue}
				onChange={(e) => {
					setRemotePeerIdValue(e.target.value);
				}}
			/>
			<button onClick={() => call(remotePeerIdValue)}>Connect</button>
			<div>
				<video
					onMouseMove={(event) =>
						setMyCursorLoc([event.clientX, event.clientY])
					}
					onMouseLeave={(event) => setMyCursorLoc(undefined)}
					ref={remoteVideoRef}
					style={{
						//cursor: "none",
						border: "1px solid black",
						width: "100%",
						height: "auto",
						maxHeight: "100%",
					}}
				/>
			</div>
			<PlayerCursor
				point={myCursorLoc}
				myCursorInputRef={myCursorInputRef}
				fillColor="rgb(100, 250, 50)"
			>
				Text
			</PlayerCursor>
		</div>
	);
}

export default App;
