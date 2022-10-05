//IMPROTS//
import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
//API setup
const api = axios.create({
  baseURL:  "/api",
  withCredentials: true,
});

function Auth({ children }: { children: JSX.Element }) {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  //Get sessions information
  async function checkAuth() {
    await api
      .get("/user/auth", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 304 || 200) {
          setLogged(true);
          setLoading(false);
        }
        setLoading(false);
      });
    setLoading(false);
  }

  //Server fails to respond to redirect
  useEffect(() => {
    checkAuth();
    setTimeout(() => {
      setLoading(false);
    }, 2000);

  }, []);

  return (
    <>
      {loading ? <span> Loading... </span> : <></>}
   
      {logged ? children : <></>}

      {!logged && !loading ? <Navigate to="/user/login" /> : <></>}

    </>
  );
}

export default Auth;
