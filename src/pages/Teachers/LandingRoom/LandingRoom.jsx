import "./LandingRoom.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdDone } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa";
import { getRoomApi } from "../../../api/roomApi";
import { useEffect, useState } from "react";

const LandingRoom = () => {
  const [copied, setCopied] = useState(false);
const navigate = useNavigate();
  const handleCopy = async () => {
    await navigator.clipboard.writeText(room?.roomCode);
    setCopied(true);
  };

  const { roomCode } = useParams();
  const [room, setRoom] = useState(null);
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await getRoomApi(roomCode);
        setRoom(data?.data);
          setTimeout(() => {
        navigate(`/teacher/${roomCode}`);
      }, 4000);
      } catch (error) {
        console.error(error);
      }
    };

    if (roomCode) {
      fetchRoom();
    }
  }, [roomCode]);
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

        <div className="cardsRoomCode">
          <div className="card">
            <div className="complate">
              <h2>Otaq Yaradildi</h2>
              <MdDone className="iconDone" />
            </div>
            <p>Sizin Otaq Kodunuz:</p>
            <div className="RoomNumber">
              <h2>{room?.roomCode || "Yüklənir..."}</h2>
              {copied ? (
                <MdDone className="iconCopy" />
              ) : (
                <FaRegCopy className="iconCopy" onClick={handleCopy} />
              )}
            </div>
            <p>Otağa yönləndirilirsiniz...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingRoom;
