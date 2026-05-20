import "./TeacherDashboard.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRoomApi, getRoomStudents } from "../../../api/roomApi";
import { MdDone } from "react-icons/md";
import { FaRegCopy, FaUsers } from "react-icons/fa";
import { stompClient } from "../../../socket/socket";
import TeacherPanel from "./TeacherPanel";
const TeacherDashboard = () => {
  const { roomCode } = useParams();

  const [copied, setCopied] = useState(false);
  const [room, setRoom] = useState(null);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");



useEffect(() => {
  if (!roomCode) return;

  stompClient.onConnect = () => {
    console.log("STOMP connected");

    stompClient.subscribe(
      `/topic/room/${roomCode}/participants`,
      (message) => {
        const data = JSON.parse(message.body);

        setStudents((prev) => {
          const exists = prev.find(
            (s) => s.id === data.participantId
          );

          if (exists) {
            return prev.map((student) =>
              student.id === data.participantId
                ? { ...student, online: data.online }
                : student
            );
          }

          return [
            ...prev,
            {
              id: data.participantId,
              nickname: data.nickname,
              role: "STUDENT",
              online: data.online,
            },
          ];
        });
      }
    );
  };

  stompClient.activate();

  return () => {
    stompClient.deactivate();
  };
}, [roomCode]);
  // ROOM LOAD
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await getRoomApi(roomCode);
        setRoom(data?.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (roomCode) fetchRoom();
  }, [roomCode]);

  // STUDENTS LOAD
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getRoomStudents(roomCode);
        setStudents(data?.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    if (roomCode) fetchStudents();
  }, [roomCode]);

  // COPY
  const handleCopy = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  // FILTERS
  const studentList = students.filter((s) => s.role === "STUDENT");

  const activeStudents = studentList.filter((s) => s.online === true);

  const filteredStudents = studentList.filter((s) =>
    s.nickname.toLowerCase().includes(search.toLowerCase())
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
            <FaUsers className="usersIcon"/>
            <span>
                 {studentList.length} şagird  / {activeStudents.length} aktiv
            </span>
       
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
       {/* STUDENT LIST */}
<div className="studentList">
  {filteredStudents.length === 0 ? (
    <div className="emptyStudents">
      Bu otaqda  heç bir şagird yoxdur
    </div>
  ) : (
    filteredStudents.map((student) => (
      <div key={student.id} className="studentCard">

        <div className="avatar">
          {student.nickname.slice(0, 2).toUpperCase()}
        </div>

        <div>
          <p>{student.nickname}</p>
          <small>
            {student.online ? " Online" : " Offline"}
          </small>
        </div>

      </div>
    ))
  )}
</div>

      </div>

      {/* RIGHT PANEL */}
 <TeacherPanel activeStudents={activeStudents} />
    </div>
  );
};

export default TeacherDashboard;