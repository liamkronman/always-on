import "./FriendTab.css";

function FriendList(props) {}

function FriendGroup(props) {
	return (
		<div className="friend-group">
			<div count={3}>{props.groupName}</div>
			{props.children}
		</div>
	);
}

function Friend(props) {
	return (
		<div className="online-friend">
			<div>{props.username}</div>
			{/* <input type="button" value="Join" /> */}
		</div>
	);
}

export { FriendGroup, Friend };
