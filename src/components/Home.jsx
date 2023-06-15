import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  signOut,
  // onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase";

function Home(props) {
  // console.log(props);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      var result = await signOut(auth);
      console.log(result);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <>
      <div style={{ display: "inline-block", alignItems: "center", justifyContent: "center", margin: "50px" }}>
        <div>
          <h1>Hello {props.name}</h1>
          <p className="error">{error}</p>
        </div>
        <div>
        <Link to="/datatable">
          <span
            style={{
              fontSize: "40px",
              padding: "10px",
              color: "#ffffff",
              borderRadius: "5px",
              background: "#d28df7",
              boxShadow: "20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff",
            }}
          >
            Datatable
          </span>
        </Link>
        </div>
        <div>
        <button
          onClick={handleLogOut}
          style={{
            padding: "10px",
            borderRadius: "20px",
            background: "#ffffff",
            boxShadow: "20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff",
            fontSize: "16px",
            marginTop: "30px",
            cursor: "pointer",
          }}
        >
          Log out
        </button>
        </div>
      </div>
    </>
  );
}

export default Home;
