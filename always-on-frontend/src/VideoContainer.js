import "./VideoContainer.css";

function VideoContainer(props) {
	const setMyCursorLoc = props.setMyCursorLoc;
	const remoteVideoRef = props.remoteVideoRef;
	const audioRef = props.audioRef;
	const username = props.username;
	return (
		<div className="video-container">
			{username && (
				<input
					className="video-container-leave"
					type="button"
					value="Leave"
					onClick={props.onLeave}
				/>
			)}
			<div>
				<h1>
					{(username && `${username}'s stream`) || "Join a friend's stream!"}
				</h1>
				<div>
					<video
						onMouseMove={(event) => {
							setMyCursorLoc([event.clientX, event.clientY]);
							console.log("Setting cursor locatin");
						}}
						onMouseLeave={(event) => setMyCursorLoc(undefined)}
						ref={remoteVideoRef}
						style={
							(username === undefined && {
								position: "absolute",
								opacity: 0,
								maxHeight: "1px",
							}) ||
							{}
						}
					/>
				</div>
			</div>
			<audio ref={audioRef} />
		</div>
	);
}

export default VideoContainer;
