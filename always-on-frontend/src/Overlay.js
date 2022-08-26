// import logo from './logo.svg';
import "./App.css";
import { useEffect, useRef, useState } from "react";
import { PlayerCursor } from "./Cursor";

function Overlay() {
	const [myCursorLoc, setMyCursorLoc] = useState([0, 0]);
	const [otherCursors, setOtherCursors] = useState({});
	const divRef = useRef();

	useEffect(() => {
		window.electronAPI.onSetCursorInfo((event, data) =>
			setOtherCursors((prev) => ({
				...prev,
				[data.user]: { ...prev[data.user], ...data.data },
			}))
		);
	}, []);

	return (
		<div
			id="Overlay"
			onMouseMove={(event) => setMyCursorLoc([event.clientX, event.clientY])}
			style={{ height: "100vh", width: "100vw" }}
			ref={divRef}
		>
			{Object.entries(otherCursors).map((val, index) => {
				const bbox = divRef.getBoundingClientRect();
				return (
					<PlayerCursor
						point={[
							val[1].point[0] * bbox.width,
							val[1].point[1] * bbox.height,
						]}
					>
						test
					</PlayerCursor>
				);
			})}
		</div>
	);
}

export default Overlay;
