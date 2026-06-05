import "./TeacherDashboard.css";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getRoomApi, getRoomStudents } from "../../../api/roomApi";
import { MdDone } from "react-icons/md";
import { FaRegCopy, FaUsers } from "react-icons/fa";
import { createStompClient } from "../../../socket/socket";
import TeacherPanel from "./TeacherPanel";

const TeacherDashboard = () => {
  const { roomCode } = useParams();
  const clientRef = useRef(null);

  const [copied, setCopied] = useState(false);
  const [room, setRoom] = useState(null);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const selectedStudent = students.find(
    (s) => Number(s.id) === Number(selectedStudentId),
  );

  // ROOM LOAD
  useEffect(() => {
    if (!roomCode) return;
    const fetchRoom = async () => {
      try {
        const data = await getRoomApi(roomCode);
        setRoom(data?.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoom();
  }, [roomCode]);

  // STOMP + STUDENTS
  useEffect(() => {
    if (!roomCode) return;
    //websocket bağlantısı yaradılır
    const client = createStompClient();
    clientRef.current = client;
    client.onConnect = async () => {
      console.log(" STOMP connected");
      // 1. REST-dən şagirdləri çək
      let studentList = [];
      try {
        const data = await getRoomStudents(roomCode);
        studentList = (data?.data || [])
          .filter((p) => p.role === "STUDENT")
          .map((p) => ({ ...p, id: Number(p.id) }));
        setStudents(studentList);
        console.log("students loaded:", studentList);
      } catch (err) {
        console.error("students fetch error:", err);
      }
    };
    client.activate();
    return () => {
      client.deactivate();
    };
  }, [roomCode]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  const allStudents = students.filter((s) => s.role === "STUDENT");
  const activeStudents = allStudents;
  const filteredStudents = allStudents.filter((s) =>
    s.nickname.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="dashboard">
      <div className="leftPanel">
        <div className="panelContent">
          <h2>Teacher Dashboard</h2>
          <p>({room?.language})</p>
        </div>
        <div className="codesDashboard">
          <div className="codeDashboard">
            <p>Room Code:</p>
            <h2>{roomCode}</h2>
          </div>
          {copied ? (
            <MdDone className="copyCode" />
          ) : (
            <FaRegCopy className="copyCode" onClick={handleCopy} />
          )}
        </div>
        <div className="activeBox">
          <FaUsers className="usersIcon" />
          <span>{allStudents.length} şagird</span>
        </div>
        <input
          type="text"
          placeholder="Şagird axtar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="searchInput"
        />

        <div className="studentList">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className={`studentCard ${
                Number(selectedStudentId) === Number(student.id)
                  ? "activeCard"
                  : ""
              }`}
              onClick={() => setSelectedStudentId(Number(student.id))}
            >
              <div className="avatar">
                {student.nickname.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p>{student.nickname}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TeacherPanel
        activeStudents={activeStudents}
        selectedStudent={selectedStudent}
        onBack={() => setSelectedStudentId(null)}
        roomCode={roomCode}
        client={clientRef}
      />
    </div>
  );
};

export default TeacherDashboard;
