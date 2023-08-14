import { useState } from "react";
import "./App.css";

function App() {
  const [displayTime, setDisplayTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [sessionTime, setSessionTime] = useState(25);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);

  const formatTime = (time) => {
    let minutes = Math.floor(time);
    let seconds = (time * 60) % 60;

    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  function changeTime(amount, type) {
    if (type === "break") {
      if (breakTime <= 0 && amount < 0) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else {
      if (sessionTime <= 0 && amount < 0) {
        return;
      }
      setSessionTime((prev) => prev + amount);
      if (!timerOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  }

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              onBreakVariable = true;
              setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
              onBreakVariable = false;
              setOnBreak(false);
              return sessionTime;
            }
            return prev - 1;
          });
        }
        nextDate = second;
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
  };
  const reset = () => {
    setDisplayTime(25);
    setBreakTime(5);
    setSessionTime(25);
  };
  return (
    <>
      <h1>25 + 5 Clock</h1>
      <Length
        title={"break length"}
        changeTime={changeTime}
        type={"break"}
        time={breakTime}
        formatTime={formatTime}
      />
      <Length
        title={"session length"}
        changeTime={changeTime}
        type={"session"}
        time={sessionTime}
        formatTime={formatTime}
      />
      <div className="timer-label">
        <div id="timer-label">
          <h3>{onBreak ? "Break" : "Session"}</h3>
          <span id="time-left">{formatTime(displayTime)}</span>
        </div>
      </div>
      <div className="timer-actions">
        <button id="start_stop" onClick={controlTime}>
          {timerOn ? "stop" : "play"}
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
    </>
  );
}
function Length({ title, changeTime, type, time, formatTime }) {
  return (
    <div className="lengths">
      <div className="break">
        <h3 id={type === "break" ? "break-label" : "session-label"}>{title}</h3>
        <div className={type === "break" ? "break-actions" : "session-actions"}>
          <button
            id={type === "break" ? "break-increment" : "session-increment"}
            onClick={() => changeTime(1, type)}
          >
            increment
          </button>
          <span id={type === "break" ? "break-length" : "session-length"}>
            {" "}
            {formatTime(time)}{" "}
          </span>
          <button
            id={type === "break" ? "break-decrement" : "session-decrement"}
            onClick={() => changeTime(-1, type)}
          >
            decrement
          </button>
        </div>
      </div>
    </div>
  );
}
export default App;
