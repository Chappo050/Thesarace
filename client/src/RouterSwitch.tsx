import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import User from "./components/User/User";
import UserLogin from "./components/User/UserLogin";
import UserLogout from "./components/User/UserLogout";
import UserRegister from "./components/User/UserRegister";
import UserAuth from "./components/User/UserAuth";
import GameSolo from "./components/Game/GameSolo";
import GameVersus from "./components/Game/GameVersus";
import About from "./components/About";

const RouteSwitch = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="user" element={<User />}>
          <Route path="register" element={<UserRegister />} />
          <Route path="login" element={<UserLogin />} />
          <Route path="logout" element={<UserLogout />} />
        </Route>
        <Route path="solo" element={<GameSolo />} />
        <Route path="versus" element={<GameVersus />} />
        <Route path="about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;
