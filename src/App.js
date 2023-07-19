import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
// import PhoneAuth from "./components/PhoneAuth";
import Home from "./components/Home";
import Forgotpassword from "./components/Forgotpassword";
import Notification from './components/notification/Notification'
import Otp from "./components/Otp";
import DataTable from "./components/HomePage/DataTable";
import RegisterUser from "./components/HomePage/RegisterUser";
import UpdateUser from "./components/HomePage/UpdataUser";
import DetailQuiz from "./components/DetailPage";
import Users from "./components/users/Users";
import NewQuestion from "./components/Questions/Newquestion";
import { AuthContext } from './context/AuthContext';
// import "./messaging_init_in_sw.js";

// import { onAuthStateChanged } from "firebase/auth";

// import { auth } from "./firebase";

function App() {
  // const currentUser = true;
  const { currentUser } = useContext(AuthContext);
  // console.log(currentUser);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to='/' />;
  }

  return (
    <Routes>
      {/* <Route path="/" element={<RequireAuth><Home/></RequireAuth>} /> */}
      <Route path="/" element={<RequireAuth><DataTable/></RequireAuth>} />
      <Route path="/registeruser" element={<RequireAuth><RegisterUser/></RequireAuth>} />
      <Route path="/updateuser/:id" element={<RequireAuth><UpdateUser/></RequireAuth>} />
      <Route path="/detailquiz/:id" element={<RequireAuth><DetailQuiz/></RequireAuth>} />
      <Route path="/questions/:id" element={<RequireAuth><DetailQuiz/></RequireAuth>} />
      <Route path="/notification" element={<RequireAuth><Notification/></RequireAuth>} />
      <Route path="/users" element={<RequireAuth><Users/></RequireAuth>} />
      {/* <Route path="quiz/:id/newquestion/" element={<RequireAuth><NewQuestion/></RequireAuth>} /> */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgotpassword" element={<Forgotpassword />} />
    </Routes>
  );
}

export default App;
