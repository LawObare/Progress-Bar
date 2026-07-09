import { BrowserRouter, Routes, Route } from "react-router-dom";
import Career from "./pages/Career";
import Courses from "./pages/Courses";
import DashboardLayout from "./layouts/DashboardLayout";
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
          {/*Public Route*/}
          <Route path="/login" element={<Login />} />

          {/*Private Route*/}
          <Route element={<DashboardLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/career" element={<Career />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/my-why" element={<MyWhy />} />
            <Route path="/networking" element={<Networking />} />
            <Route path="/opensource" element={<OpenSource />} />
            <Route path="/personalprojects" element={<PersonalProjects />} />
            <Route path="/professionalprojects" element={<ProfessionalProjects />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/selflearning" element={<SelfLearning />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/teamcollaboration" element={<TeamCollaboration />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
