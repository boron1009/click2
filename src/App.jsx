import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./App.css";

class App {
  // Static properties for global state
  static bpm = 0;
  static bars = 0;
  static score = 0;

  // Static methods to manage global state
  static setBpm(value) {
    App.bpm = parseInt(value, 10);
  }

  static setBars(value) {
    App.bars = parseInt(value, 10);
  }

  static resetScore() {
    App.score = 0;
  }

  static addToScore(value) {
    App.score += value;
  }

  // Home Component
  static Home = () => {
    const navigate = useNavigate();

    const handleStartTest = () => {
      const bpmInput = document.getElementById("bpm").value;
      const barsInput = document.getElementById("bars").value;

      App.setBpm(bpmInput);
      App.setBars(barsInput);

      console.log("BPM:", App.bpm);
      console.log("Bars:", App.bars);

      navigate("/TapTest");
    };

    return (
      <div>
        <h1 class="fade">敲擊穩定度測試</h1>
        <p class="fade">
          本網頁可用來測試手的敲擊穩定度，並且有不同速度與時長的選擇，請輸入一個BPM與小節數，並開始進行測試
        </p>
        <div>
          <label htmlFor="bpm">輸入 BPM: </label>
          <input type="number" id="bpm" name="bpm" placeholder="例如：120" />
        </div>
        <div>
          <label htmlFor="bars">輸入小節數: </label>
          <input type="number" id="bars" name="bars" placeholder="例如：4" />
        </div>
        <button onClick={handleStartTest}>開始測試</button>
      </div>
    );
  };

  // TapTest Component
  static TapTest = () => {
    const navigate = useNavigate();
    const [currentBeat, setCurrentBeat] = useState(-3);
    const [startTime, setStartTime] = useState(null);
    const [deviation, setDeviation] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [startMessage, setStartMessage] = useState("beats");
    let beatCount = -3;

    const bpm = App.bpm;
    const bars = App.bars;
    const millisecondsPerBeat = (60 / bpm) * 1000;

    const tickSound1 = new Audio("/src/assets/beats1.mp3");
    const tickSound2 = new Audio("/src/assets/beats2.mp3");

    useEffect(() => {
      let interval;
      if (isRunning) {
        interval = setInterval(() => {
          if (beatCount % 4 === 1 || beatCount === -3) {
            tickSound1.play();
            console.log("E");
          } else {
            tickSound2.play();
            console.log("F");
          }
          beatCount++;
          setCurrentBeat((prev) => prev + 1);
        }, millisecondsPerBeat);
      }
      return () => clearInterval(interval);
    }, [isRunning, millisecondsPerBeat]);

    useEffect(() => {
      if (currentBeat === 0) setStartMessage("beats(下一拍開始!)");
      else setStartMessage("beats");
    }, [currentBeat]);

    const handleStart = () => {
      setIsRunning(true);
      setCurrentBeat(-3);
      setStartTime(Date.now() + millisecondsPerBeat * 4);

      setTimeout(() => {
        setCurrentBeat(0);
      }, 4 * millisecondsPerBeat);
    };

    const handleKeyDown = (e) => {
      if (e.code === "Space" && isRunning && currentBeat >= 0) {
        const tapTime = Date.now();
        const expectedTime = startTime + currentBeat * millisecondsPerBeat;
        const offset = tapTime - expectedTime;

        setDeviation((prev) => [...prev, offset]);
        App.addToScore(offset);

        console.log(`偏差：${offset} 毫秒`);
      }
    };

    useEffect(() => {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [startTime, currentBeat, millisecondsPerBeat]);

    useEffect(() => {
      if (currentBeat >= bars * 4) {
        setIsRunning(false);
        alert("TIME'S UP!");
        navigate("/Result", { state: { deviations: deviation } });
      }
    }, [currentBeat, bars, deviation, navigate]);

    return (
      <div>
        <h1>敲擊穩定度測試</h1>
        <div>
          <label>BPM: {bpm}</label>
        </div>
        <div>
          <label>小節數: {bars}</label>
        </div>
        <button onClick={handleStart} className="CountButton">
          點擊以開始測試
        </button>
        <h2>
          目前拍子: {currentBeat}
          {startMessage}
        </h2>
        <h3>按下空白鍵偏差 (毫秒): {deviation.join(", ")}</h3>
      </div>
    );
  };

  // Result Component
  static Result = () => {
    const avgscore = App.score / (App.bars * 4);

    return (
      <div>
        <h1>YOUR Score IS...?</h1>
        <p>{avgscore}</p>
      </div>
    );
  };

  // Main App Component
  static Main = () => {
    const navigate = useNavigate();
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
      if (!hasRedirected) {
        navigate("/home");
        setHasRedirected(true);
      }
    }, [hasRedirected, navigate]);

    return (
      <React.Fragment>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<div />} />
            <Route path="/home" element={<App.Home />} />
            <Route path="/TapTest" element={<App.TapTest />} />
            <Route path="/result" element={<App.Result />} />
          </Routes>
        </div>
      </React.Fragment>
    );
  };
}

export default App.Main;