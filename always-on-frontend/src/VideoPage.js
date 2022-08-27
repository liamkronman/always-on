import { useRef, useEffect, useCallback, useState } from "react";
import { PlayerCursor } from "./Cursor";
import Peer from "peerjs";

<<<<<<< Updated upstream
function VideoPage() {
=======
const TIME_FRESH = 5000;
const TIME_FADE = 5000;

function VideoPage({ setToken }) {
>>>>>>> Stashed changes
	const [peerId, setPeerId] = useState("");
	const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
	const streamRef = useRef({ stream: null });
	const remoteVideoRef = useRef(null);
	const peerInstance = useRef(null);
	const [mediaConn, setMediaConn] = useState();
	const [cursorConn, setCursorConn] = useState();
	const [streamScreenSize, setStreamScreenSize] = useState([800, 600]);

	const [myCursorLoc, setMyCursorLoc] = useState();
	const myCursorInputRef = useRef();
	const [cursorInputContent, setCursorInputContent] = useState("");
	const [cursorInputLastRefresh, setCursorInputLastRefresh] = useState(-1);
	const [cursorInputContentIsFading, setCursorInputContentIsFading] =
		useState(false);

	const audioRef = useRef(null);

	const getStream = async (screenId) => {
		try {
			const vidStream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					mandatory: {
						chromeMediaSource: "desktop",
						chromeMediaSourceId: screenId,
					},
				},
			});
			// https://github.com/electron/electron/issues/8589#issuecomment-279089161
			const audStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});
			const audTracks = audStream.getAudioTracks();
			if (audTracks.length > 0) vidStream.addTrack(audTracks[0]);
			handleStream(vidStream);
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
<<<<<<< Updated upstream
=======
		window.electronAPI.setMenu(true);

>>>>>>> Stashed changes
		const peer = new Peer();

		peer.on("open", (id) => {
			setPeerId(id);
		});

		peer.on("connection", (conn) =>
			conn.on("data", (data) => window.electronAPI.setCursorInfo(data))
		);

		peer.on("call", async (call) => {
			call.answer(streamRef.current.stream);

			call.on("stream", (viewerStream) => {
				audioRef.current.srcObject = viewerStream;
				audioRef.current.autoplay = true;
			});
		});

		peerInstance.current = peer;

<<<<<<< Updated upstream
		return () => peer.destroy();
=======
		return () => {
			window.electronAPI.setMenu(false);
			peer.destroy();
		};
>>>>>>> Stashed changes
	}, []);

	const call = async (remotePeerId) => {
		try {
			if (mediaConn) mediaConn.close();
			if (cursorConn) cursorConn.close();

			const call = peerInstance.current.call(
				remotePeerId,
				streamRef.current.stream
			);

			call.on("stream", (remoteStream) => {
				remoteVideoRef.current.srcObject = remoteStream;
				remoteVideoRef.current.autoplay = true;
			});

			setMediaConn(call);

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
					content: cursorInputContent,
				},
			});
		}
	}, [peerId, cursorConn, myCursorLoc, streamScreenSize, cursorInputContent]);

	// https://devtrium.com/posts/how-keyboard-shortcut
	const handleKeyPress = useCallback((event) => {
		if (event.key === "Enter") {
			if (
				document.activeElement === myCursorInputRef.current &&
				cursorInputContent === ""
			) {
				// toggle
				myCursorInputRef.current.blur();
				event.preventDefault();
			}

			if (
				document.activeElement === document.body ||
				document.activeElement === myCursorInputRef.current
			) {
				setCursorInputContent("");
				myCursorInputRef.current.focus();
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

	useEffect(() => {
		const id = setInterval(() => {
			const timenow = Date.now();

			if (timenow > cursorInputLastRefresh + TIME_FRESH + TIME_FADE) {
				setCursorInputContentIsFading((prev) => {
					if (prev) {
						setCursorInputContent("");
						myCursorInputRef.current.blur();
						if (cursorConn)
							cursorConn.send({
								user: peerId,
								data: { fading: false, content: "" }, // `fading: false` is optional
							});
					}
					return false;
				});
			} else if (timenow > cursorInputLastRefresh + TIME_FRESH) {
				setCursorInputContentIsFading((prev) => {
					if (!prev && cursorConn)
						cursorConn.send({
							user: peerId,
							data: {
								fading: true,
							},
						});
					return true;
				});
			}
		}, 501);
		return () => clearInterval(id);
	}, [cursorConn, cursorInputContentIsFading, cursorInputLastRefresh, peerId]);

	const refreshChat = (text) => {
		setCursorInputContent(text);
		const timenow = Date.now();
		setCursorInputContentIsFading(false);
		if (cursorConn)
			cursorConn.send({
				user: peerId,
				data: {
					fading: false,
					content: text,
				},
			});
		setCursorInputLastRefresh(timenow);
	};

	return (
		<div className="App">
			<h1>Current user id is {peerId}</h1>
<<<<<<< Updated upstream
=======
			<button
				onClick={() => {
					localStorage.setItem("accessToken", "");
					setToken(null);
				}}
			>
				Log out
			</button>
>>>>>>> Stashed changes
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
				<audio ref={audioRef} />
			</div>
			<PlayerCursor
				point={myCursorLoc}
				isEditingCursor
				cursorInputContent={cursorInputContent}
				setCursorInputContent={refreshChat}
				myCursorInputRef={myCursorInputRef}
				fading={cursorInputContentIsFading}
				fillColor="rgb(100, 250, 50)"
			></PlayerCursor>
		</div>
	);
}

export default VideoPage;
