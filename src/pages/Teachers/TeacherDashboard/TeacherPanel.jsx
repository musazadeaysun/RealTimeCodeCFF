import React, { useEffect, useState } from "react";
import "./TeacherPanel.css";
import "./TeacherDashboard.css";
import {
  FaArrowLeft,
  FaEdit,
  FaUserSlash,
  FaUsers,
  FaSave,
} from "react-icons/fa";

const TeacherPanel = ({
  activeStudents,
  selectedStudent,
  onBack,
  roomCode,
  client,
}) => {
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

    const codeSub = stompClient.subscribe(
      `/topic/room/${roomCode}/participant/${selectedStudent.id}`,
      (message) => {
        const data = JSON.parse(message.body);

        setStudentCode(data.code || "");

        if (!isEditing) {
          setEditCode(data.code || "");
        }
      },
    );
    // 2. Run nəticəsi
    const execSub = stompClient.subscribe(
      `/topic/room/${roomCode}/executions`,
      (message) => {
        try {
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
        } catch (err) {
          console.error("Invalid JSON", err);
        }
      },
    );

    // Watch cavabını dinlə
    const watchSub = stompClient.subscribe(
      `/user/queue/watch/${selectedStudent.id}`,
      (message) => {
        const data = JSON.parse(message.body);
        setStudentCode(data.code || "");
        setEditCode(data.code || "");
      },
    );

    // 3. Watch göndər → mövcud kodu al
    stompClient.publish({
      destination: `/app/watch/${roomCode}/${selectedStudent.id}`,
      body: "",
    });

    return () => {
      codeSub.unsubscribe();
      execSub.unsubscribe();
      watchSub.unsubscribe();
    };
  }, [selectedStudent, roomCode, client]);

  const handleSendEdit = () => {
    if (!client?.current) return;

    client.current.publish({
      destination: `/app/edit/${roomCode}/${selectedStudent.id}`,
      body: editCode,
    });

    setStudentCode(editCode);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditCode(studentCode);
    setIsEditing(false);
  };

  const currentCode = isEditing ? editCode : studentCode;

  const lines = currentCode
    ? currentCode.split("\n")
    : ["// Şagird hələ kod yazmayıb"];

  if (!selectedStudent) {
    return (
      <div className="rightPanel">
        <div className="welcomeHeader">
          <h2>Xoş gəlmisiniz, Müəllim</h2>
        </div>

        <div className="studentsGrid">
          {activeStudents.length === 0 ? (
            <div className="noStudents">
              <FaUserSlash className="noStudentsIcon" />
              <h3>Hələ heç bir şagird qoşulmayıb</h3>
              <p>Şagirdlərin otağa qoşulmasını gözləyin.</p>
            </div>
          ) : (
            <>
              <div className="studentsInfo">
                <FaUsers className="studentsIcon" />
                <h3>Hazırda otaqda {activeStudents.length} tələbə var. </h3>
                <p> Kodlarına baxmaq üçün tələbənin üzərinə klik edin.</p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rightPanel studentView">
      {/* Header */}
      <div className="studentViewHeader">
        <div className="studentViewLeft">
          <button className="backButton" onClick={onBack}>
            <FaArrowLeft />
          </button>
          <div className="gridAvatar">
            {selectedStudent?.nickname?.slice(0, 2)?.toUpperCase() || "??"}
          </div>
          <div>
            <h3>{selectedStudent?.nickname}</h3>
          </div>
        </div>
      </div>

      <div className="codeViewBox">
        <div className="codeViewHeader">
          <span>{selectedStudent?.nickname}'s code</span>

          <div className="codeActions">
            {!isEditing ? (
              <p
                className="editButton"
                onClick={() => {
                  setEditCode(studentCode);
                  setIsEditing(true);
                }}
              >
                <FaEdit /> Edit
              </p>
            ) : (
              <div className="editActions">
                <p className="saveButton" onClick={handleSendEdit}>
                  <FaSave /> Save
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="codeViewBody">
          <div className="codeLineNumbers">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {isEditing ? (
            <textarea
              className="codeEditArea"
              value={editCode}
              onChange={(e) => setEditCode(e.target.value)}
              spellCheck={false}
            />
          ) : (
            <p className="codeContent">
              {studentCode ||
                "// Şagird hələ kod yazmayıb və ya Məlumat yüklənir..."}
            </p>
          )}
        </div>
      </div>

      <div className="terminalViewBox">
        <div className="terminalViewHeader">
          <span>TERMİNAL — {selectedStudent?.nickname}</span>
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
          {studentError && <pre style={{ color: "red" }}>{studentError}</pre>}
        </div>
      </div>
    </div>
  );
};

export default TeacherPanel;
