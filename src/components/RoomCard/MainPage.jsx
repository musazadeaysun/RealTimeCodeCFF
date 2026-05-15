import { useEffect } from "react";
import TypeIt from "typeit";
import "./MainPage.css";
import { LuCodeXml } from "react-icons/lu";

const MainPage = () => {
  useEffect(() => {
    const instance = new TypeIt("#multipleStrings", {
      speed: 80,
      waitUntilVisible: true,
      loop: true,
    }).go();

    return () => instance.destroy();
  }, []);

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
          <div className="typing-box">
            <p id="multipleStrings" className="title">
              #Kod Yaz <br /> Öyrən <br /> İrəli Get
            </p>
          </div>
<div className="section">
<p className="desc">
            Müasir kodlaşdırma mühiti ilə real vaxt rejimində tələbələrinizi
            izləyin və ya dərslərə qoşulun.
          </p>
        </div>

        {/* CARDS */}
        <div className="cards">
          {/* CARD 1 */}
          <div className="card">
            <LuCodeXml className="icon"/>
            <h2>Otaq Yarat</h2>
            <p>
              Yeni dərs otağı yaradın və tələbələrinizi real vaxtda kod yazarkən izləyin.
            </p>
            <a href="/modals">Başla →</a>
          </div>

          {/* CARD 2 */}
          <div className="card">
            <LuCodeXml className="icon"/>
            <h2>Otağa Qoşul</h2>
            <p>
          Müəlliminizlə birgə dərs otağına qoşularaq kodlaşdırma bacarıqlarınızı inkişaf etdirin.
            </p>
            <a href="/room/join">Qoşul →</a>
          </div>
        </div>
      </div>
</div>
          
    </div>
  );
};

export default MainPage;