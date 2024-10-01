import { useEffect, useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import axios from "axios";
import { localUrl } from "../utils/constants";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showFailureToast, showSuccessToast } from "../utils/functions";
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [detail, setDetails] = useState({
    email: "",
    password: "",
  });
  
  const handleChange = (e) => {
    setDetails((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try { 
      const response = await axios.post(
        `${localUrl}/api/v1/user/login`,
        detail,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      // console.log("response coming is ", response);

      if (response.data.success) { 
        setDetails({
          email: "",
          password: "",
        });
        showSuccessToast("Login Successfully"); 
        navigate("/");  
      }
    } catch (error) { 
      showFailureToast(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">LOGO</h1>
          <p className="text-gray-600">
            Signup to see photos & videos from your friends
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="text-left block text-gray-700 font-medium mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={detail.email}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label
              className="text-left block text-gray-700 font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={detail.password}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              onChange={handleChange}
            />
          </div>

          {
            loading ?  <div className="flex justify-center" ><Loader/></div> :
            <button
              type="submit"
              className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300"
            >
              Login
            </button>
          }

          <div className="mt-2">
            <span className="">
              Doesn't have an account{" "}
              <Link to={"/signup"} className="text-blue-500">
                Signup
              </Link>
            </span>
          </div>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Login;
