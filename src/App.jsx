import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import './App.css';
import GeminiComponent from "./geminicomponent";
import React from "react";
import ReactMarkdown from 'react-markdown';
let secmode=0
var cps=0
function Home() {
  const navigate = useNavigate();

  function one(){
    secmode=1
    navigate("/count")
  }
  function three(){
    secmode=3
    navigate("/count")
  }
  function five(){
    secmode=5
    navigate("/count")
  }
  function ten(){
    secmode=10
    navigate("/count")
  }
  function fifteen(){
    secmode=15
    navigate("/count")
  }
  function thirty(){
    secmode=30
    navigate("/count")
  }
  function sixty(){
    secmode=60
    navigate("/count")
  }
  function one_hundred(){
    secmode=100
    navigate("/count")
  }
  function one_hundred_and_eighty(){
    secmode=180
    navigate("/count")
  }

  return (
    <div>
      <h1>手速測試(CPS)</h1>
      <p>本網頁可用來測試手速，並且有不同時長的選擇，請選擇下列一種時長，並開始進行測試</p>
      <div className="button">
        <button onClick={one}>1sec</button>
        <button onClick={three}>3sec</button>
        <button onClick={five}>5sec</button>
        <button onClick={ten}>10sec</button>
        <button onClick={fifteen}>15sec</button>
        <button onClick={thirty}>30sec</button>
        <button onClick={sixty}>60sec</button>
        <button onClick={one_hundred}>100sec</button>
        <button onClick={one_hundred_and_eighty}>180sec</button>
      </div>
    </div>
  );
}



function Count() {
  const [count, setCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [mode, setMode] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timerStarted) {
      console.log("計時開始...");
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= secmode) {
            console.log(count);
            clearInterval(interval);
            alert("TIME'S UP");
            setMode(1);
            cps = count / secmode;
            console.log(count);
            console.log(secmode);
            console.log(cps);
            setTimerStarted(false); // Stop timer
            return prev; // 停止計時
          }
          return prev + 0.01;
        });
      }, 10);
    }
    return () => {
      if (interval) {
        console.log("計時器清除");
        clearInterval(interval);
      }
    };
  }, [timerStarted, secmode, count]);

  useEffect(() => {
    if (mode === 1) {
      navigate("/result");
    }
  }, [mode, navigate]);

  useEffect(() => {
    console.log(`Count updated: ${count}`);
  }, [count]);

  function handleClick() {
    if (mode === 0) {
      setCount((prevCount) => {
        const newCount = prevCount + 1;
        console.log(newCount);
        return newCount;
      });
    }
    if (!timerStarted) {
      setTimerStarted(true);
    }
  }

  return (
    <div>
      <button className="CountButton" onClick={handleClick}>{count}</button>
      <p className="timer">計時：{seconds.toFixed(2)}/{secmode} 秒</p>
    </div>
  );
}



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
          <Route path="/count" element={<Count />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </React.Fragment>
  );
}

export default App;
