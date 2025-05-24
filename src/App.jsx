import React, { useRef, useState, useEffect, use } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
// import ReactMarkdown from "react-markdown";
import "./App.css";
import Canvas from "./component/canvas";

const WIDTH = 800;
const HEIGHT = 100;

const playSounds1 = () => {
    const sound1 = new Audio("/src/assets/beats1.mp3");
    sound1.cloneNode(true).play();
};
const playSounds2 = () => {
    const sound2 = new Audio("/src/assets/beats2.mp3");
    sound2.cloneNode(true).play();
};

const drawLine = (canvasRef, line, debug = false) => {
    if (canvasRef.current) {
        canvasRef.current.drawLine(line.x, 0, line.x, HEIGHT, line.color, 4, debug);
    }
}

class App {
    static bpm = 0;
    static bars = 0;
    static score = 0;
    static offset = 0;
    static hits = [];
    static millisecondsPerBeat = 0;

    static setBpm(value) {
        App.bpm = parseInt(value, 10);
    }

    static setBars(value) {
        App.bars = parseInt(value, 10);
    }

    static setOffset(value) {
        App.offset = parseInt(value, 10);
    }

    static Home = () => {
        const navigate = useNavigate();

        const handleStartTest = () => {
            const bpmInput = document.getElementById("bpm").value;
            const barsInput = document.getElementById("bars").value;
            const OffsetInput = document.getElementById("offset").value;

            if (bpmInput > 1500 || barsInput > 100) {
                alert("數值太大，請重新輸入")
            } else if (bpmInput <= 0 || barsInput <= 0) {
                alert("數值不合法，請重新輸入")
            } else {
                App.setBpm(bpmInput);
                App.setBars(barsInput);
                App.setOffset(OffsetInput)
                App.millisecondsPerBeat = (60 / App.bpm) * 1000;
                this.score=0;
                navigate("/TapTest");
            }
        };

        return (
            <>
                <h1 className="fade">敲擊穩定度測試</h1>
                <p className="fade">
                    本網頁可用來測試手的敲擊穩定度，並且有不同速度與時長的選擇，請輸入一個BPM與小節數，並開始進行測試
                </p>
                <div>
                    <label htmlFor="bpm">輸入BPM &#40; &lt;1500 &#41; : </label>
                    <input type="number" id="bpm" name="bpm" placeholder="例如 : 120" defaultValue={120} />
                </div>
                <div>
                    <label htmlFor="bars">輸入小節數 &#40; &lt;100 &#41; : </label>
                    <input type="number" id="bars" name="bars" placeholder="例如 : 4" defaultValue={4} />
                </div>
                <div>
                    <label htmlFor="offset">輸入延遲 &#40; ms &#41; : </label>
                    <input type="number" id="offset" name="offset" placeholder="單位 : ms" defaultValue={0} />
                </div>
                <button onClick={handleStartTest}>開始測試</button>
            </>
        );
    };

