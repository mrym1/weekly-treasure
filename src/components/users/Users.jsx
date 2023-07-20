import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState, useRef } from "react";
import { HiOutlineChevronDown, HiStar } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

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
import { db } from "../../firebase";
import Sidebar from "../sidebar/Sidebar";

const Users = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userOrderBy, setUserOrderBy] = useState('name');
  const dropdownRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setUserOrderBy(option);
    setIsOpen(false);
  };

  ////////////////////////
  const handleClickOpen = () => {
    setOpen(true);
  };

  console.log("userOrderBy", userOrderBy);

  const handleClose = () => {
    setOpen(false);
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
    if (email == null || password == null) {
      {
        return navigate("/login");
      }
    }
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'users'), orderBy(userOrderBy,'desc')),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
        console.log(list)
      },
      (error) => {
        console.log(error);
      }
    );
  
    return () => {
      unsub();
    };
  }, [userOrderBy]);
  
  console.log(data);

  ////////////////////////////
  ////
  ////   Dialogue data
  ////
  //////////////////////////

  const initialState = {
    image: "",
    createdAt: "",
    name: "",
    email: "",
    phone: "", 
    uid: "", 
    winningEmail: "",
    winningName: "",
    govtId: "", 
  };

  // const AddUser = () => {
  const [formData, setFormData] = useState(initialState);
  const [userId, setuserId] = useState(null);


  const handleEdit = (doc) => {
    console.log("edit calling");
    //   setuserId(doc.id);
    console.log(typeof( doc.createdAt));
    if(doc.createdAt===undefined||doc.createdAt===null || doc.createdAt===''){
      formData.createdAt = '-'
     
    }else{
      formData.createdAt = (new Date(
        doc.createdAt.toDate().getTime() -
          doc.createdAt.toDate().getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, -1));
    }
    formData.name = doc.name.toString();
    formData.image = doc.image??'';
    formData.email = doc.email??'';  
    formData.govtId =doc.govtId?? ""; 
    formData.phone = doc.phone??'';
    formData.uid = doc.uid.toString();
    formData.winningEmail = doc.winningEmail??'';
    formData.winningName = doc.winningName??'';
    handleClickOpen();
  };


  const userColumns = [
    {
      field: "image",
      headerName: "Image",
      //   width: 250,
      //   rowHeight: 80,
      renderCell: (params) => {
        return (
          <img
            style={{ width: 50, height: 50 }}
            src={params.row.image || ''}
          />
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      width: 200,
      renderCell: (params) => {
        if (
          params.row.createdAt === "" ||
          params.row.createdAt === null ||
          params.row.createdAt === undefined
        ) {
          return <div>-</div>;
        } else {
          return (
            <div>
              {params.row.createdAt.toDate().toDateString()} <br />
              At {params.row.createdAt.toDate().toLocaleTimeString("en-US")}
            </div>
          );
        }
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 200,
    },
  ];
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div className="viewButton" onClick={() => handleEdit(params.row)}>
              View
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex">
      <div className="fixed h-screen">
        <Sidebar />
      </div>
      <div className=" md:ml-64 ml-6 flex-1 overflow-y-auto">
        <Dialog fullWidth={true} open={open} onClose={handleClose}>
          <DialogTitle>
            <h1>User Detail</h1>
          </DialogTitle>
          <DialogContent>
            <form>
              <div
                className="input-box"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={formData.image}
                  alt="Image"
                  style={{ width: 100, height: 100, borderRadius: "50%" }}
                />
              </div>
              <div className="user-details">
                <div className="input-box">
                  <span className="details">Created Date</span>
                  <input
                    id="createdAt"
                    readOnly
                    value={ formData.createdAt}
                    type="datetime-local"
                  />
                </div>
                <div className="input-box">
                  <span className="details">Name</span>
                  <input id="endAt" value={formData.name} readOnly />
                </div>

                <div className="input-box">
                  <span className="details">Email</span>
                  <input id="fee" value={formData.email} readOnly />
                </div>
                <div className="input-box">
                  <span className="details">Govt Id</span>
                  <input id="prize" value={formData.govtId} readOnly />
                </div>
                <div className="input-box">
                  <span className="details">UID</span>
                  <input id="prize" value={formData.uid} readOnly />
                </div>
                <div className="input-box">
                  <span className="details">Wining Email</span>
                  <input id="prize" value={formData.winningEmail} readOnly />
                </div>
                <div className="input-box">
                  <span className="details">Wining Name</span>
                  <input id="prize" value={formData.winningName} readOnly />
                </div>
              </div>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        <div className="table_header" style={{ marginTop: "40px" }}>
          <h1 className="text-black font-bold mb-4 underline text-4xl">
            Users
          </h1>
          <div className="relative inline-block text-left">
            <button
              type="button"
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={toggleDropdown}
            >
              Order By
              <HiOutlineChevronDown className="ml-1 text-gray-400" />
            </button>

            {isOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 w-40 mt-2 bg-white rounded-md shadow-lg z-10"
              >
                <ul
                  className="py-1 space-y-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <li>
                    <button
                      type="button"
                      className={`${
                        userOrderBy === "Name"
                          ? "bg-gray-100 text-gray-900"
                          : ""
                      } flex items-center justify-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900`}
                      role="menuitem"
                      onClick={() => handleOptionClick("name")}
                    >
                      <span className="mr-2">Name</span>
                      {userOrderBy === "Name" && (
                        <HiStar className="text-yellow-500" />
                      )}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`${
                        userOrderBy === "CreatedAt"
                          ? "bg-gray-100 text-gray-900"
                          : ""
                      } flex items-center justify-center w-full  px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900`}
                      role="menuitem"
                      onClick={() => handleOptionClick("createdAt")}
                    >
                      <span className="mr-2">Created At</span>
                      {userOrderBy === "CreatedAt" && (
                        <HiStar className=" text-yellow-500" />
                      )}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`${
                        userOrderBy === "Email"
                          ? "bg-gray-100 text-gray-900"
                          : ""
                      } flex items-center justify-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900`}
                      role="menuitem"
                      onClick={() => handleOptionClick("email")}
                    >
                      <span className="mr-2">Email</span>
                      {userOrderBy === "Email" && (
                        <HiStar className="mr-1 text-yellow-500" />
                      )}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
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
    </div>
  );
};

export default Users;
