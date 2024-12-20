import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-9xl font-extrabold text-blue-600 tracking-widest">
        404
      </h1>
      <div className="bg-blue-600 text-white px-4 py-2 rounded rotate-12 absolute">
        Page Not Found
      </div>

      <p className="mt-10 text-lg text-center text-gray-600">
        Sorry, the page you're looking for doesn't exist.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md transition-all duration-300"
      >
        Go Home
      </button>

      <div className="mt-16">
        <img
          src="https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif"
          alt="Lost in Space"
          className="w-48 rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default NotFoundPage;
