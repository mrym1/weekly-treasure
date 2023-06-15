import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./registeruser.css";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, auth, storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function RegisterUser() {
  const navigate = useNavigate();

  const initialState = {
    startAt: "",
    endAt: "",
    quiz: "",
    fee: "",
    percentage: "",
    prize: "",
  };

  // const AddUser = () => {
  const [data, setData] = useState(initialState);
  const { startAt, endAt, quiz,fee, percentage, prize } = data;  
  const [loading, setLoading] = useState(null); 

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });

   
  };
  console.log(data);


  const handleAdd = async (e) => {
    e.preventDefault();
    // console.log(email, password);
    console.log("handleAdd");
    // console.log(...data);
    // console.log(...data);
    try {
      
      
      console.log(typeof(fee));
       data.startAt =Timestamp.fromDate(new Date(data.startAt));
       data.endAt = Timestamp.fromDate(new Date(data.endAt));
       data.quiz = Timestamp.fromDate(new Date());
       data.fee =parseInt( data.fee);
       data.percentage =parseInt( data.percentage);
       data.prize =parseInt( data.prize);

      await addDoc(collection(db, "quiz"), {
        ...data,
       winner:"",
       active:false
      });
      navigate("/datatable");
    } catch (err) {
      console.log(err);
    }
    // console.log(result);
  };

  return (
    <>
      <div className="register">
        <div className="container">
          <div className="title">Create Quiz</div>
          <div className="content">
            <form onSubmit={handleAdd}>
              

              <div className="user-details">
                <div className="input-box">
                  <span className="details">Start Date</span>
                  <input
                    id="startAt"
                    type="datetime-local"
                    // placeholder="Enter your name"
                    // value={name}
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="input-box">
                  <span className="details">End Date</span>
                  <input
                    id="endAt"
                    type="datetime-local"
                    required
                    onChange={handleChange}
                  />
                </div>
                {/* <div className="input-box">
                  <span className="details">Quiz Date</span>
                  <input
                    id="quiz"
                    type="datetime-local"
                    required
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                </div> */}
                <div className="input-box">
                  <span className="details">Fee</span>
                  <input
                    id="fee"
                    type="number"
                    placeholder="0"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="input-box">
                  <span className="details">Percentage</span>
                  <input
                    id="percentage"
                    type="number"
                    placeholder="0"
                    required
                    onChange={(e) => {
                      handleChange(e);
                     
                    }}
                  />
                </div>
                <div className="input-box">
                  <span className="details">Prize</span>
                  <input
                    id="prize"
                    type="number"
                    placeholder="0"
                    required
                    onChange={handleChange}
                  />
                </div>
                
              </div>
              <div className="button">
                <input
                  disabled={loading !== null && loading < 100}
                  type="submit"
                  value="Submit"
                />
              </div>
            </form>
          </div>
          
        </div>
      </div>
    </>
  );
}

// }

export default RegisterUser;