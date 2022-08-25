import { PerfectCursor } from "perfect-cursors";
import { useRef, useEffect, useState } from "react";

// Credit to Jacky Zhao: (https://github.com/jackyzha0/cursor-chat)

export const PlayerCursor = (props) => {
	const [pc, setPC] = useState();
	const [point, setPoint] = useState([0, 0]);

	const [tmpInterval, setTmpInterval] = useState();

	useEffect(
		() =>
			setPC((prev) =>
				prev === undefined ? new PerfectCursor(setPoint) : prev
			),
		[]
	);

	useEffect(() => {
		setTmpInterval((prev) => {
			if (prev) clearInterval(prev);
			return setInterval(() => {
				console.log("ok!" + prev);
				if (pc !== undefined)
					pc.addPoint([Math.random() * 500, Math.random() * 500]);
			}, 600);
		});
	}, [pc]);

	return (
		<div
			style={{
				position: "absolute",
				transform: `translate(${point[0]}px, ${point[1]}px`,
			}}
		>
			Hello!
		</div>
	);
};
