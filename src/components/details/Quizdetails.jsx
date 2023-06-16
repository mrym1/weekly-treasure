import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DataGrid } from "@mui/x-data-grid";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, storage } from "../../firebase";
import "../HomePage/datatable.css";

const Quizdetails = () => {
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
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onAddImage = (file) => {
    setFile(file);
    uploadFile(file);
  };

  const navigate = useNavigate();
  const { id } = useParams();

  const addQuestionModel = () => {
    setDataForm(initialState);
    setFile(null);
    setQuestionId(null);
    setImageProgress(null);
    handleClickOpen();
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
      handleClickOpen();
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

  console.log(dataForm);
  const handleAdd = async (e) => {
    e.preventDefault();
    console.log("handleAdd");
    try {
      if (file == null && questionId == "") {
        dataForm.picture = "";
      }
      dataForm.hint = parseInt(dataForm.hint);
      if (questionId == "") {
        console.log("adding");
        await addDoc(collection(db, `quiz/${quizId}/questions`), {
          ...dataForm,
        });
      } else {
        await updateDoc(doc(db, `quiz/${quizId}/questions/`, questionId), {
          ...dataForm,
        });
      }
      setDataForm(initialState);
      setFile(null);
      setImageProgress(null);
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };
  const userColumns = [
    {
      field: "picture",
      headerName: "Image",
      width: 250,
      rowHeight: 80,
      renderCell: (params) => {
        return (
          <img
            style={{ width: 50, height: 50 }}
            src={params.row.picture || null}
          />
        );
      },
    },
    {
      field: "question",
      headerName: "Question",
      width: 250,
    },
    {
      field: "answer",
      headerName: "Answer",
      width: 250,
    },

    {
      field: "hint",
      headerName: "Hint",
      width: 250,
    },
  ];
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div className="viewButton" onClick={() => handleEdit(params.row)}>
              Edit
            </div>

            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="table">
      <div className="page_header">
        <h1>Quiz Details</h1>
       
        <Dialog fullWidth={true} open={open} onClose={handleClose}>
          <DialogTitle>
            {questionId == null ? "Add Question" : "Edit Question"}
          </DialogTitle>
          <DialogContent>
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
                      onChange={(e) => onAddImage(e.target.files[0])}
                    />
                    <i className="fa fa-camera"></i>
                  </div>
                </div>
                {imageProgress > 0 && (
                  <p
                    style={{
                      marginTop: 20,
                      textAlign: "center",
                      fontSize: 13,
                    }}
                  >
                    Uploaded {Math.round(imageProgress)}%
                  </p>
                )}
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
                      min={1}
                      max={3}
                      value={dataForm.hint}
                      //   min="0"
                      required
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
                {/* <div className="button">
                  <input
                    disabled={imageProgress !== null && imageProgress < 100}
                    type="submit"
                    value={questionId == "" ? "Add" : "Update"}
                  />
                </div> */}
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button
                    disabled={imageProgress !== null && imageProgress < 100}
                    type="submit"
                  >
                    Submit
                  </Button>
                </DialogActions>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* </div> */}


      <div className="table_header">
        <h2>Available Quizes</h2>
        <Button variant="outlined" onClick={addQuestionModel}>
        + Add Question
      </Button>
      </div>
      <Box  className="datatable">
        <DataGrid
          autoHeight
          rowHeight={80}
          rows={data}
          getRowId={(row) => row.id}
          columns={userColumns.concat(actionColumn)}
          pageSize={10}
          rowsPerPageOptions={[]}
        />
      </Box>
    </div>
  );
};

export default Quizdetails;
