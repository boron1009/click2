import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import './App.css';
import GeminiComponent from "./geminicomponent";
import React from "react";
import ReactMarkdown from 'react-markdown';
var bpmm=0, barss=0;
function Home() {
  const navigate = useNavigate();
  function gocount(){
    const bpmInput=document.getElementById("bpm").value;
    const barsInput=document.getElementById("bars").value;
    bpmm=parseInt(bpmInput,10);
    barss=parseInt(barsInput,10);
    console.log(bpmm);
    console.log(barss);
    navigate("/TapTest")
  }
  return (
    <div>
      <h1>敲擊穩定度測試</h1>
      <p>本網頁可用來測試手的敲擊穩定度，並且有不同速度與時長的選擇，請輸入一個BPM與小節數，並開始進行測試</p>
      
      {/* BPM輸入框 */}
      <div>
        <label htmlFor="bpm">輸入 BPM: </label>
        <input type="number" id="bpm" name="bpm" placeholder="例如：120" />
      </div>
      
      {/* 小節數輸入框 */}
      <div>
        <label htmlFor="bars">輸入小節數: </label>
        <input type="number" id="bars" name="bars" placeholder="例如：4" />
      </div>
      
      {/* 開始測試按鈕 */}
      <button onClick={() => gocount()}>開始測試</button>
    </div>
  );
}







const TapTest = ({ navigate }) => {
  const [bpm, setBpm] = useState(120); // 每分鐘拍子數
  const [bars, setBars] = useState(4); // 小節數
  const [currentBeat, setCurrentBeat] = useState(-3); // 預備拍的初始值
  const [startTime, setStartTime] = useState(null);
  const [deviation, setDeviation] = useState([]); // 偏差記錄
  const [isRunning, setIsRunning] = useState(false);
  const tickSound1 = new Audio("/e/src/assets/beats1.mp3");
  const tickSound2 = new Audio("/e/src/assets/beats2.mp3");
  const millisecondsPerBeat = (60 / bpm) * 1000; // 每拍的毫秒數
  const [start, setStart] = useState("beats");
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        if(currentBeat%4==1||currentBeat===-3)tickSound1.play();
        else tickSound2.play();
        setCurrentBeat((prev) => prev + 1); // 只由 setInterval 更新 currentBeat
      }, millisecondsPerBeat);
    }
    return () => clearInterval(interval); // 清理 interval 防止記憶體洩漏
  }, [isRunning, millisecondsPerBeat]);
  useEffect(() => {
    if(currentBeat===0)setStart("beats(下一拍開始!)");
    else setStart("beats");
    console.log(currentBeat);
  }, [currentBeat]);
  
  const handleStart = () => {
    setIsRunning(true);
    setCurrentBeat(-3); // 從預備拍開始
    setStartTime(Date.now());

    // 預備拍邏輯
    setTimeout(() => {
      setCurrentBeat(0); // 正式開始測試的第一拍
    }, 4 * millisecondsPerBeat);
  };

  const handleKeyDown = (e) => {
    if (e.code === "Space") {
      const tapTime = Date.now(); // 記錄按鍵時間
      const expectedTime = startTime + currentBeat * millisecondsPerBeat; // 計算理想時間
      const offset = tapTime - expectedTime; // 偏差
      setDeviation((prev) => [...prev, offset]); // 保存偏差
      console.log(`偏差：${offset} 毫秒`);
      // 此處不重置或更改 `currentBeat`
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown); // 清理事件監聽器
  }, [startTime, currentBeat, millisecondsPerBeat]);

  useEffect(() => {
    // 測試完成後跳轉至 /Result
    if (currentBeat >= bars * 4) {
      setIsRunning(false);
      alert("TIME'S UP!")
      navigate("/Result", { state: { deviations: deviation } }); // 傳遞偏差資料至結果分頁
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
      <button onClick={handleStart} className="CountButton">點擊以開始測試</button>
      <h2>目前拍子: {currentBeat}{start}</h2>
      <h3>按下空白鍵偏差 (毫秒): {deviation.join(", ")}</h3>
    </div>
  );
};





function Result() {
  const [value, setValue] = useState(0);
  const targetValue = cps; // 目標數字
  const initialIncrement = cps/5; // 初始增量
  const [increment, setIncrement] = useState(initialIncrement);
  const decayRate = 0.8; // 衰減率

  useEffect(() => {
    let interval;
    if (value < targetValue) {
      interval = setInterval(() => {
        setValue((prevValue) => {
          const newValue = prevValue + increment;
          if (newValue >= targetValue) {
            clearInterval(interval);
            return targetValue; // 停止計時
          }
          return newValue;
        });
        setIncrement((prevIncrement) => prevIncrement * decayRate); // 衰減增量
      }, 100); // 更新頻率，可以根據需要調整
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [value, increment]);
  

  return (
    <div>
      <h1>YOUR CPS IS...?</h1>
      <p>Value: {value.toFixed(2)}</p>
      <GeminiComponent />
    </div>
  );
}




function App() {
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
          <Route path="/home" element={<Home />} />
          <Route path="/TapTest" element={<TapTest />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </React.Fragment>
  );
}

export default App;
