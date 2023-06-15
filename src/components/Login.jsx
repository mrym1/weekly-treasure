import React, { useState, useContext } from "react";
import "./Style/form.css";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
       await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        dispatch({type:"LOGIN", payload:user})
        navigate("/home");
        console.log(user);
      })
    } catch (err) {
      setError(err.message);
      // return(
      //     <p>
      //     {error && <alert>{error}</alert>}
      //     </p>
      // )
    }
  };

//   if(error){
//     return(
//         <p className="error">{error}</p>
//     )
//   }


  return (
    <>
      <div className="main_div">
        <div className="box">
          <h1>Tycoo</h1>
          <p className="error">{error}</p>
          <form>
            <div className="inputBox">
              <input
                type="email"
                name="email"
                autoComplete="off"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              
            </div>
            <div className="inputBox">
              <input
                type="passworddpassword"
                name="password"
                autoComplete="off"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
               
            </div>
            <div className="text_forget">
              <Link to="/forgotpassword">Forgot password?</Link>
            </div>
          </form>
          <button onClick={handleSubmit}> Login </button>
          {/* <link to='/phonesignup'>Signup withPhone</link> */}
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

export default Login;
