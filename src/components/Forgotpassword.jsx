import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "../firebase";

function Forgotpassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      setMessage("");
      await sendPasswordResetEmail(auth, email);
      setMessage("Check your inbox for futher instructions.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="main_div">
        <div className="box">
          <h1>Tycoo</h1>
          <p className="error">
            {error}
            {message}
          </p>
          <form>
            <div className="inputBox">
              <input
                type="email"
                name="email"
                autoComplete="off"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <label> Email </label>
            </div>
          </form>
          <button onClick={handleSubmit}> Reset Password </button>
          <div className="text sign-up-text">
            Don't have an account?{" "}
            <label>
              <Link to="/signup">Sigup now</Link>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default Forgotpassword;
