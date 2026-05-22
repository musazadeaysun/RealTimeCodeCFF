import React, { useState, useRef } from "react";
import "./StudentPanel.css";
import { MdOutlineLogout } from "react-icons/md";
import { VscRunAll } from "react-icons/vsc";

const StudentPanel = () => {
  const [code, setCode] = useState("");

  const studentName = localStorage.getItem("studentName");
  const roomCode = localStorage.getItem("roomCode");

  const lines = code.split("\n");

  // 🔥 REFS
  const lineNumbersRef = useRef(null);

  // 🔥 SCROLL SYNC
  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  return (
    <div className="studentPanel">

      {/* HEADER */}
      <div className="studentPanelHeader">
        <div className="panelHeaderLeft">
          <p>
            Room: <span>{roomCode}</span>
          </p>
          <p>
            Name: <span>{studentName}</span>
          </p>
        </div>

        <div className="panelHeaderRight">
          <button className="runButton">
            <VscRunAll className="iconRun" />
            Run
          </button>
          <MdOutlineLogout className="iconLogOut" />
        </div>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* EDITOR */}
        <div className="editorSide">

          <div className="editor">
            <span>EDITOR</span>
          </div>

          <div className="editorWrapper">

            {/* LINE NUMBERS */}
            <div className="lineNumbers" ref={lineNumbersRef}>
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* TEXTAREA */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={handleScroll}
            />

          </div>
        </div>

        {/* TERMINAL */}
        <div className="terminalSide">
          <div className="sectionHeader">
            <span>TERMINAL</span>
            <button className="clearButton">Clear</button>
          </div>

          <div className="terminal">
            <h3>Output ({studentName}):</h3>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentPanel;