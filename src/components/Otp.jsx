import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Otp() {
  const [opt, setOpt] = useState("");
  const [error, setError] = useState("");

  console.log(opt);

  const navigate = useNavigate();

  const verifyOtp = (e) => {
    let otp = e.target.value;
    setOpt(otp);
    if (otp.length === 6) {
      console.log(otp);
      let confirmationResult = window.confirmationResult;
      confirmationResult
        .confirm(otp)
        .then((result) => {
          // const user = result.user;
          navigate("/home");
        })
        .catch((error) => {
          setError(error);
        });
    }
  };

  return (
    <>
      <div className="main_div">
        <div className="box">
          <h1>Tycoo</h1>
          <p className="error">{error}</p>
          <form>
            <div className="inputBox">
              <input
                type="number"
                name="opt"
                autoComplete="off"
                required
                onChange={verifyOtp}
              />
              <label> Opt </label>
            </div>
          </form>

          {/* <button onClick={verifyOtp}> Verify Otp </button> */}
        </div>
      </div>
    </>
  );
}

export default Otp;
