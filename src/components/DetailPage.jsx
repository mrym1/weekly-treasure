import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "./HomePage/datatable.css";
import History from "./details/History";
import Quizdetails from "./details/Quizdetails";

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
    <div>
      <Quizdetails />
      <History/>
    </div>
  );
};

export default DetailPage;
