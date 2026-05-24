import React, { useEffect, useState } from "react";
import "./TeacherPanel.css";
import { FaArrowLeft, FaEdit, FaCheck, FaTimes } from "react-icons/fa";

const TeacherPanel = ({ activeStudents, selectedStudent, onBack, roomCode, client }) => {
  const [studentCode, setStudentCode] = useState("");
  const [studentOutput, setStudentOutput] = useState("");
  const [studentError, setStudentError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editCode, setEditCode] = useState("");

  useEffect(() => {
    if (!selectedStudent || !roomCode || !client?.current) return;

    const stompClient = client.current;

    setStudentCode("");
    setStudentOutput("");
    setStudentError("");
    setIsEditing(false);

    // 1. Canlı kod stream
    const codeSub = stompClient.subscribe(
      `/topic/room/${roomCode}/participant/${selectedStudent.id}`,
      (message) => {
        const code =message.body || "";
        if (!isEditing) {
          setEditCode(message.body || "");
        }
      }
    );

    // 2. Run nəticəsi
    const execSub = stompClient.subscribe(
      `/topic/room/${roomCode}/executions`,
      (message) => {
        const data = JSON.parse(message.body);
        if (Number(data.participantId) === Number(selectedStudent.id)) {
          if (data.success) {
            setStudentOutput(data.result || "");
            setStudentError("");
          } else {
            setStudentError(data.result || "Xəta baş verdi");
            setStudentOutput("");
          }
        }
      }
    );

    // 3. Watch göndər → mövcud kodu al
    stompClient.publish({
      destination: `/app/watch/${roomCode}/${selectedStudent.id}`,
      body: "",
    });

    // Watch cavabını dinlə
    const watchSub = stompClient.subscribe(
      `/user/queue/watch/${selectedStudent.id}`,
      (message) => {
        const data = JSON.parse(message.body);
        setStudentCode(data.code || "");
        setEditCode(data.code || "");
      }
    );

    return () => {
      codeSub.unsubscribe();
      execSub.unsubscribe();
      watchSub.unsubscribe();
    };
  }, [selectedStudent, roomCode, client]);

  // Edit göndər
  const handleSendEdit = () => {
    if (!client?.current) return;

    client.current.publish({
      destination: `/app/edit/${roomCode}/${selectedStudent.id}`,
      body: editCode,
    });

    setStudentCode(editCode);
    setIsEditing(false);
  };

  // Edit ləğv et
  const handleCancelEdit = () => {
    setEditCode(studentCode);
    setIsEditing(false);
  };

  const lines = (isEditing ? editCode : studentCode)
    ? (isEditing ? editCode : studentCode).split("\n")
    : ["// Şagird hələ kod yazmayıb"];

  // ── NO STUDENT SELECTED ──────────────────────────
  if (!selectedStudent) {
    return (
      <div className="rightPanel">
        <div className="welcomeHeader">
          <div>
            <h2>Xoş gəlmisiniz, Müəllim 👋</h2>
            <p>Hazırda otaqda olan aktiv şagirdlərin siyahısı</p>
          </div>
          <span className="onlineBadge">● {activeStudents.length} Online</span>
        </div>

        <div className="studentsGrid">
          {activeStudents.length === 0 ? (
            <p className="noStudents">Hələ heç bir şagird qoşulmayıb...</p>
          ) : (
            activeStudents.map((student) => (
              <div key={student.id} className="studentGridCard">
                <div className="gridAvatar">
                  {student.nickname.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p>{student.nickname}</p>
                  <small>⊙ İndi aktivdir</small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // ── STUDENT SELECTED ─────────────────────────────
  return (
    <div className="rightPanel studentView">

      {/* Header */}
      <div className="studentViewHeader">
        <div className="studentViewLeft">
          <button className="backButton" onClick={onBack}>
            <FaArrowLeft />
          </button>
          <div className="gridAvatar">
            {selectedStudent.nickname.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3>{selectedStudent.nickname}</h3>
            <small className={selectedStudent.online ? "online" : "offline"}>
              ● {selectedStudent.online ? "Online" : "Offline"}
            </small>
          </div>
        </div>
        <span className="langBadge">PYTHON</span>
      </div>

      {/* Code Viewer */}
      <div className="codeViewBox">
        <div className="codeViewHeader">
          <span>{selectedStudent.nickname}'s code</span>

          {/* Edit / Save / Cancel buttons */}
          {!isEditing ? (
            <button
              className="editButton"
              onClick={() => {
                setEditCode(studentCode);
                setIsEditing(true);
              }}
            >
              <FaEdit /> Edit
            </button>
          ) : (
            <div className="editActions">
              <button className="saveButton" onClick={handleSendEdit}>
                <FaCheck /> Göndər
              </button>
              <button className="cancelButton" onClick={handleCancelEdit}>
                <FaTimes /> Ləğv et
              </button>
            </div>
          )}
        </div>

        <div className="codeViewBody">
          {/* Line numbers */}
          <div className="codeLineNumbers">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Read-only ya da Edit mode */}
          {isEditing ? (
            <textarea
              className="codeEditArea"
              value={editCode}
              onChange={(e) => setEditCode(e.target.value)}
              spellCheck={false}
            />
          ) : (
            <pre className="codeContent">
              {studentCode || "// Şagird hələ kod yazmayıb və ya Məlumat yüklənir..."}
            </pre>
          )}
        </div>
      </div>

      {/* Terminal */}
      <div className="terminalViewBox">
        <div className="terminalViewHeader">
          <span>TERMİNAL — {selectedStudent.nickname.toUpperCase()}</span>
        </div>
        <div className="terminalViewBody">
          {!studentOutput && !studentError && (
            <p className="terminalEmpty">
              Hələ nəticə yoxdur. Şagirdin kodu işlətməsini gözləyin...
            </p>
          )}
          {studentOutput && (
            <pre style={{ color: "lightgreen" }}>{studentOutput}</pre>
          )}
          {studentError && (
            <pre style={{ color: "red" }}>{studentError}</pre>
          )}
        </div>
      </div>

    </div>
  );
};

export default TeacherPanel;