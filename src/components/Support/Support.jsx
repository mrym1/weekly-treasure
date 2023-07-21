import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState, useRef } from "react";
import { HiOutlineChevronDown, HiStar } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import Sidebar from "../sidebar/Sidebar";

const Support = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userOrderBy, setUserOrderBy] = useState("name");
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close the dropdown when clicking outside
  // useEffect(() => {
  //   const handleOutsideClick = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleOutsideClick);

  //   return () => {
  //     document.removeEventListener("mousedown", handleOutsideClick);
  //   };
  // }, []);

  // const toggleDropdown = () => {
  //   setIsOpen(!isOpen);
  // };

  // const handleOptionClick = (option) => {
  //   setUserOrderBy(option);
  //   setIsOpen(false);
  // };

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
    setLoading(true);

    const unsub = onSnapshot(
      collection(db, "support"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
        setLoading(false);
        console.log(list);
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  console.log(data);

  ////////////////////////////
  ////
  ////   Dialogue data
  ////
  //////////////////////////

  const initialState = {
    id: "",
    createdAt: "",
    name: "",
    query: "",
  };

  // const AddUser = () => {
  const [formData, setFormData] = useState(initialState);
  const [userId, setuserId] = useState(null);

  const handleEdit = (doc) => {
    console.log("edit calling");
    //   setuserId(doc.id);
    formData.id = doc.id.toString();
    formData.name = doc.name ?? "";
    formData.query = doc.query ?? "";
    handleClickOpen();
  };

  const userColumns = [
    {
      field: "id",
      headerName: "ID",
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
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "query",
      headerName: "Query",
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
            <h1>Support Detail</h1>
          </DialogTitle>
          <DialogContent>
            <form>
              <div className="user-details">
                <div className="input-box">
                  <span className="details">ID</span>
                  <input id="name" value={formData.id} readOnly />
                </div>
                <div className="input-box">
                  <span className="details">Created Date</span>
                  <input
                    id="createdAt"
                    readOnly
                    value={formData.createdAt}
                    type="datetime-local"
                  />
                </div>
                <div className="input-box">
                  <span className="details">Name</span>
                  <input id="name" value={formData.name} readOnly />
                </div>

                <div className="input-box">
                  <span className="details">Query</span>
                  <input id="email" value={formData.query} readOnly />
                </div>
              </div>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        {loading ? (
          <Loader />
        ) : (
          <div>
            <div className="table_header" style={{ marginTop: "40px" }}>
              <h1 className="text-black font-bold mb-4 underline text-4xl">
                Support
              </h1>
              {/* <div className="relative inline-block text-left">
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
              </div> */}
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
        )}
      </div>
    </div>
  );
};

export default Support;
