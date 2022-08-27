// import logo from './logo.svg';
import "./App.css";
import { useEffect, useRef, useState } from "react";
import { PlayerCursor } from "./Cursor";

//const TIME_FRESH = 5000;
//const TIME_FADE = 5000;

function Overlay() {
	/*
	const [myCursorLoc, setMyCursorLoc] = useState([0, 0]);
	const myCursorInputRef = useRef();
	const [cursorInputContent, setCursorInputContent] = useState("");
	const [cursorInputLastRefresh, setCursorInputLastRefresh] = useState(-1);
	const [cursorInputContentIsFading, setCursorInputContentIsFading] =
		useState(false);
		*/

	const [otherCursors, setOtherCursors] = useState({});
	const divRef = useRef();

	/*
	useEffect(() => {
		const id = setInterval(() => {
			const timenow = Date.now();

			if (timenow > cursorInputLastRefresh + TIME_FRESH + TIME_FADE) {
				setCursorInputContentIsFading((prev) => {
					if (prev) {
						setCursorInputContent("");
						myCursorInputRef.current.blur();
					}
					return false;
				});
			} else if (timenow > cursorInputLastRefresh + TIME_FRESH) {
				setCursorInputContentIsFading(true);
			}
		}, 501);
		return () => clearInterval(id);
	}, [cursorInputContentIsFading, cursorInputLastRefresh]);

	const refreshChat = (text) => {
		setCursorInputContent(text);
		const timenow = Date.now();
		setCursorInputContentIsFading(false);
		setCursorInputLastRefresh(timenow);
	};
	*/

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
			/*onMouseMove={(event) => setMyCursorLoc([event.clientX, event.clientY])}*/
			style={{ height: "100vh", width: "100vw" }}
			ref={divRef}
		>
			{Object.entries(otherCursors).map((val) => {
				const point = val[1].point;
				console.log(val);
				return (
					<PlayerCursor
						key={val[0]}
						point={point && [point[0] * 100 + "%", point[1] * 100 + "%"]}
					>
						{val[1].content}
					</PlayerCursor>
				);
			})}
			{/*
			<PlayerCursor
				point={myCursorLoc}
				isEditingCursor
				cursorInputContent={cursorInputContent}
				setCursorInputContent={refreshChat}
				myCursorInputRef={myCursorInputRef}
				fading={cursorInputContentIsFading}
				fillColor="rgb(100, 250, 50)"
				style={
					Object.keys(otherCursors).length === 0 && {
						display: "none",
					}
				}
			></PlayerCursor>
			*/}
		</div>
	);
}

export default Overlay;
