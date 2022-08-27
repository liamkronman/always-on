import { useRef, useEffect, useCallback, useState } from "react";
import { PlayerCursor } from "./Cursor";
import Peer from "peerjs";
import axios from "axios";
import { Search, Check, X, Users, Send, Inbox } from "react-feather";
import VideoContainer from "./VideoContainer";
import { FriendGroup, Friend, FriendReq } from "./FriendTab";

const TIME_FRESH = 5000;
const TIME_FADE = 5000;

function VideoPage(props) {
	const setToken = props.setToken;
	const token = props.token;
	const addFriendReqListener = props.addFriendReqListener;
	const addStatusListener = props.addStatusListener;
    const addConnectListener = props.addConnectListener;
	const removeFriendReqListener = props.removeFriendReqListener;
	const removeStatusListener = props.removeStatusListener;
    const removeConnectListener = props.removeConnectListener;
	const [peerId, setPeerId] = useState("");
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
	const [friendRequests, setFriendRequests] = useState([]);
	const [activeFriends, setActiveFriends] = useState([]);
	const [inactiveFriends, setInactiveFriends] = useState([]);
	const [searchUsername, setSearchUsername] = useState("");
	const [searchedUsers, setSearchedUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState();

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
		window.electronAPI.setMenu(true);
		window.electronAPI.setSize({ width: 1000, height: 750 });

		const peer = new Peer();

		peer.on("open", (id) => {
			setPeerId(id);
			axios
				.post(
					`${process.env.REACT_APP_BACKEND}/api/user/setPeerId`,
					{
						peerId: id,
					},
					{
						headers: {
							"x-access-token": token,
						},
					}
				)
				.then((resp) => {
					console.log("peer id successfully sent to server");
				})
				.catch((err) => {
					console.log(err.message);
				});
		});

		peer.on("connection", (conn) =>
			conn.on("data", (data) => window.electronAPI.setCursorInfo(data))
		);

		const calls = [];
		peer.on("call", async (call) => {
			call.answer(streamRef.current.stream);

			call.on("stream", (viewerStream) => {
				audioRef.current.srcObject = viewerStream;
				audioRef.current.autoplay = true;
			});

			calls.push(call);
		});

		peerInstance.current = peer;

		return () => {
			window.electronAPI.setMenu(false);
			console.log("Disconnecting...");
			// for some reason peer.destroy only closes data connections, not calls
			peer.destroy();
			calls.forEach((call) => call.close());
		};
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
		if (cursorConn && remoteVideoRef.current) {
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
	const handleKeyPress = useCallback(
		(event) => {
			if (event.key === "Enter") {
				if (
					document.activeElement === myCursorInputRef.current &&
					cursorInputContent === ""
				) {
					// toggle
					myCursorInputRef.current.blur();
					event.preventDefault();
				} else if (
					document.activeElement === document.body ||
					document.activeElement === myCursorInputRef.current
				) {
					setCursorInputContent("");
					myCursorInputRef.current.focus();
					event.preventDefault();
				}
			}
		},
		[cursorInputContent]
	);

	useEffect(() => {
		// attach the event listener
		document.addEventListener("keydown", handleKeyPress);

		// remove the event listener
		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [cursorInputContent, handleKeyPress]);

	useEffect(() => {
        const connectListener = () => {
            setActiveFriends([]);
            setInactiveFriends([]);
            setFriendRequests([]);
        };

		const friendReqListener = (username) =>
			setFriendRequests((friendReqs) => [...friendReqs, username]);
		addFriendReqListener(friendReqListener);
        addConnectListener(connectListener);

		const statusListener = ({ type, username }) => {
			console.log("I have listened to an event!");
			if (type === "on") {
				setActiveFriends((friends) => [...friends, username]);
				setInactiveFriends((friends) =>
					friends.filter((ele) => ele !== username)
				);
			} else if (type === "off") {
				setInactiveFriends((friends) => [...friends, username]);
				setActiveFriends((friends) =>
					friends.filter((ele) => ele !== username)
				);
			}
		};

		addStatusListener(statusListener);

		return () => {
			removeFriendReqListener(friendReqListener);
			removeStatusListener(statusListener);
            removeConnectListener(connectListener);
		};
	}, []);

	function searchForUser() {
		axios
			.post(
				`${process.env.REACT_APP_BACKEND}/api/user/searchUser`,
				{
					searchUsername: searchUsername,
				},
				{
					headers: {
						"x-access-token": token,
					},
				}
			)
			.then((resp) => {
				setSearchedUsers(resp.data.users);
			});
	}

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

	function handleSearchPress(index) {
		axios
			.post(
				`${process.env.REACT_APP_BACKEND}/api/user/requestFriend`,
				{
					friendUsername: searchedUsers[index].username,
				},
				{
					headers: {
						"x-access-token": token,
					},
				}
			)
			.then(() => {
				setSearchedUsers((users) => {
					let newUsers = [...users];
					newUsers[index]["relationStatus"] = "Requested";
					return newUsers;
				});
			});
	}

	/*
	useEffect(() => {
		if (searchUsername) {
			searchForUser();
		} else {
			setSearchedUsers([]);
		}
	}, [searchUsername]);
	*/

	function handleRequest(username, accept) {
		axios
			.post(
				`${process.env.REACT_APP_BACKEND}/api/user/handleRequest`,
				{
					potentialFriendUsername: username,
					accept: accept,
				},
				{
					headers: {
						"x-access-token": token,
					},
				}
			)
			.then((resp) => {
				setFriendRequests((friends) =>
					friends.filter((ele) => ele !== username)
				);
				setSearchedUsers((friends) => {
					return friends.map((val) =>
						val.username === username
							? { ...val, relationStatus: "Friends" }
							: val
					);
				});
			});
	}

	const selectStreamer = (user) => {
		console.log("Selected", user);
		setSelectedUser((prev) => {
			if (user !== prev) {
				axios
					.post(
						`${process.env.REACT_APP_BACKEND}/api/user/getFriendPeerId`,
						{
							friendUsername: user,
						},
						{
							headers: {
								"x-access-token": token,
							},
						}
					)
					.then((resp) => {
						console.log(resp.data.friendPeerId);
						call(resp.data.friendPeerId);
					});
			}
			return user;
		});
	};

	return (
		<div className="main-container">
			<div className="left-main-tray">
				<div className="main-top-left-container">
					<button
						onClick={() => {
							localStorage.setItem("accessToken", "");
							setToken(null);
						}}
						className="main-logout-btn"
					>
						Log out
					</button>
					<div className="main-alwayson-title">AlwaysOn</div>
				</div>
				<div className="friend-list-container">
					<div className="main-search-container">
						<input
							value={searchUsername}
							onChange={(e) => setSearchUsername(e.target.value)}
							onKeyPress={(e) => {
								if (e.key === "Enter") searchForUser();
							}}
							placeholder="Find a friend..."
						/>
						{/* Search should call a backend function when clicked that finds queried user */}
						<Search
							color="white"
							size={20}
							className="main-search-btn"
							onClick={() => {
								searchForUser();
							}}
						/>
					</div>
					{searchedUsers.length > 0 && (
						<div>
							{searchedUsers.map((val, index) => {
								return (
									<div className="searched-user-container" key={index}>
										<div className="searched-username">{val.username}</div>
										{val.relationStatus === "None" ? (
											<button
												className="searched-btn request-searched-btn"
												onClick={() => handleSearchPress(index)}
											>
												Request
											</button>
										) : val.relationStatus === "Requested" ? (
											<Inbox
												color="white"
												size={20}
												className="free-request-icon"
											/>
										) : val.relationStatus === "Being requested" ? (
											<div className="request-icon-container">
												<Check
													color="rgb(150, 255, 150)"
													size={20}
													className="request-icon"
													onClick={() => handleRequest(val.username, true)}
												/>
												<X
													color="rgb(255, 150, 150)"
													size={20}
													className="request-icon"
													onClick={() => handleRequest(val.username, false)}
												/>
											</div>
										) : (
											<Users size={20} color="white" />
										)}
									</div>
								);
							})}
						</div>
					)}
					{activeFriends.length > 0 && (
						<FriendGroup groupName="online">
							{activeFriends.map((val, index) => (
								<Friend
									username={val}
									key={index}
									selectedUser={selectedUser}
									selectStreamer={() => selectStreamer(val)}
								/>
							))}
						</FriendGroup>
					)}
					{inactiveFriends.length > 0 && (
						<FriendGroup groupName="inactive">
							{inactiveFriends.map((val, index) => (
								<Friend username={val} key={index} />
							))}
						</FriendGroup>
					)}
					{friendRequests.length > 0 && (
						<FriendGroup groupName="pending">
							{friendRequests.map((val, index) => {
								console.log(val);
								return (
									<FriendReq
										username={val}
										key={index}
										handleRequest={handleRequest}
									/>
								);
							})}
						</FriendGroup>
					)}

					{/* <input
						type="text"
						value={remotePeerIdValue}
						onChange={(e) => {
							setRemotePeerIdValue(e.target.value);
						}}
					/>
					<button onClick={() => call(remotePeerIdValue)}>Connect</button> */}
				</div>
			</div>
			<VideoContainer
				setMyCursorLoc={setMyCursorLoc}
				remoteVideoRef={remoteVideoRef}
				audioRef={audioRef}
				username={selectedUser}
				onLeave={() => setSelectedUser(undefined)}
			/>
			<PlayerCursor
				point={myCursorLoc}
				isEditingCursor
				cursorInputContent={cursorInputContent}
				setCursorInputContent={refreshChat}
				myCursorInputRef={myCursorInputRef}
				fading={cursorInputContentIsFading}
				fillColor="rgb(100, 250, 50)"
			/>
		</div>
	);
}

export default VideoPage;
