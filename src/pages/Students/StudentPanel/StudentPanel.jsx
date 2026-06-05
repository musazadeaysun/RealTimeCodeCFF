import React, { useState, useRef, useEffect } from "react";
import "./StudentPanel.css";
import { MdOutlineLogout } from "react-icons/md";
import { VscRunAll } from "react-icons/vsc";
import { runCodeApi } from "../../../api/roomApi";
import { useNavigate } from "react-router-dom";
import { createStompClient } from "../../../socket/socket";

const StudentPanel = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const studentName = localStorage.getItem("studentName");
  const roomCode = localStorage.getItem("roomCode");
  const participantId = localStorage.getItem("participantId");

  const lines = code.split("\n");
  const lineNumbersRef = useRef(null);
  const clientRef = useRef(null);

  // STOMP
  useEffect(() => {
    if (!roomCode || !participantId) return;

    const client = createStompClient();
    clientRef.current = client;

    client.onConnect = () => {
      console.log("Student STOMP connected");

      // Müəllimin düzəlişlərini dinlə
      client.subscribe(
        `/topic/room/${roomCode}/participant/${participantId}/edit`,
        (message) => {
          const data = JSON.parse(message.body);
          if (data.code !== undefined) {
            setCode(data.code);
          }
        },
      );
    };

    client.onStompError = (frame) => {
      console.error("Student STOMP ERROR:", frame);
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [roomCode, participantId]);

  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);

    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: `/app/stream/${roomCode}/${participantId}`,
        body: newCode,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("studentName");
    localStorage.removeItem("roomCode");
    localStorage.removeItem("participantId");
    navigate("/");
  };

  const handleRunCode = async () => {
    if (!navigator.onLine) {
      setError("Internet yoxdur. Zəhmət olmasa bağlantını yoxla.");
      return;
    }
    try {
      setLoading(true);
      setOutput("");
      setError("");

      const data = await runCodeApi({
        participantId: Number(participantId),
        roomCode,
        code,
      });

      if (data.errorLog) {
        setError(data.errorLog);
      } else {
        setOutput(data.output);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTerminal = () => {
    setOutput("");
    setError("");
  };

  return (
    <div className="studentPanel">
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
          <button className="runButton" onClick={handleRunCode}>
            <VscRunAll className="iconRun" />
            Run
          </button>
          <MdOutlineLogout className="iconLogOut" onClick={handleLogout} />
        </div>
      </div>
      <div className="main">
        <div className="editorSide">
          <div className="editor">
            <span>EDITOR</span>
          </div>
          <div className="editorWrapper">
            <div className="lineNumbers" ref={lineNumbersRef}>
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            <textarea
              value={code}
              onChange={handleCodeChange}
              onScroll={handleScroll}
              spellCheck={false}
            />
          </div>
        </div>

        <div className="terminalSide">
          <div className="sectionHeader">
            <span>TERMINAL</span>
            <button className="clearButton" onClick={deleteTerminal}>
              Clear
            </button>
          </div>
          <div className="terminal">
            <h3>Output ({studentName}):</h3>
            {loading && <p>Running...</p>}
            {output && <pre style={{ color: "lightgreen" }}>{output}</pre>}
            {error && <pre style={{ color: "red" }}>{error}</pre>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPanel;
