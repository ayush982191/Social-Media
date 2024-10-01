import React from "react";
import {
  Heart,
  Home,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  LogOut
} from "lucide-react";
import { showFailureToast, showSuccessToast } from "../utils/functions";
import axios from "axios";
import { localUrl } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const sidebarItems = [
  { icon: <Home />, text: "Home" },
  { icon: <Search />, text: "Search" },
  { icon: <TrendingUp />, text: "Explorer" },
  { icon: <MessageCircle />, text: "Messages" },
  { icon: <Heart />, text: "Notification" },
  { icon: <PlusSquare />, text: "Create" },
  { icons : <LogOut />, text : "Logout" }
];

const LeftSidebar = () => {
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${localUrl}/api/v1/user/logout`, {
        withCredentials: true
      });
  
      if (res.data.success) {
        showSuccessToast(res?.data?.message);
          setTimeout(() => {
          navigate("/login");
        }, 500);
      }
    } catch (error) {
      showFailureToast(error?.response?.data?.message);
    }
  };
  
  const sideBarHandler = (textType)=>{
    // alert(textType)
    switch(textType.toLowerCase()){
      case "logout" : logoutHandler();
      break;
    }

  }


  return (
    <div className="fixed top-0 left-0 h-screen w-[16%] bg-gray-100 border-r border-gray-300 z-10 px-4 py-6">
      <div className="flex flex-col space-y-8">
        {/* Logo Section */}
        <div className="text-2xl font-bold text-gray-800">LOGO</div>
        
        {/* Sidebar Menu Items */}
        <div className="flex flex-col space-y-4">
          {sidebarItems.map((item, idx) => (
            <div
              onClick={()=>sideBarHandler(item.text)}
              key={idx}
              className="flex items-center gap-4 p-3 text-gray-600 hover:bg-gray-200 hover:text-black transition duration-300 cursor-pointer rounded-lg"
            >
              <div className="text-xl">{item.icon}</div>
              <p className="text-lg">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default LeftSidebar;
