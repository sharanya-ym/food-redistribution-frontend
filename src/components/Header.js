import React from "react";

const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-700">Food Redistribution App</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">Hi, {user?.name}</span>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
