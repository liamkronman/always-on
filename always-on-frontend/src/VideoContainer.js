import "./VideoContainer.css";

function VideoContainer(props) {
	const setMyCursorLoc = props.setMyCursorLoc;
	const remoteVideoRef = props.remoteVideoRef;
	const audioRef = props.audioRef;
	const username = props.username;
	return (
		<div className="video-container">
			<input className="video-container-leave" type="button" value="Leave" />
			<div>
				<h1>
					{(username && `${username}'s stream`) || "Join a friend's stream!"}
				</h1>
				{
					<video
						onMouseMove={(event) =>
							setMyCursorLoc([event.clientX, event.clientY])
						}
						onMouseLeave={(event) => setMyCursorLoc(undefined)}
						ref={remoteVideoRef}
					/>
				}
			</div>
			<audio ref={audioRef} />
		</div>
	);
}

export default VideoContainer;