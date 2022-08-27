import "./FriendTab.css";

function FriendTab(props) {}

function FriendGroup(props) {
	return (
		<div className="friend-group">
			<div>{props.groupName}</div>
		</div>
	);
}

export default FriendGroup;
