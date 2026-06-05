import { useState } from "react";
import "./JoinRoom.css";
import { Link, useNavigate } from "react-router-dom";
import { joinRoomApi } from "../../../api/roomApi";

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleJoinRoom = async () => {
    if (!roomCode.trim() || !studentName.trim()) {
      setError("Bütün xanaları doldurun");
      return;
    }

    if (studentName.trim().length < 3) {
      setError("Ad minimum 3 simvol olmalıdır");
      return;
    }
    if (!/^\d{6}$/.test(roomCode)) {
      setError("Otaq kodu 6 rəqəmli olmalıdır");
      return;
    }

    try {
      setError("");

      const data = await joinRoomApi(roomCode, studentName);

      const participant = data.data;

      localStorage.setItem("participantId", participant.id);
      localStorage.setItem("studentName", participant.nickname);
      localStorage.setItem("roomCode", participant.roomCode);

      navigate(`/room/${roomCode}`, {
        state: {
          studentName,
          participantId: participant.id,
        },
      });
    } catch (err) {
      setError(err.message || "Otağa qoşulmaq mümkün olmadı");
    }
  };

  return (
    <div className="home">
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src="/picture/mainVideo.mp4" type="video/mp4" />
      </video>

      <div className="content">
        <div className="textSection">
          <p className="title">
            #Düşün <br /> #Yaz <br /> #Yarat
          </p>

          <div className="section">
            <p className="desc">
              Müasir kodlaşdırma mühiti ilə real vaxt rejimində tələbələrinizi
              izləyin və ya dərslərə qoşulun.
            </p>
          </div>
        </div>
        <div className="cardsJoinRoom">
          <div className="card">
            <h2>Otağa Qoşul</h2>
            <p>Dərs otağına qoşulun və müəlliminizlə birlikdə kod yazın.</p>
            <form action="">
              {error && <p className="errorText">{error}</p>}
              <label htmlFor="roomCode">Otaq Kodu:</label> <br />
              <input
                type="text"
                id="roomCode"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
              />
              <br />
              <label htmlFor="studentName">Adınız:</label> <br />
              <input
                type="text"
                id="studentName"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
              <br />
            </form>
            <button className="buttonJoinRoom" onClick={handleJoinRoom}>
              Qoşul
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
