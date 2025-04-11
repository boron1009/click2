import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import './App.css';
import Button from './component/button';
import React from "react";

function Home() {
  return (
    <div>
      <h1>手速測試(CPS)</h1>
      <p>本網頁可用來測試手速，並且有不同時長的選擇，請選擇下列一種時長，並開始進行測試</p>
    </div>
  );
}

function Count() {
  const [currentPage, setCurrentPage] = useState('Count');
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<div />} />
          <Route path="/Count" element={<Count />} />
        </Routes>
      </div>
    </React.Fragment>
  );
}

export default App;
