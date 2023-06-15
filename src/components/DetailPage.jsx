import React, { useState } from "react";
import "./HomePage/datatable.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import Quizdetails from "./details/Quizdetails";
import History from "./details/History";

const DetailPage = () => {
  return (
    <div>
      <Quizdetails />
      <History/>
      <p>fgjklkjhj</p>
    </div>
  );
};

export default DetailPage;
