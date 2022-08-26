import Peer from "peerjs";
import { PerfectCursor } from "perfect-cursors";
import { useEffect, useState } from "react";
import "./Cursor.css";

// Credit to Jacky Zhao: (https://github.com/jackyzha0/cursor-chat) & Figma

export const OtherPlayerCursor = (props) => {
	const [pc, setPC] = useState();
	const [point, setPoint] = useState();

	useEffect(
		() =>
			setPC((prev) =>
				prev === undefined ? new PerfectCursor(setPoint) : prev
			),
		[]
	);

	return <PlayerCursor point={point}>Hi</PlayerCursor>;
};

export const PlayerCursor = (props) => {
	return (
		<div
			style={{
				background: "transparent",
				position: "fixed",
				display: "flex",
				flexDirection: "column",
				top: 0,
				left: 0,
				zIndex: -2,
				...((props.point && {
					transform: `translate(${props.point[0]}px, ${props.point[1]}px`,
				}) || { display: "none" }),
			}}
			className="playercursor"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="12 10 12 20"
				fill="none"
				fillRule="evenodd"
				width="20"
				height="30"
			>
				<g fill="rgba(0,0,0,.2)" transform="translate(1,1)">
					<path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
					<path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
				</g>
				<g fill={props.borderColor || "white"}>
					<path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
					<path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
				</g>
				<g fill={props.fillColor || "lightblue"}>
					<path d="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z" />
					<path d="m13 10.814v11.188l2.969-2.866.428-.139h4.768z" />
				</g>
			</svg>
			{props.isEditingCursor ? (
				props.children && (
					<div className={props.fading && "fading"}>
						<p>{props.children}</p>
					</div>
				)
			) : (
				<p>
					<input type="text" ref={props.myCursorInputRef} />
				</p>
			)}
		</div>
	);
};
