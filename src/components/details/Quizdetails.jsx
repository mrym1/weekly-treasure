import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DataGrid } from "@mui/x-data-grid";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db, storage } from "../../firebase";
import "../HomePage/datatable.css";

const Quizdetails = () => {
  const initialState = {
    question: "",
    answer: "",
    hint: "",
    picture: "",
  };

  const [quiz, setQuiz] = useState(null);
  const [data, setData] = useState([]);
  const [questionId, setQuestionId] = useState(null);
  const [dataForm, setDataForm] = useState(initialState);
  const { question, answer, hint } = dataForm;
  const [file, setFile] = useState(null);
  const [imageProgress, setImageProgress] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [participents, setParticipents] = React.useState(0);
  const [calculatedPrize, setCalculatedPrize] = useState(0);
  const [subloading, setSubloading] = useState(false);

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
    const docQuiz = onSnapshot(
      doc(db, `quiz`, id),
      (snapShot) => {
        setQuiz(snapShot.data());
        // console.log("usama",snapShot.data());
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      docQuiz();
    };
  }, [id]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, `quiz/${id}/participents`),
      (snapShot) => {
        setParticipents(snapShot.size);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    };
  }, [id]);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, `quiz/${id}/questions`), orderBy("createdAt")),
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
    setSubloading(true);
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
    setSubloading(false);
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
    setSubloading(true);
    try {
      if (file == null && questionId == null) {
        dataForm.picture = "";
      }
      if (dataForm.picture == null || dataForm.picture == undefined) {
        dataForm.picture = "";
      }
      dataForm.hint = parseInt(dataForm.hint);
      if (questionId == null) {
        console.log("adding");
        await addDoc(collection(db, `quiz/${quizId}/questions`), {
          ...dataForm,
          createdAt: Timestamp.fromDate(new Date()),
        });
      } else {
        await updateDoc(doc(db, `quiz/${quizId}/questions/`, questionId), {
          ...dataForm,
        });
      }
      setDataForm(initialState);
      setFile(null);
      setImageProgress(null);
      setImageProgress(null);
      handleClose();
    } catch (err) {
      console.log(err);
    }
    setSubloading(false);
  };
  const userColumns = [
    {
      field: "picture",
      headerName: "Image",
      width: 100,
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
      width: 200,
    },
    {
      field: "answer",
      headerName: "Answer",
      width: 200,
    },

    {
      field: "hint",
      headerName: "Hint",
      width: 200,
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
    <div className="">
      <div className="page_header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            my: "5px",
          }}
        >
          <h1 className="text-black font-bold mb-4 underline text-4xl">
            Quiz Details
          </h1>
        </div>
        {quiz != null && (
          <div className="flex flex-col md:flex-row md:space-x-4">
            <p className="top-row mb-2 md:mb-0 md:mr-4 text-sm md:text-base">
              <span className="font-bold">Start Date:</span>{" "}
              {convertDate(quiz.startAt)}
            </p>
            <p className="top-row mb-2 md:mb-0 md:mr-4 text-sm md:text-base">
              <span className="font-bold">End Date:</span>{" "}
              {convertDate(quiz.endAt)}
            </p>
            <p className="top-row mb-2 md:mb-0 md:mr-4 text-sm md:text-base">
              <span className="font-bold">Fee:</span> {quiz.fee}
            </p>
            <p className="top-row mb-2 md:mb-0 md:mr-4 text-sm md:text-base">
              <span className="font-bold">Percentage:</span> {quiz.percentage}
            </p>
            <p className="top-row mb-2 md:mb-0 text-sm md:text-base">
              <span className="font-bold">Prize:</span> {quiz.prize}
            </p>
          </div>
        )}
        {quiz != null && (
          <div className="flex flex-col md:flex-row">
            <p className="top-row">
              <span style={{ fontWeight: "bold", marginRight: "10px" }}>
                Participents :{" "}
              </span>{" "}
              {participents}{" "}
            </p>
            <p className="top-row">
              <span style={{ fontWeight: "bold", marginRight: "10px" }}>
                Calculated Prize :{" "}
              </span>{" "}
              {(participents * quiz.percentage) / 100 > quiz.prize
                ? (participents * quiz.percentage) / 100
                : quiz.prize}{" "}
            </p>
          </div>
        )}
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
                    {subloading ? "Loading..." : "Submit"}
                  </Button>
                </DialogActions>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* </div> */}

      <div className="table_header">
        <h2 className="text-black font-bold mb-4 underline text-4xl">
          Questions
        </h2>
        <Button variant="outlined" onClick={addQuestionModel}>
          + Add Question
        </Button>
      </div>
      <Box sx={{ height: 500, width: "100%" }} className="datatable">
        <DataGrid
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

  function convertDate(date) {
    return (
      <div>
        {date.toDate().toDateString() +
          "\n At \n" +
          date.toDate().toLocaleTimeString("en-US")}
      </div>
    );
  }
};

export default Quizdetails;