    static TapTest = () => {
        const canvasRef = useRef();
        const navigate = useNavigate();
        const frameID = useRef(null);
        const lines = useRef([]);
        const isRunningRef = useRef(false);
        const [currentBeat, setCurrentBeat] = useState(-3);
        const [count, setCount] = useState(0);
        const [startTime, setStartTime] = useState(null);
        const [deviation, setDeviation] = useState([]);
        const [isRunning, setIsRunning] = useState(false);
        const [startMessage, setStartMessage] = useState("beats");
        const startTimeRef = useRef(null);
        let beatCount = -3;
        const scoreEachNote = 100 / (App.bars * 4);

        const bpm = App.bpm;
        const bars = App.bars;
        const millisecondsPerBeat = App.millisecondsPerBeat;
        const totalTime = millisecondsPerBeat * bars * 4;

        useEffect(() => {
            let interval;
            if (isRunning) {
                interval = setInterval(() => {
                    if (beatCount % 4 === 1 || beatCount === -3) {
                        playSounds1();
                    } else {
                        playSounds2();
                    }
                    beatCount++;
                    addLine({ color: 'red', x: WIDTH });
                    if (beatCount > 0) {
                        addHit({ color: 'red', x: (beatCount / (bars * 4)) * WIDTH});
                    }
                    setCurrentBeat((prev) => prev + 1);
                }, millisecondsPerBeat);
            }
            return () => clearInterval(interval);
        }, [isRunning, millisecondsPerBeat]);

        useEffect(() => {
            if (currentBeat === 0) setStartMessage("beats (下一拍開始!)");
            else setStartMessage("beats");
        }, [currentBeat]);

        let lastTimestamp = 0;

        const handleAnimation = (timestamp) => {
            if (!isRunningRef.current) return;
            if (timestamp - lastTimestamp >= 10) {
                lastTimestamp = timestamp;
                // console.log(`Animation Running, frameID = ${frameID.current}`);
                if (canvasRef.current) {
                    canvasRef.current.clear();
                }
                lines.current = lines.current.map((line) => ({
                    ...line,
                    x: line.x - 10
                }));
                lines.current = lines.current.filter((line) => line.x >= 0);
                lines.current.forEach((line) => {
                    drawLine(canvasRef, line);
                });
            }
            frameID.current = window.requestAnimationFrame(handleAnimation);
        };

        const handleStart = () => {
            isRunningRef.current = true;
            setIsRunning(isRunningRef.current);
            setCurrentBeat(-3);
            startTimeRef.current = Date.now() + millisecondsPerBeat * 4;
            setStartTime(startTimeRef.current);

            setTimeout(() => {
                setCurrentBeat(0);
                handleAnimation();
            }, 4 * millisecondsPerBeat);
        };

        const addLine = line => {
            lines.current = [...lines.current, line];
        };

        const addHit = hit => {
            this.hits = [...this.hits, hit];
        };

        const handleKeyDown = (key) => {
            if (key.code !== "Space") return;
            if (!isRunningRef.current) {
                handleStart();
            } else if (currentBeat > 0) {
                let tapTime = Date.now();
                tapTime += this.offset;
                const expectedTime = startTimeRef.current + currentBeat * millisecondsPerBeat;
                let err = tapTime - expectedTime;
                addLine({ color: 'green', x: WIDTH });
                addHit({ color: 'green', x : (tapTime - startTimeRef.current) / totalTime * WIDTH });
                setDeviation((prev) => [...prev, err]);
                setCount(count + 1);
                console.log(`偏差：${err} 毫秒`);
                if (Math.abs(err) < 80) {
                    this.score += scoreEachNote;
                } else if (Math.abs(err) < 300) {
                    this.score += scoreEachNote * 0.65;
                } else {
                    this.score -= scoreEachNote;
                }
            }
        };

        useEffect(() => {
            window.addEventListener("keydown", handleKeyDown);
            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }, [startTime, currentBeat, millisecondsPerBeat]);

        useEffect(() => {
            if (currentBeat >= bars * 4+1) {
                alert("TIME'S UP!");
                isRunningRef.current = false;
                setIsRunning(isRunningRef.current);
                cancelAnimationFrame(frameID);
                navigate("/Result", { state: { deviations: deviation } });
            }
        }, [currentBeat, bars, deviation, navigate]);

        return (
            <>
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
                <div>
                    <Canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
                </div>
            </>
        );
    };

    static Result = () => {
        const navigate = useNavigate();
        const canvasRef = useRef();

        useEffect(() => {
            App.hits.forEach((line) => {
                drawLine(canvasRef, line, true);
            });
        }, []);
        const StartAgain = () =>{
            this.score=0;
            navigate("/TapTest");
        }
        const NumberText = ({ value }) => {
          const getColor = (num) => {
            if (num > 70) return "green";
            if (num > 50) return "orange";
            return "red";
          };
          return <span style={{ color: getColor(value) }}>{value}</span>;

        }

    return (
            <>
                <div>
                    <h1>YOUR SCORE IS...?</h1>
                    <h1><NumberText value={App.score < 0 ? 0 : App.score} /></h1>
                    <button onClick={() => navigate("/Home")}>go home</button>
                    <button onClick={StartAgain}>test again</button>
                </div>
                <div>
                    <Canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
                </div>
            </>
        );
    };



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