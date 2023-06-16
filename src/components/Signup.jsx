import React, { useState } from "react";
// import "./Style/form.css";
import { Link, useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { auth } from "../firebase";

function Signup() {
  //   const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmed, setPasswordConfirmed] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handle = async () => {
    if (!email || !password || !passwordConfirmed) {
      return setError("Fill all fields");
    }
    if (password !== passwordConfirmed) {
      return setError("Password do not match.");
    }
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setLoading(true);

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
  //   const handle = async ()=>{
  //     try {
  //       var result = await  createUserWithEmailAndPassword(auth, email, password);
  //        console.log(result);
  //        navigate('/');
  //     } catch (err) {
  //       setError(err.message);
  //     }
  //   }

  return (
    <>
      <div className="main_div">
        <div className="box">
          <h1>Tycoo</h1>
          <p className="error">{error}</p>
          <form>
            {/* <div className="inputBox">
              <input
                type="text"
                name="username"
                autoComplete="off"
                required
                onChange={(e) => setUser(e.target.value)}
              />
              <label> Username </label>
            </div> */}
            <div className="inputBox">
              <input
                type="email"
                name="email"
                autoComplete="off"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              
            </div>
            <div className="inputBox">
              <input
                type="passworddpassword"
                name="password"
                autoComplete="off"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
               
            </div>
            <div className="inputBox">
              <input
                type="passworddpassword"
                name="passwordcfm"
                autoComplete="off"
                required
                onChange={(e) => setPasswordConfirmed(e.target.value)}
              />
              <label> Confirmed Password </label>
            </div>
          </form>
          <button onClick={handle} disabled={loading}>
            Submit
          </button>
          <div className="text sign-up-text">
            Don't have an account?{" "}
            <label>
              <Link to="/">Login now</Link>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
