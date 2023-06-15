import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../HomePage/registeruser.css";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function Newquestion() {
  const navigate = useNavigate();

  const initialState = {
    // startAt: "",
    // endAt: "",
    // quiz: "",
    // fee: "",
    // percentage: "",
    // prize: "",
  };

  // const AddUser = () => {
  const [data, setData] = useState(initialState);
  const { question, answer, hint } = data;
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(null);
  // const [error, setError] = useEffect({});
  // const[isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });

    // setData({ ...data, [e.target.name]: e.target.value})
    console.log("handlechange");
  };
  console.log(data);

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      console.log(name);
      const storageRef = ref(storage, file.name);
      // const storageRef = firebase.storage().ref(file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setLoading(progress);
          console.log("progress", progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
            console.log("object");
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleAdd = async (e) => {
    e.preventDefault();
    // console.log(email, password);
    console.log("handleAdd");
    // console.log(...data);
    // console.log(...data);
    try {

      await addDoc(collection(db, "questions"), {
        ...data
      });
      // navigate("/datatdetailable");
    } catch (err) {
      console.log(err);
    }
    // console.log(result);
  };

  return (
    <>
      <div className="register">
        <div className="container">
          <div className="title">Add Question</div>
          <div className="content">
            <form onSubmit={handleAdd}>
            

              <div className="content"> 
                <div className="upload">
                  <img
                    src="https://drive.google.com/uc?export=view&id=1qw3KUJnYgvnJHQP-yY13u_rXrJO8ZbL_"
                    alt="..."
                  />
                  <div className="round">
                    <input
                      type="file"
                      accept="image"
                      id="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <i className="fa fa-camera"></i>
                  </div>
                </div>

                <div className="user-details">
                  <div className="input-box">
                    <span className="details">Question</span>
                    <input
                      id="question"
                      type="text"
                      placeholder="Enter a Question"
                      // value={name}
                      required
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-box">
                    <span className="details">Answer</span>
                    <input
                      id="answer"
                      type="text"
                      placeholder="Enter Answer"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">Hint</span>
                    <input
                      id="hint"
                      type="number"
                      placeholder="hint"
                      required
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </div>
                </div>
                <div className="button">
                  <input
                    disabled={loading !== null && loading < 100}
                    type="submit"
                    value="Register"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

// }

export default Newquestion;
