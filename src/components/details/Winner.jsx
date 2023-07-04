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
import { Link, useParams } from "react-router-dom";
import { db } from "../../firebase";

// import "../HomePage/datatable.css";

const Winner = () => {
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
      collection(db, `quiz/${id}/winners`),
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

  if (data.length === 0) {
    return (
      <div className="mt-3">
        <div className="page_header">
          <div
            className="my-5"
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h1 className="text-black font-bold mb-4 underline text-4xl">
              Winner Details
            </h1>
            <Link to="/">
              <Typography
                sx={{
                  color: "red",
                  textDecoration: "underline",
                  mx: "40px",
                  my: "10px",
                }}
              >
                Back To List
              </Typography>
            </Link>
          </div>
        </div>
        <div className="flex justify-center ">
        <p className="bg-slate-100 px-8 py-4">No winners yet.</p>
        </div>
      </div>
    );
  }

  //   const userColumns = [
  //     {
  //       field: "Image",
  //       headerName: "Image",
  //       width: 150,
  //       renderCell: (params) => {
  //         return <UserImage uid={params.row.uid} />;
  //       },
  //     },
  //     {
  //       field: "Name",
  //       headerName: "Name",
  //       width: 250,
  //       renderCell: (params) => {
  //         return <UserName uid={params.row.uid} />;
  //       },
  //     },
  //     {
  //       field: "GovtId",
  //       headerName: "GovtId",
  //       width: 150,
  //       renderCell: (params) => {
  //         return <GovtId uid={params.row.uid} />;
  //       },
  //     },
  //     {
  //       field: "Email",
  //       headerName: "Email",
  //       width: 300,
  //       // flex: 0,
  //       renderCell: (params) => {
  //         return <UserEmail uid={params.row.uid} />;
  //       },
  //     },
  //   ];

  return (
    <div className="mt-3">
      <div className="page_header">
        <div className="my-5"
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h1 className="text-black font-bold mb-4 underline text-4xl">Winner Details</h1>
          <Link to="/">
            <Typography
              sx={{
                color: "red",
                textDecoration: "underline",
                mx: "40px",
                my: "10px",
              }}
            >
              Back To List
            </Typography>
          </Link>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center m-4">
          {data.map((winner) => (
            <WinnerBox key={winner.id} winner={winner} />
          ))}
        </div>
      </div>

      {/* <Box className="datatable">
        <DataGrid
          autoHeight
          rowHeight={80}
          rows={data}
          getRowId={(row) => row.id}
          columns={userColumns}
          pageSize={10}
          rowsPerPageOptions={[]}
        />
      </Box> */}
    </div>
  );
};

const WinnerBox = ({ winner }) => {
  const { uid } = winner;
  const [data, setData] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, `users/${uid}`),
      (snapShot) => {
        setData(snapShot.data());
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, [uid]);

  if (!data) {
    return (
      <div className="flex justify-center ">
        <p className="bg-slate-100 px-10 py-4">Loading.</p>
        </div>
    )// Render nothing while data is loading
  }

  return (
    <div className="flex w-full">
      <div className="max-w-sm flex p-6 m-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <img
          className="h-40 w-40 rounded-full mr-4"
          src={data.image}
          alt="Katherine Johnson"
        />
        <div className="flex flex-col justify-center">
          <h5 className="my-2 font-bold tracking-tight text-gray-900 dark:text-white">
            {data.winningName}
          </h5>
          <h5 className="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
            {data.govtId}
          </h5>
          <h5 className="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
            {data.winningEmail}
          </h5>
        </div>
      </div>
    </div>
  );
};

// const UserImage = (props) => {
//   const { uid } = props;
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const unsub = onSnapshot(
//       doc(db, `users/${uid}`),
//       (snapShot) => {
//         setData(snapShot.data());

//         console.log(snapShot.data());
//       },
//       (error) => {
//         console.log(error);
//       }
//     );

//     return () => {
//       unsub();
//     };
//   }, [uid]);

//   return (
//     data && (
//       <img
//         style={{ height: 50, width: 50 }}
//         src={data.image}
//         alt="Katherine Johnson"
//       />
//     )
//   );
// };

// const UserName = (props) => {
//   const { uid } = props;
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const unsub = onSnapshot(
//       doc(db, `users/${uid}`),
//       (snapShot) => {
//         setData(snapShot.data());

//         console.log(snapShot.data());
//       },
//       (error) => {
//         console.log(error);
//       }
//     );
//     return () => {
//       unsub();
//     };
//   }, [uid]);

//   return data && <p> {data.winningName} </p>;
// };

// const UserEmail = (props) => {
//   const { uid } = props;
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const unsub = onSnapshot(
//       doc(db, `users/${uid}`),
//       (snapShot) => {
//         setData(snapShot.data());

//         console.log(snapShot.data());
//       },
//       (error) => {
//         console.log(error);
//       }
//     );

//     return () => {
//       unsub();
//     };
//   }, [uid]);

//   return data && <p> {data.winningEmail} </p>;
// };

// const GovtId = (props) => {
//   const { uid } = props;
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const unsub = onSnapshot(
//       doc(db, `users/${uid}`),
//       (snapShot) => {
//         setData(snapShot.data());

//         console.log(snapShot.data());
//       },
//       (error) => {
//         console.log(error);
//       }
//     );

//     return () => {
//       unsub();
//     };
//   }, [uid]);

//   return data && <p> {data.govtId} </p>;
// };

export default Winner;
