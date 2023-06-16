import {
    collection,
    onSnapshot
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase";
// import "../HomePage/datatable.css";

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
      renderCell: Profile
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
     
    </div>
  );
};

export default Quizdetails;
