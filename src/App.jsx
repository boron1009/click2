import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./App.css";
const playSounds1 = () => {
  const sound1 = new Audio("/src/assets/beats1.mp3");
  sound1.cloneNode(true).play();
};
const playSounds2 = () => {
  const sound2 = new Audio("/src/assets/beats2.mp3");
  sound2.cloneNode(true).play();
};
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

      if(bpmInput>1500||barsInput>100){
        alert("數值太大，請重新輸入")
      }
      else if(bpmInput<=0||barsInput<=0){
        alert("數值不合法，請重新輸入")
      }
      else navigate("/TapTest");
    };

    return (
      <div>
        <h1 class="fade">敲擊穩定度測試</h1>
        <p class="fade">
          本網頁可用來測試手的敲擊穩定度，並且有不同速度與時長的選擇，請輸入一個BPM與小節數，並開始進行測試
        </p>
        <div>
          <label htmlFor="bpm">輸入BPM &#40; &lt;1500 &#41; : </label>
          <input type="number" id="bpm" name="bpm" placeholder="例如：120" />
        </div>
        <div>
          <label htmlFor="bars">輸入小節數 &#40; &lt;100 &#41; : </label>
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
    const [count, setcount] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [deviation, setDeviation] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [startMessage, setStartMessage] = useState("beats");
    let beatCount = -3;

    const bpm = App.bpm;
    const bars = App.bars;
    const millisecondsPerBeat = (60 / bpm) * 1000;

    useEffect(() => {
      let interval;
      if (isRunning) {
        interval = setInterval(() => {
          if (beatCount % 4 === 1 || beatCount === -3) {
            playSounds1();
            console.log("E");
          } else {
            playSounds2();
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
      if(e.code === "Space"&&!isRunning){
        handleStart();
      }
      if (e.code === "Space" && isRunning && currentBeat > 0) {
        const tapTime = Date.now();
        const expectedTime = startTime + currentBeat * millisecondsPerBeat;
        const offset = tapTime - expectedTime;

        setDeviation((prev) => [...prev, offset]);
        App.addToScore(offset);
        setcount(count+1);
        console.log(`偏差：${offset-avgscore} 毫秒`);
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
          <label>按空白鍵開始</label>
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
    var avgscore = App.score+(App.bars*4-count)*200 / (App.bars * 4);

    return (
      <div>
        <h1>YOUR SCORE IS...?</h1>
        <p>{avgscore<0?-avgscore:avgscore}</p>
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