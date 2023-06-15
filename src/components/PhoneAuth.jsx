import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import { auth } from "../firebase";

function PhoneAuth() {
  const [number, setNumber] = useState("");
  // const [opt, setOpt] = useState('');
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const generateRecaptcha = () => {
    window.RecaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {},
      },
      auth
    );
  };

  const getOpt = async (e) => {
    e.preventDefault();
    setError("");
    if (number === "" || number === undefined) {
      return setError("Please enter a valid Phone Number!");
    }
    generateRecaptcha();
    let appVerifier = window.RecaptchaVerifier;
    signInWithPhoneNumber(auth, number, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        navigate("/otp");
      })
      .catch((error) => {
        console.log(error);
      });

    // try {
    //     const resp = await RecaptchaVerifier('recaptcha-container',{},auth);
    //     console.log(resp);
    // } catch (err) {
    //   setError(err.message);
    // }
    // console.log(number);
  };

  // const verifyOtp = (e) => {
  //     let otp = e.target.value;
  //     setOpt(otp);
  //     if(otp.length === 6){
  //         console.log(otp);
  //         let confirmationResult = window.confirmationResult;
  //         confirmationResult.confirm(otp).then((result) => {
  //             // const user = result.user;
  //             navigate('/home');
  //         }).catch((error) => {
  //             console.log("Errrorrrrrrr",error);
  //         })
  //     }
  // }

  return (
    <>
      <div className="main_div">
        <div className="box">
          <h1>Tycoo</h1>
          <p className="error">{error}</p>
          <form>
            <div className="inputBoxPhone">
            <PhoneInput
            defaultCountry="PK"
            //   country={"pk"}
            //   autoFormat={false}
              value={number}
              onChange={setNumber}
              placeholder="Enter Phone Number"
            />
            </div>
            <div id="recaptcha-container" />
          </form>

          <button onClick={getOpt}> Send OTP </button>
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

export default PhoneAuth;
