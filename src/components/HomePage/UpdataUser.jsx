import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./registeruser.css";
import {
  addDoc,
  updateDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, auth, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function UpdateUser() {

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    id && getSingleUser();
  }, [id]);

  const getSingleUser = async () => {
    const docRef = doc(db, 'users', id);
    const snapshot = await getDoc(docRef);
    console.log(snapshot);
    if ( snapshot.exists()) {
        setData({ ...snapshot.data()})
    }
    else{
        console.log('nnon');
    }
  }


  const initialState = {
    name: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  }

    const [data, setData] = useState(initialState);
    const {name, username, email, phone, address, password} = data;
    const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(null);
  // const [error, setError] = useEffect({});
  // const[isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({...data, [id]:value});
    // setData({ ...data, [e.target.name]: e.target.value})
    console.log('handlechange');
  };

//   console.log(data);


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
          console.log('progress',progress);
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
            console.log('object');
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleAdd = async (e) => {
    e.preventDefault();
    console.log('handleAdd');
    // console.log(...data);
    try{
    await updateDoc(doc(db, "users", id), {
      ...data,
      timeStamp: serverTimestamp(),
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
        <div className="title">Registration</div>
        <div className="content">
          <form onSubmit={handleAdd}>
            <div className="upload">
              <img
                src="https://drive.google.com/uc?export=view&id=1qw3KUJnYgvnJHQP-yY13u_rXrJO8ZbL_"
                alt="..."
              />
              <div className="round">
                <input type="file" accept="image" id="file" onChange={(e) => setFile(e.target.files[0])} />
                <i className="fa fa-camera"></i>
              </div>
            </div>

            <div className="user-details">
              <div className="input-box">
                <span className="details">Full Name</span>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="input-box">
                <span className="details">Username</span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  placeholder="Enter your username"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input
                  id="email"
                  type="text"
                  value={email}
                  placeholder="Enter your email"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="input-box">
                <span className="details">Phone Number</span>
                <input
                  id="phone"
                  type="text"
                  value={phone}
                  placeholder="Enter your number"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="input-box">
                <span className="details">Password</span>
                <input
                  id="password"
                  type="text"
                  value={password}
                  placeholder="Enter your password"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="input-box">
                <span className="details">Address</span>
                <input
                  id="address"
                  type="text"
                  value={address}
                  placeholder="Enter your Address"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="button">
              <input disabled={loading !==null && loading<100} type="submit" value="Register" />
            </div>
          </form>
        </div>
      </div>
    </div>
    
    </>
  )

  }
 

export default UpdateUser;





