import Box from '@mui/material/Box';
import { DataGrid } from "@mui/x-data-grid";
import {
  collection,
  doc,
  onSnapshot
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase";
import "../HomePage/datatable.css";

const Quizdetails = () => {

  const [data, setData] = useState([]);      


  const navigate = useNavigate();
  const { id } = useParams();


 

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, `quiz/${id}/history`),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
        console.log(data)
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
      width:250
    },
    {
      field: "Image",
      headerName: "Image",
      width: 100,
      renderCell:UserDetails()
    },
    
  ];
  const actionColumn = [
    {
      field: "See Response",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
                <td>
                  <button >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                </td>
        );
      },
    },
  ];
  return (
    <div  className="table">
      <div className="page_header">
        <h1>Hostory</h1>
        </div> 

      <div className="table_header">
        <h3>History</h3>
      </div>
      <Box sx={{ width: '100%' }}>
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
const UserDetails = (props) => {
  const { userId } = props;
  const [data, setData] = useState(null);      

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, `users/${userId}`),
      (snapShot) => {
        setData(snapShot.data())

        console.log(snapShot.data())
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
    (data &&  <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />)
  );
};

export default Quizdetails;
