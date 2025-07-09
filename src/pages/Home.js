import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      className="h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/images/login.jpg')" }} // ✅ use your login.jpg
    >
      <div className="bg-white bg-opacity-80 rounded-xl p-10 text-center shadow-lg max-w-lg mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Welcome to Food Redistribution App
        </h1>
        <p className="text-gray-600 mb-8">
          Helping providers share surplus food with recipients in need.
        </p>
        <div className="flex justify-center gap-6">
          <Link
            to="/register"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
