import { BrowserRouter, Routes, Route } from "react-router-dom";
import Career from "./pages/Career";
import Courses from "./pages/Courses";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyWhy from "./pages/MyWhy";
import Networking from "./pages/Networking";
import OpenSource from "./pages/OpenSource";
import PersonalProjects from "./pages/PersonalProjects";
import ProfessionalProjects from "./pages/ProfessionalProjects";
import Profile from "./pages/Profile";
import SelfLearning from "./pages/SelfLearning";
import Settings from "./pages/Settings";
import TeamCollaboration from "./pages/TeamCollaboration";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
