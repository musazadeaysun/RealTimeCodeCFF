import { useState } from "react";
import { TbDeviceImacCode } from "react-icons/tb";
import { LuCodeXml } from "react-icons/lu";
import "./CreateRoom.css";
import { useNavigate } from "react-router-dom";
import { createRoomApi, getLanguagesApi } from "../../../api/roomApi";
import {getRoomApi} from "../../../api/roomApi";
const CreateRoom = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [languageEnabled, setLanguageEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");

const navigate = useNavigate();

  const handleCreateRoomClick = async () => {
    try {
      setLoading(true);

      const data = await getLanguagesApi();
      setLanguages(data.data || []);

      setLanguageEnabled(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

const handleLanguageChange = async (e) => {
  const language = e.target.value;

  setSelectedLanguage(language);
  if (!language) return;

  try {
    const data = await createRoomApi(language);
    const roomCode = data?.data?.roomCode;
    navigate(`/landingRoom/${roomCode}`);
  } catch (error) {
    console.error(error);
  }
};
  return (
    <div className="home">
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src="/picture/mainVideo.mp4" type="video/mp4" />
      </video>

      <div className="content">
        <div className="text-section">
          <p className="title">
            #Düşün <br />
            #Yaz <br />
            #Yarat
          </p>
          <div className="sectionCreateRoom">
            <p className="desc">
              Müasir kodlaşdırma mühiti ilə real vaxt rejimində tələbələrinizi
              izləyin və ya dərslərə qoşulun.
            </p>
          </div>
        </div>
        <div className="cardCreateRoom">
          <TbDeviceImacCode className="icon" />

          <h2>Yeni Otaq Yarat</h2>
          <p>Bir kliklə yeni kod otağı yaradın.</p>
          <div className="buttons">
            <button
              className="buttonOne"
              onClick={handleCreateRoomClick}
              disabled={loading}
            >
              <LuCodeXml />
              {loading ? "Otaq yaradilir..." : "Otaq Yarat"}
            </button>

            <select
              className="buttonTwo"
              disabled={!languageEnabled}
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <option value="">Dil seç</option>

              {languages.map((lang, index) => (
                <option key={index} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
             
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
