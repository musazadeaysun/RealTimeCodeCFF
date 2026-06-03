import "./TeacherDashboard.css";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getRoomApi, getRoomStudents} from "../../../api/roomApi";
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

      // 2. Online status dəyişikliyi dinlə
      client.subscribe(`/topic/room/${roomCode}/participants`, (message) => {
        const data = JSON.parse(message.body);
        console.log(" participants event:", data);
        setStudents((prev) => {
          const exists = prev.find(
            (s) => Number(s.id) === Number(data.participantId),
          );
          if (exists) return prev;

          return [
            ...prev,
            {
              id: Number(data.participantId),
              nickname: data.nickname,
              role: "STUDENT",
            },
          ];
        });
      });

      // 3. Mövcud şagirdlər üçün watch et → online statusu al
      for (const student of studentList) {
        client.subscribe(`/user/queue/watch/${student.id}`, (message) => {
          const data = JSON.parse(message.body);
          console.log(" watch response:", data);
        });

        client.publish({
          destination: `/app/watch/${roomCode}/${student.id}`,
          body: "",
        });
      }
    };

    client.onStompError = (frame) => {
      console.error(" STOMP ERROR:", frame);
    };

    client.onDisconnect = () => {
      console.log(" STOMP disconnected");
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [roomCode]);

  // COPY
  const handleCopy = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // FILTERS
  const allStudents = students.filter((s) => s.role === "STUDENT");
  const activeStudents = allStudents;
  const filteredStudents = allStudents.filter((s) =>
    s.nickname.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="dashboard">
      {/* LEFT PANEL */}
      <div className="leftPanel">
        <div className="panelContent">
          <h2>Teacher Dashboard</h2>
          <p>({room?.language})</p>
        </div>

        {/* ROOM CODE */}
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

        {/* ACTIVE BOX */}
        <div className="activeBox">
          <FaUsers className="usersIcon" />
          <span>{allStudents.length} şagird</span>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Şagird axtar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="searchInput"
        />

        {/* STUDENT LIST */}
        <div className="studentList">
          {filteredStudents.length === 0 ? (
            <div className="emptyStudents">Bu otaqda heç bir şagird yoxdur</div>
          ) : (
            filteredStudents.map((student) => (
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
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
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
