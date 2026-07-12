import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate,
 } from "react-router-dom";
 
import Career from "./pages/Career";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyWhy from "./pages/MyWhy";
import Networking from "./pages/Networking";
import OpenSource from "./pages/OpenSource";
import PersonalProjects from "./pages/PersonalProjects";
import ClientProjects from "./pages/ClientProjects";
import Profile from "./pages/Profile";
import SelfLearning from "./pages/SelfLearning";
import Settings from "./pages/Settings";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/*Public Route*/}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/*Private Route*/}
          <Route element={<DashboardLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/career" element={<Career />} />
            <Route path="/my-why" element={<MyWhy />} />
            <Route path="/networking" element={<Networking />} />
            <Route path="/opensource" element={<OpenSource />} />
            <Route path="/personalprojects" element={<PersonalProjects />} />
            <Route path="/clientprojects" element={<ClientProjects />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/selflearning" element={<SelfLearning />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
