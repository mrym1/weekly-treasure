import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import "./datatable.scss";
// import "./registeruser.css";

import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

const Datatable = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialState);
    setQuizId(null);
  };

  const navigate = useNavigate();

  /////////////////////////////////
  ///
  ///     Checking if user credentails are in local storage or not
  ///
  /////////////////////////////////

  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

  useEffect(() => {
    // Navigate to a different page after the component has mounted
    if (email == null && password == null) {
      {
        return navigate("/login");
      }
    }
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "quiz"),
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
  }, []);

  ////////////////////////////
  ////
  ////   Dialogue data
  ////
  //////////////////////////

  const initialState = {
    startAt: "",
    endAt: "",
    quiz: "",
    fee: "",
    percentage: "",
    prize: "",
  };

  // const AddUser = () => {
  const [formData, setFormData] = useState(initialState);
  const [quizId, setQuizId] = useState(null);
  const { startAt, endAt, quiz, fee, percentage, prize } = data;
  const [loading, setLoading] = useState(null);

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setFormData({ ...formData, [id]: value });
  };

  const handleEdit = (doc) => {
    console.log("edit calling");
    setQuizId(doc.id);
    formData.startAt = doc.startAt.toDate().toISOString().slice(0, -1);
    formData.endAt = doc.endAt.toDate().toISOString().slice(0, -1);
    formData.quiz = doc.quiz.toDate().toISOString().slice(0, -1);
    formData.fee = doc.fee.toString();
    formData.percentage = doc.percentage.toString();
    formData.prize = doc.prize.toString();
    handleClickOpen();
  };
  const handleDelet = async (id) => {
    try {
      await deleteDoc(doc(db, `quiz/`, id));
      setFormData(initialState);
    } catch (err) {
      console.log(err);
    }
  };
  const handleAddNew = () => {
    setQuizId(null);
    setFormData(initialState);
    handleClickOpen();
  };
  console.log(formData);

  const handleAdd = async (e) => {
    e.preventDefault();
    console.log("add new calling");
    try {
      formData.startAt = Timestamp.fromDate(new Date(formData.startAt));
      formData.endAt = Timestamp.fromDate(new Date(formData.endAt));
      formData.quiz = Timestamp.fromDate(new Date());
      formData.fee = parseInt(formData.fee);
      formData.percentage = parseInt(formData.percentage);
      formData.prize = parseInt(formData.prize);

      if (quizId == null) {
        console.log("adding new");
        await addDoc(collection(db, "quiz"), {
          ...formData,
          winner: "",
          active: false,
        });
      } else {
        console.log(formData);
        console.log("updating");
        await updateDoc(doc(db, "quiz", quizId), {
          ...formData,
        });
      }
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const userColumns = [
    {
      field: "startAt",
      headerName: "Start Date",
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            {params.row.startAt.toDate().toDateString() +
              "\n At \n" +
              params.row.startAt.toDate().toLocaleTimeString("en-US")}
          </div>
        );
      },
    },
    {
      field: "endAt",
      headerName: "End Date",
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            {params.row.endAt.toDate().toDateString() +
              " At " +
              params.row.endAt.toDate().toLocaleTimeString("en-US")}
          </div>
        );
      },
    },
    {
      field: "fee",
      headerName: "Fee",
    },
    {
      field: "percentage",
      headerName: "Percentage",
    },
    {
      field: "prize",
      headerName: "Prize",
    },
    {
      field: "winner",
      headerName: "Winner",

      renderCell: (params) => {
        if (params.row.winner === "") {
          return <div>-</div>;
        } else {
          return <div>Available</div>;
        }
      },
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
            <div
              className="viewButton"
              onClick={() => navigate(`/detailquiz/${params.row.id}`)}
            >
              View
            </div>
            <div onClick={() => handleEdit(params.row)} className="viewButton">
              Edit
            </div>

            <div
              className="deleteButton"
              onClick={() => handleDelet(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Dialog
        fullWidth={true}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          {" "}
          {quizId == null ? "Add New Quiz" : "Edit Quiz"}
        </DialogTitle>
        <DialogContent
        >
          <form onSubmit={handleAdd}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Start Date</span>
                <input
                  id="startAt"
                  value={formData.startAt}
                  type="datetime-local"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="input-box">
                <span className="details">End Date</span>
                <input
                  id="endAt"
                  value={formData.endAt}
                  type="datetime-local"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="input-box">
                <span className="details">Fee</span>
                <input
                  id="fee"
                  value={formData.fee}
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
                  value={formData.percentage}
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
                  value={formData.prize}
                  type="number"
                  placeholder="0"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <div className="table_header" style={{marginTop: "40px"}}>
        <Typography variant="h5">Available Quizes</Typography>
        <Button variant="outlined" onClick={handleAddNew}>
          + Add New
        </Button>
      </div>
      <div className="datatable">
        <DataGrid
          autoHeight
          rowHeight={60}
          rows={data}
          getRowId={(row) => row.id}
          columns={userColumns.concat(actionColumn)}
          pageSize={10}
          rowsPerPageOptions={[]}
        />
      </div>
    </div>
  );
};

export default Datatable;
