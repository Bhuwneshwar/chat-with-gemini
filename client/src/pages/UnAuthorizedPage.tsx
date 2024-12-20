import React from "react";

const AuthPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">Welcome!</h1>
        <h2 className="mb-5 text-2xl font-bold text-center text-pink-600">
          RebyB G-AI
        </h2>
        <div className="space-x-4">
          {/* Login Button */}
          <a
            href="http://localhost:3000/login"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
          >
            Login
          </a>

          {/* Register Button */}
          <a
            href="http://localhost:3000/register"
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
