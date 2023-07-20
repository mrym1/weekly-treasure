import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import axios from "axios";
import Loader from "../Loader/Loader";

const Notification = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [pageloading, setPageloading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageloading(false);
    }, 1000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("add new calling");
    setLoading(true);
    try {
      axios
        .post(
          "https://us-central1-weekly-treasure-4c3b5.cloudfunctions.net/globalNotification",
          {
            title: `${title}`,
            body: `${body}`,
          },
          {
            headers: {
              "Access-Control-Allow-Headers": "*",
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((response) => {
          console.log(response);
          setTitle("");
          setBody("");
        });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      {pageloading ? (
        <div className="w-full flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="w-full">
          <div className=" text-gray-900">
            <div className="flex items-center h-screen">
              <div className="w-full bg-white rounded shadow-lg p-8 m-4 md:max-w-sm md:mx-auto">
                {/* <div className="flex justify-center items-center">
                <span className="text-3xl mb-4 font-bold">Notification</span>
              </div> */}
                <form className="mb-4" action="/" method="post">
                  <h1 className="text-xl font-semibold mb-4">Notification</h1>
                  <div className="mb-4 md:w-full">
                    <input
                      className="w-full border rounded p-2 outline-none focus:shadow-outline"
                      type="title"
                      name="title"
                      id="title"
                      placeholder="Notification Title"
                      value={title}
                      autoComplete="off"
                      required
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-6 md:w-full">
                    <input
                      className="w-full border rounded p-2 outline-none focus:shadow-outline"
                      type="body"
                      name="body"
                      id="body"
                      placeholder="Notification Body"
                      value={body}
                      autoComplete="off"
                      required
                      onChange={(e) => setBody(e.target.value)}
                    />
                  </div>
                  {error && (
                    <p className="text-red-600 text-center py-1">{error}</p>
                  )}
                  <button
                    className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-4 py-2 w-full rounded-md duration-500 hover:bg-cyan-500"
                    disabled={loading}
                    onClick={handleSubmit}
                  >
                    {loading ? "Loading..." : "Send"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
