import "./MainPage.css";
import { TbDeviceImacCode } from "react-icons/tb";
import { Link } from "react-router-dom";
const MainPage = () => {
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

        <div className="cards">

          <div className="card">
            <TbDeviceImacCode className="icon" />
            <h2>Otaq Yarat</h2>
            <p>
              Yeni dərs otağı yaradın və tələbələrinizi real vaxtda kod yazarkən izləyin.
            </p>
         <Link to="/pages/Teachers/CreateRoom" className="cardLink">
            Başla →
          </Link>
          </div>

          <div className="card">
            <TbDeviceImacCode className="icon" />
            <h2>Otağa Qoşul</h2>
            <p>
              Dərs otağına qoşulun və müəlliminizlə birlikdə kod yazın.
            </p>
            <Link to="/pages/Students/JoinRoom" className="cardLink">
              Qoşul →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MainPage;