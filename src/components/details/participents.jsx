import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import { collection, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
// import "../HomePage/datatable.css";

const Participents = () => {
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
      collection(db, `quiz/${id}/participents`),
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
      field: "uid",
      headerName: "User Id",
      width: 300,
    },
    {
      field: "Image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => {
        return <UserImage userId={params.row.uid} />;
      },
    },
    {
      field: "Name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => {
        return <UserName userId={params.row.uid} />;
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      renderCell: (params) => {
        return <UserEmail userId={params.row.uid} />;
      },
    },
    {
      field: "timestamp",
      headerName: "Join Date",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row.timestamp.toDate().toDateString()} <br />
            At {params.row.timestamp.toDate().toLocaleTimeString("en-US")}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="page_header">
        <h1 className="text-black font-bold mb-4 underline text-4xl">
          Participents
        </h1>
      </div>
      <Box className="datatable">
        <DataGrid
          autoHeight
          rowHeight={80}
          rows={data}
          getRowId={(row) => row.id}
          columns={userColumns}
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

export default Participents;
