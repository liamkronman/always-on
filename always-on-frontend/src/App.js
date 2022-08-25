// import logo from './logo.svg';
import './App.css';
import { Peer } from 'peerjs';
import { useRef, useEffect } from 'react';

function App() {
  const peer = new Peer('liam-always-on');

  const conn = peer.connect("siyong-always-on");
  conn.on("open", () => {
    conn.send("hi!");
  });

  peer.on("connection", (conn) => {
    conn.on("data", (data) => {
      console.log(data);
    })
    conn.on("open", () => {
      conn.send("hello!");
    })
  })

  const videoRef = useRef();

  const getStream = async (screenId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: screenId,
          }
        }
      })

      handleStream(stream)
    } catch(e) {
      console.log(e)
    }
  }

  const handleStream = (stream) => {
    let { width, height } = stream.getVideoTracks()[0].getSettings();

    // window.electronAPI.setSize({ width, height });

    videoRef.current.srcObject = stream;
    videoRef.current.onloadedmetadata = (e) => videoRef.current.play()
  }

  window.electronAPI.getScreenId((event, screenId) => {
    console.log('Renderer...', screenId);
    getStream(screenId);
  });

  return (
    <div className="App">
      <>
        <span>800 x 600</span>
        <video ref={videoRef} className="video"></video>
      </>
    </div>
  );
}

export default App;
