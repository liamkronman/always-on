import "./FriendTab.css";
import { Check, X } from "react-feather";

function FriendList(props) {}

function FriendGroup(props) {
	return (
		<div className="friend-group">
			<div count={props.children.length}>{props.groupName}</div>
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

function FriendReq(props) {
	return (
		<div className="req-friend">
			<div>{props.username}</div>
			<div style={{ minWidth: "52px" }}>
				<Check color="rgb(150, 255, 150)" size={20} className="request-icon" />
				<X color="rgb(255, 150, 150)" size={20} className="request-icon" />
			</div>
		</div>
	);
}

export { FriendGroup, Friend, FriendReq };
