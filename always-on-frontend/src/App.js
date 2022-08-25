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
	const [myCursorLoc, setMyCursorLoc] = useState([0, 0]);

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
			console.log("Streaming");
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

	return (
		<div className="App">
			<h1>Current user id is {peerId}</h1>
			<input
				type="text"
				value={remotePeerIdValue}
				onChange={(e) => setRemotePeerIdValue(e.target.value)}
			/>
			<button onClick={() => call(remotePeerIdValue)}>Call</button>
			<div>
				<video
					style={{ border: "1px solid black" }}
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

// // import logo from './logo.svg';
// import "./App.css";
// import { Peer } from "peerjs";
// import { useRef, useEffect } from "react";

// function App() {
// 	const peer = new Peer();
// 	peer.on("open", (id) => {
// 		console.log("Opened, my ID is", id);
// 	});
// 	console.log(peer);
// 	peer.on("error", (message) => console.log("Errored out", message));

// 	const conn = peer.connect("d25b0359-641d-42f0-abcb-2499cb35ffa7");
// 	//console.log("Is conn open?", conn.open());
// 	conn.on("open", () => {
// 		console.log("conn Connected");
// 		conn.send("Hi!");
// 	});
// 	peer.on("error", (message) => console.log("Errored out", message));

// 	peer.on("connection", (conn) => {
// 		conn.on("data", (data) => {
// 			console.log(data);
// 		});
// 		conn.on("open", () => {
// 			console.log("Opened 2?");
// 			conn.send("Hello!");
// 		});
// 	});

// 	const videoRef = useRef();

// 	const getStream = async (screenId) => {
// 		try {
// 			const stream = await navigator.mediaDevices.getUserMedia({
// 				audio: false,
// 				video: {
// 					mandatory: {
// 						chromeMediaSource: "desktop",
// 						chromeMediaSourceId: screenId,
// 					},
// 				},
// 			});

// 			handleStream(stream);
// 		} catch (e) {
// 			console.log(e);
// 		}
// 	};

// 	const handleStream = (stream) => {
// 		let { width, height } = stream.getVideoTracks()[0].getSettings();

// 		// window.electronAPI.setSize({ width, height });

// 		videoRef.current.srcObject = stream;
// 		videoRef.current.onloadedmetadata = (e) => videoRef.current.play();
// 	};

// 	window.electronAPI.getScreenId((event, screenId) => {
// 		console.log("Renderer...", screenId);
// 		getStream(screenId);
// 	});

// 	return (
// 		<div className="App">
// 			<>
// 				<span>800 x 600</span>
// 				<video ref={videoRef} className="video"></video>
// 			</>
// 		</div>
// 	);
// }

// export default App;
