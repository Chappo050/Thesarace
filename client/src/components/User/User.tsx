//IMPROTS//
import { Outlet } from "react-router-dom";

//Components//
import Nav from "../Nav";



function User() {

  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  );
}

export default User;
