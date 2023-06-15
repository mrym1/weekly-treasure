import React, { useState, useEffect } from "react";
import "../HomePage/datatable.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  serverTimestamp,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const History = () => {
  const initialState = {
    question: "",
    answer: "",
    hint: "",
  };

  const [data, setData] = useState([]);
  const [questionId, setQuestionId] = useState("");
  const [dataForm, setDataForm] = useState(initialState);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { question, answer, hint } = dataForm;
  const [file, setFile] = useState(null);
  const [imageProgress, setImageProgress] = useState(null);

  const onAddImage = (file) => {
    setFile(file);
    uploadFile(file);
     
  };

  const navigate = useNavigate();
  const { id } = useParams();

  const addQuestionModel = () => {
    setDataForm(initialState);
    setShowModal(!showModal);
  };

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, `quiz/${id}/questions`),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, [id]);

  const quizId = id;

  const handleDelete = async (id) => {
    console.log(id);
    try {
      await deleteDoc(doc(db, `quiz/${quizId}/questions/`, id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (doc) => {
    try {
      setQuestionId(doc.id);
      
      dataForm.picture = doc.picture;
      dataForm.question = doc.question;
      dataForm.answer = doc.answer;
      dataForm.hint = doc.hint;

      setShowModal(!showModal);
    } catch (err) {
      console.log(err);
    }
  };

  // Add Question

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setDataForm({ ...dataForm, [id]: value });
  };

  const uploadFile = (file) => {
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDataForm((prev) => ({ ...prev, picture: downloadURL }));
        });
      }
    );
  };
  //   useEffect(() => {

  //     file && uploadFile();
  //   }, [file]);
  console.log(dataForm);
  const handleAdd = async (e) => {
    e.preventDefault();
    console.log("handleAdd");
    try {
      if (file == null) {
        dataForm.picture="";
      }
      dataForm.hint = parseInt(dataForm.hint);
      if (questionId == "") {
        await addDoc(collection(db, `quiz/${quizId}/questions`), {
          ...dataForm,
        });
      } else {
        await updateDoc(doc(db, `quiz/${quizId}/questions/`, id), {
          ...dataForm,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="table">
      <div className="page_header">
        <h1>History</h1>
        {/* <div>
          <button
            onClick={addQuestionModel}
            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            Add Question
          </button> */}

          {showModal && (
            <div
              id="authentication-modal"
              tabIndex="-1"
              aria-hidden="true"
              className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-6 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
              <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <button
                    type="button"
                    onClick={addQuestionModel}
                    className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                    data-modal-hide="authentication-modal"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                  <div className="register">
                    <button
                      type="button"
                      onClick={addQuestionModel}
                      className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                      data-modal-hide="authentication-modal"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>

                    <div className="container">
                      <div className="title">{questionId == ""?'Add Question':'Edit Question'}</div>
                      <div className="content">
                        <form onSubmit={handleAdd}>
                          <div className="content">
                            <div className="upload">
                              <div className="upload-card">
                                <div id="preview">
                                  <img
                                    src={dataForm.picture || require("./add.jpg")}
                                    id="image"
                                    alt="Thumbnail"
                                    className="user-post"
                                  />
                                </div>
                              </div>
                             
                              <div className="round">
                                <input
                                  type="file"
                                  accept="image"
                                  id="file"
                                  onChange={(e) =>
                                    onAddImage(e.target.files[0])
                                  }
                                />
                                <i className="fa fa-camera"></i>
                              </div>
                             
                            </div>
                            {
                             imageProgress>0 &&
                            <p style={{marginTop:20,textAlign:"center",fontSize:13}}>Uploaded {Math.round(imageProgress) }%</p>
                            }
                            <div className="user-details">
                              <div className="input-box">
                                <span className="details">Question</span>
                                <input
                                  id="question"
                                  type="text"
                                  value={dataForm.question}
                                  placeholder="Enter a Question"
                                  required
                                  onChange={handleChange}
                                />
                              </div>

                              <div className="input-box">
                                <span className="details">Answer</span>
                                <input
                                  id="answer"
                                  type="text"
                                  value={dataForm.answer}
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
                                  value={dataForm.hint}
                                  //   min="0"
                                  required
                                  onChange={(e) => handleChange(e)}
                                />
                              </div>
                            </div>
                            <div className="button">
                              <input
                                disabled={imageProgress !== null && imageProgress < 100}
                                type="submit"
                                value={questionId == "" ? "Add" : "Update"}
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      {/* </div> */}

      <div className="table_header">
        <h3>Questions</h3>
        <div>
          <button
            onClick={addQuestionModel}
            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            Add Question
          </button>
          </div>
          </div>

      <div className="table_section">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Hint</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((data) => (
              <tr key={data.id}>
                <td>
                  <img src={data.picture|| null} />
                </td>
                <td>{data.question}</td>
                <td>{data.answer}</td>
                <td>{data.hint}</td>
                <td>
                  <button onClick={() => handleEdit(data)}>
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <button onClick={() => handleDelete(data.id)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
