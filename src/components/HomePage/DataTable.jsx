import React, { useState, useEffect } from "react";
import "./registeruser.css";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

const Datatable = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const handleCheckboxChange = (docId, value) => {
    const quizRef = doc(db, "quiz", docId);
    updateDoc(quizRef, {
      active: value,
    });
  };

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
  const { startAt, endAt, quiz,fee, percentage, prize } = data;  
  const [loading, setLoading] = useState(null); 

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setFormData({ ...formData, [id]: value });   
  };

  const handleEdit = (doc)=>{
    setQuizId(doc.id);
    formData.startAt = doc.startAt.toDate().toISOString().slice(0,-1);
    formData.endAt = doc.endAt.toDate().toISOString().slice(0,-1);
    formData.quiz = doc.quiz.toDate().toISOString().slice(0,-1);
    formData.fee = doc.fee;
    formData.percentage = doc.percentage;
    formData.prize = doc.prize;
    handleClickOpen();
  }
  const handleDelet = async (id)=>{
    try {

      await deleteDoc(doc(db, `quiz/`, id));
    } catch (err) {
      console.log(err);
    }
  }
  const handleAddNew = ()=>{
    setQuizId(null); 
    setFormData(initialState);
    handleClickOpen();
  }


  const handleAdd = async (e) => {
    e.preventDefault();
    console.log("handleAdd");
   
    try {
       formData.startAt =Timestamp.fromDate(new Date(formData.startAt));
       formData.endAt = Timestamp.fromDate(new Date(formData.endAt));
       formData.fee =parseInt( formData.fee);
       formData.percentage =parseInt( formData.percentage);
       formData.prize =parseInt( formData.prize);
       console.log(quizId)
       if(quizId==null){
         formData.quiz = Timestamp.fromDate(new Date());
         await addDoc(collection(db, "quiz"), {
           ...formData,
           winner:"",
           active:false
          });
        }else{
         formData.quiz = Timestamp.fromDate(new Date(formData.quiz));
         await updateDoc(doc(db,"quiz",quizId), {
           ...formData,  
         });
      }
      
    } catch (err) {
      console.log(err);
    }
  };
   console.log(formData);


  const userColumns = [
    {
      field: "startAt",
      headerName: "Start Date",
      width: 250,
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
      width: 250,
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
            <div onClick={()=>handleEdit(params.row)} className="viewButton">Edit</div>
             
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
       
      <Dialog fullWidth={true}
        minWidth={500} open={open} onClose={handleClose}>
        <DialogTitle> {quizId==null? "Add New Quiz":"Edit Quiz"}</DialogTitle>
        <DialogContent>
          
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
      <div className="table_header">
        <h2>Available Quizes</h2>
        <Button variant="outlined" onClick={()=>handleAddNew()}>
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
