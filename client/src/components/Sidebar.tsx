import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

interface IChat {
  conversations: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  _id: string;
}

const Sidebar: React.FC = () => {
  const [chats, setChats] = useState<IChat[]>([]);
  const [isOpen, setIsOpen] = useState(false); // State to toggle sidebar visibility on small screens
  const navigate = useNavigate();
  let currentDate: string;
  const initial = async () => {
    try {
      const { data } = await axios.get("/api/chats", {
        withCredentials: true,
      });

      if (data.success) {
        setChats(data.chats);
      }
    } catch (error) {
      console.log("at initial function:", error);
      navigate("/unauthorized");
    }
  };
  const logout = async () => {
    // Open a new window/tab and save its reference
    const newWindow = window.open("http://localhost:3000/logout", "_blank");

    // Wait for a delay (optional) and then close the window
    setTimeout(() => {
      if (newWindow) {
        newWindow.close(); // Close the new window
      }
    }, 3000); // 3 seconds delay before closing
  };
  const sliceText = (text: string = "kya bola ?") => {
    if (text.length > 25) {
      return `${text.slice(0, 25)}...`;
    }
    return text;
  };

  useEffect(() => {
    initial();
  }, []);

  return (
    <div className="relative">
      {/* Toggle Button for Small Screens */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-20 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isOpen ? "Close" : "Menu"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed z-10 top-0 left-0 h-full bg-gray-100 border-r border-gray-300 p-5 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64`}
      >
        {/* Sidebar Header */}
        <h2 className="mb-5 text-2xl font-bold text-center text-gray-800">
          RebyB G-AI
        </h2>

        <button
          onClick={logout}
          className=" w-full bg-red-400  rounded-md text-white p-1"
        >
          Logout
        </button>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {[...chats].reverse().map((ch) => {
            const question = JSON.parse(ch.conversations)[0].parts[0].text;

            let date;
            if (currentDate === new Date(ch.createdAt).toLocaleDateString()) {
              date = "";
            } else {
              currentDate = new Date(ch.createdAt).toLocaleDateString();
              date = new Date(ch.createdAt).toLocaleString();
            }

            return (
              <div key={ch._id} className="border-b border-gray-200 pb-2">
                {/* Date */}
                {date && <p className="text-sm text-gray-500 mb-1">{date}</p>}

                {/* Chat Link */}
                <Link
                  to={`/chat/${ch._id}`}
                  className="block text-gray-700 hover:text-blue-600 hover:underline text-sm font-medium"
                >
                  {sliceText(question)}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-5 text-center text-gray-500 text-sm">
          © 2024 RebyB G-AI
        </div>
      </div>
    </div>

    // <div className="w-64 h-screen bg-gray-100 border-r border-gray-300 p-5 flex flex-col">
    //   {/* Sidebar Header */}
    //   <h2 className="mb-5 text-2xl text-yellow-700 font-bold text-center text-gray-800 ">
    //     RebyB G-AI
    //   </h2>

    //   <button
    //     onClick={logout}
    //     className=" w-full bg-red-400  rounded-md text-white p-1"
    //   >
    //     Logout
    //   </button>

    //   {/* Chat List */}
    //   <div className="flex-1 overflow-y-auto space-y-3">
    //     {[...chats].reverse().map((ch) => {
    //       const question = JSON.parse(ch.conversations)[0].parts[0].text;

    //       let date;
    //       if (currentDate === new Date(ch.createdAt).toLocaleDateString()) {
    //         date = "";
    //       } else {
    //         currentDate = new Date(ch.createdAt).toLocaleDateString();
    //         date = new Date(ch.createdAt).toLocaleString();
    //       }

    //       return (
    //         <div key={ch._id} className="border-b border-gray-200 pb-2">
    //           {/* Date */}
    //           {date && <p className="text-sm text-gray-500 mb-1">{date}</p>}

    //           {/* Chat Link */}
    //           <Link
    //             to={`/chat/${ch._id}`}
    //             className="block text-gray-700 hover:text-blue-600 hover:underline text-sm font-medium"
    //           >
    //             {sliceText(question)}
    //           </Link>
    //         </div>
    //       );
    //     })}
    //   </div>

    //   {/* Footer */}
    //   <div className="mt-5 text-center text-gray-500 text-sm">
    //     © 2024 RebyB G-AI
    //   </div>
    // </div>
  );
};

export default Sidebar;
