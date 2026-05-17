import "./JoinRoom.css";
import { TbDeviceImacCode } from "react-icons/tb";
import { Link } from "react-router-dom";
const JoinRoom = () => {
  return (
    <div className="home">
      {/* VIDEO */}
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src="/picture/mainVideo.mp4" type="video/mp4" />
      </video>

      {/* CONTENT */}
      <div className="content">

        {/* TEXT */}
        <div className="text-section">
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

        {/* CARDS */}
        <div className="cards">

          <div className="card">
            <TbDeviceImacCode className="icon" />
            <h2>Otaq Yarat</h2>
            <p>
              Yeni dərs otağı yaradın və tələbələrinizi real vaxtda kod yazarkən izləyin.
            </p>
         <Link to="/pages/Teachers/CreateRoom">Başla →</Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default JoinRoom;