import { Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./pages/Home/MainPage";
import CreateRoom from "./pages/Teachers/CreateRoom/CreateRoom";
import JoinRoom from "./pages/Students/JoinRoom/JoinRoom";
import LandingRoom from "./pages/Teachers/LandingRoom/LandingRoom";
import TeacherDashboard from "./pages/Teachers/TeacherDashboard/TeacherDashboard";
import StudentPanel from "./pages/Students/StudentPanel/StudentPanel";
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/pages/Teachers/CreateRoom" element={<CreateRoom />} />
      <Route path="/pages/Students/JoinRoom" element={<JoinRoom />} />
      <Route path="/landingRoom/:roomCode" element={<LandingRoom />} />
      <Route path="/teacher/:roomCode" element={<TeacherDashboard />} />
      <Route path="/room/:roomCode" element={<StudentPanel />} />
    </Routes>
  );
}

export default App;
