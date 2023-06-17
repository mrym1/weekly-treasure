import React, { useState, useContext, useEffect } from "react";
// import "./Style/form.css";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import { TextField, Button, Box, Typography } from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (storedEmail != null || storedPassword != null) {
      return navigate("/");
    }
  }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   localStorage.setItem('email', email);
  //   localStorage.setItem('password', password);
  //   setError("");
  //   try {
  //     await signInWithEmailAndPassword(auth, email, password).then(
  //       (userCredential) => {
  //         const user = userCredential.user;
  //         dispatch({ type: "LOGIN", payload: user });
  //         navigate("/home");
  //         console.log(user);
  //       }
  //     );
  //   } catch (err) {
  //     setError(err.message);
  //     // return(
  //     //     <p>
  //     //     {error && <alert>{error}</alert>}
  //     //     </p>
  //     // )
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const user = userCredential.user;
          dispatch({ type: "LOGIN", payload: user });
          navigate("/");
          console.log(user);
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);
        }
      );
    } catch (error) {
      // setError(err.message);

      const errorCode = error.code;
      let errorMessage;

      switch (errorCode) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/user-disabled":
          errorMessage = "Your account has been disabled.";
          break;
        case "auth/user-not-found":
          errorMessage = "User not found.";
          break;
        case "auth/wrong-password":
          errorMessage = "Invalid password.";
          break;
        default:
          errorMessage = "An error occurred during authentication.";
      }

      // Display the error message to the user
      setError(errorMessage);
    }
  };

  return (
    <>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            maxWidth: "500px",
            margin: "0 auto",
            backgroundColor: "#f2f2f2",
            padding: "2rem",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{ color: "rgb(147, 147, 244)" }}
          >
            Weekly Treasure
          </Typography>
          <form></form>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            name="email"
            autoComplete="off"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            name="password"
            autoComplete="off"
            required
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          {error && (
            <Typography
              variant="body1"
              className="error"
              align="center"
              sx={{ color: "red" }}
            >
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{ backgroundColor: "rgb(147, 147, 244)" }}
          >
            Login
          </Button>
        </Box>

        {/* <div className="text_forget">
              <Link to="/forgotpassword">Forgot password?</Link>
            </div>
          </form>
          <button onClick={handleSubmit}> Login </button> */}
        {/* <link to='/phonesignup'>Signup withPhone</link> */}
        {/* <div className="text sign-up-text">
            Don't have an account?{" "}
            <label>
              <Link to="/signup">Sigup now</Link>
            </label>
          </div>
        </div> */}
      </Box>
    </>
  );
}

export default Login;
