import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import "./App.css";

function App() {
	const [peerId, setPeerId] = useState("");
	const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
	const remoteVideoRef = useRef(null);
	const currentUserVideoRef = useRef(null);
	const peerInstance = useRef(null);

	useEffect(() => {
		const peer = new Peer();

		peer.on("open", (id) => {
			setPeerId(id);
		});

		peer.on("call", (call) => {
			var getUserMedia =
				navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia;

			getUserMedia({ video: true, audio: true }, (mediaStream) => {
				currentUserVideoRef.current.srcObject = mediaStream;
				currentUserVideoRef.current.play();
				call.answer(mediaStream);
				call.on("stream", function (remoteStream) {
					remoteVideoRef.current.srcObject = remoteStream;
					remoteVideoRef.current.play();
				});
			});
		});

		peerInstance.current = peer;
	}, []);

	const call = (remotePeerId) => {
		var getUserMedia =
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia;

		getUserMedia({ video: true, audio: true }, (mediaStream) => {
			currentUserVideoRef.current.srcObject = mediaStream;
			currentUserVideoRef.current.play();

			const call = peerInstance.current.call(remotePeerId, mediaStream);

			call.on("stream", (remoteStream) => {
				remoteVideoRef.current.srcObject = remoteStream;
				remoteVideoRef.current.play();
			});
		});
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
				<video ref={currentUserVideoRef} />
			</div>
			<div>
				<video ref={remoteVideoRef} />
			</div>
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
