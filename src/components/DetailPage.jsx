import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./HomePage/datatable.css";
import History from "./details/History";
import Quizdetails from "./details/Quizdetails";
import Sidebar from "./sidebar/Sidebar";
import Winner from "./details/Winner";
import Participents from "./details/participents";

const DetailPage = () => {
  const navigate = useNavigate();

  /////////////////////////////////
  ///
  ///     Checking if user credentails are in local storage or not
  ///
  /////////////////////////////////

  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

  useEffect(() => {
    // Navigate to a different page after the component has mounted
    if (email == null && password == null) {
      {
        return navigate("/login");
      }
    }
  }, []);

  return (
    <div className="flex">
      <div className="fixed h-screen">
        <Sidebar />
      </div>
      <div className="md:ml-64 ml-6 flex-1 overflow-y-auto">
        <div>
          <Winner />
          <Quizdetails />
          <History />
          <Participents />
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
