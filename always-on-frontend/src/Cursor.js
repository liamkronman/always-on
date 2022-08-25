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
			console.log("created, prev:", prev);
			if (prev) return prev;
			return setInterval(() => {
				console.log("Running now");
				if (pc !== undefined)
					pc.addPoint([Math.random() * 500, Math.random() * 500]);
			}, 600);
		});
	}, [pc]);

	return (
		<div
			style={{
				transform: `translate(${point[0]}px, ${point[1]}px`,
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 35 35"
				fill="none"
				fillRule="evenodd"
				width="80"
				height="80"
			>
				<g fill="rgba(0,0,0,.2)" transform="translate(1,1)">
					<path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
					<path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
				</g>
				<g fill="white">
					<path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
					<path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
				</g>
				<g fill="rgba(200, 200, 100, 0.8)">
					<path d="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z" />
					<path d="m13 10.814v11.188l2.969-2.866.428-.139h4.768z" />
				</g>
			</svg>
			<p>hi</p>
		</div>
	);
};
