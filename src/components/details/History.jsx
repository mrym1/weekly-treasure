import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { DataGrid } from "@mui/x-data-grid";
import { collection, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
// import "../HomePage/datatable.css";

const Quizdetails = () => {
  const [data, setData] = useState([]);
  const [response, setResponse] = useState([]);
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (doc) => {
    try {
    
      
      setResponse(doc.response);
      setOpen(true);
      
    } catch (e) {
      console.log(e);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, `quiz/${id}/history`),
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
  const userColumns = [
    {
      field: "userId",
      headerName: "User Id",
      width: 300,
    },
    {
      field: "Image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => {
        return <UserImage userId={params.row.userId} />;
      },
    },
    {
      field: "Name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => {
        return <UserName userId={params.row.userId} />;
      },
    },
    {
      field: "Email",
      headerName: "Email",
      width: 250,
      // flex: 0,
      renderCell: (params) => {
        return <UserEmail userId={params.row.userId} />;
      },
    },
  ];
  const actionColumn = [
    {
      field: "See Response",
      headerName: "See Response",
      width: 80,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Button onClick={()=>handleClickOpen(params.row)} className="viewButton">View</Button>
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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"User Response"}
        </DialogTitle>
        <DialogContent>
        {response.map((i) => (
    <div>
            <Typography variant="h6">Question {i.no+1} :</Typography>
            <div style={{border: "1px solid grey", marginBottom: "5px", borderRadius: "5px"}}>
            <Typography sx={{ color: "grey", ml: "15px", fontSize: "20px"}}>
              Question:  <span style={{color: "black"}}>{i.question}</span>
             </Typography>
            {i.answers.map(function (data) {
             return (
              <div>
                 <Typography sx={{ color: "grey", ml: "15px", fontSize: "20px"}}>
              Answer:  <span style={{color: "black"}}>{data.answer}</span>
             </Typography>
              <Typography sx={{ color: "grey", ml: "15px"}}>
              Time: <span style={{fontSize: "14px"}}>{data.timeStamp.toDate().toDateString()+" At "+data.timeStamp.toDate().toLocaleTimeString("en-US")}
                   </span>
                 </Typography>
                 </div>
           
              )
    })}
                </div>
    </div>
      ))}
      
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Done</Button>
        </DialogActions>
      </Dialog>
      <div className="page_header">
        <h1 className="text-black font-bold mb-4 underline text-4xl">History</h1>
      </div>
      <Box className="datatable">
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
const UserImage = (props) => {
  const { userId } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, `users/${userId}`),
      (snapShot) => {
        setData(snapShot.data());

        // console.log(snapShot.data());
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, [userId]);

  return (
    data && (
      <img
        style={{ height: 50, width: 50 }}
        src={data.image}
        alt="Katherine Johnson"
      />
    )
  );
};
const UserName = (props) => {
  const { userId } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, `users/${userId}`),
      (snapShot) => {
        setData(snapShot.data());

        // console.log(snapShot.data());
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    };
  }, [userId]);

  return data && <p> {data.winningName} </p>;
};
const UserEmail = (props) => {
  const { userId } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, `users/${userId}`),
      (snapShot) => {
        setData(snapShot.data());

        // console.log(snapShot.data());
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, [userId]);

  return data && <p> {data.winningEmail} </p>;
};


export default Quizdetails;
