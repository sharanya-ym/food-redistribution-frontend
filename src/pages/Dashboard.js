// client/src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

function Dashboard() {
  const [user, setUser] = useState(null);
  const [foodList, setFoodList] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterLocation, setFilterLocation] = useState("");

  const [newFood, setNewFood] = useState({
    name: "",
    quantity: "",
    type: "",
    expiryDate: "",
    location: "",
    contactNumber: "",
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) return (window.location.href = "/login");
    const userData = savedUser.user || savedUser;
    setUser(userData);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchFood();

    if (user.role === "recipient") {
      fetchRequests(user);
    } else if (user.role === "provider") {
      fetchAllRequests(user._id);
    }
  }, [user]);

  const fetchFood = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/food`);
      setFoodList(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch food list:", err);
    }
  };

  const fetchRequests = async (user) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/requests/${user._id}`);
      setMyRequests(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch requests:", err);
    }
  };

  const fetchAllRequests = async (providerId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/requests/provider/${providerId}`);
      setAllRequests(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch provider requests:", err);
    }
  };

  const handleMarkAsDelivered = async (requestId) => {
    try {
      await axios.put(`${BASE_URL}/api/requests/${requestId}/status`, {
        status: "delivered",
      });
      alert("✅ Marked as delivered!");
      fetchAllRequests(user._id);
    } catch (err) {
      alert("❌ Failed to update status");
    }
  };

  const handleFoodChange = (e) => {
    setNewFood({ ...newFood, [e.target.name]: e.target.value });
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/food/add`, {
        ...newFood,
        provider: user._id,
      });

      alert("✅ Food added!");
      setNewFood({
        name: "",
        quantity: "",
        type: "",
        expiryDate: "",
        location: "",
        contactNumber: "",
      });
      fetchFood();
    } catch (err) {
      console.error("❌ Failed to add food:", err);
      alert("❌ Something went wrong: Failed to add food item");
    }
  };

  const handleRequest = async (foodItemId) => {
    try {
      await axios.post(`${BASE_URL}/api/requests/make`, {
        recipient: user._id,
        foodItem: foodItemId,
      });
      alert("✅ Request sent!");
      fetchRequests(user);
    } catch (err) {
      alert("❌ Request failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (!user) {
    return <div className="p-6 text-gray-600">Loading dashboard...</div>;
  }

  const totalRequests = myRequests.length;
  const inProgress = myRequests.filter(req => req.status === "pending" || req.status === "in transit");
  const delivered = myRequests.filter(req => req.status === "delivered");

  return (
    <div className="min-h-screen bg-gray-50 bg-cover bg-center"
      style={{
        backgroundImage: user.role === "provider"
          ? `url('/images/provider.jpg')`
          : `url('/images/recipient.jpg')`,
      }}
    >
      <Header user={user} onLogout={handleLogout} />
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome, {user.name}
        </h2>

        {/* Summary Cards for Recipients */}
        {user.role === "recipient" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-purple-100 text-center py-6 rounded shadow">
              <p className="text-purple-700 font-semibold">Total Requests</p>
              <h2 className="text-3xl font-bold text-purple-900">{totalRequests}</h2>
            </div>
            <div className="bg-orange-100 text-center py-6 rounded shadow">
              <p className="text-orange-700 font-semibold">In Progress</p>
              <h2 className="text-3xl font-bold text-orange-900">{inProgress.length}</h2>
            </div>
            <div className="bg-green-100 text-center py-6 rounded shadow">
              <p className="text-green-700 font-semibold">Delivered</p>
              <h2 className="text-3xl font-bold text-green-900">{delivered.length}</h2>
            </div>
          </div>
        )}

        {/* Provider View */}
        {user.role === "provider" && (
          <>
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">Add Surplus Food</h3>
              <form onSubmit={handleAddFood} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" placeholder="Food Name" value={newFood.name} onChange={handleFoodChange} required className="border border-gray-300 rounded px-4 py-2" />
                <input name="quantity" type="number" placeholder="Quantity" value={newFood.quantity} onChange={handleFoodChange} required className="border border-gray-300 rounded px-4 py-2" />
                <input name="type" placeholder="Type (veg/non-veg)" value={newFood.type} onChange={handleFoodChange} required className="border border-gray-300 rounded px-4 py-2" />
                <input name="expiryDate" type="date" value={newFood.expiryDate} onChange={handleFoodChange} required className="border border-gray-300 rounded px-4 py-2" />
                <input name="location" placeholder="Location" value={newFood.location} onChange={handleFoodChange} required className="border border-gray-300 rounded px-4 py-2" />
                <input name="contactNumber" placeholder="Contact Number" value={newFood.contactNumber} onChange={handleFoodChange} required className="border border-gray-300 rounded px-4 py-2" />
                <button type="submit" className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add Food</button>
              </form>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-orange-700 mb-4">Food Requests</h3>
              {allRequests.length === 0 ? (
                <p className="text-gray-500">No requests yet.</p>
              ) : (
                allRequests.map(req => (
                  <div key={req._id} className="border-l-4 border-orange-500 bg-orange-50 rounded p-3 mb-3 shadow-sm">
                    <p className="font-medium">Food: {req.foodItem?.name || "N/A"}</p>
                    <p className="text-sm text-gray-600">Recipient: {req.recipient?.name || "Unknown"}</p>
                    <p className="text-sm text-gray-600">Status: <span className="font-semibold">{req.status}</span></p>
                    {req.status !== "delivered" && (
                      <button onClick={() => handleMarkAsDelivered(req._id)} className="mt-2 bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700">Mark as Delivered</button>
                    )}
                  </div>
                ))
              )}
            </section>
          </>
        )}

        {/* Recipient View */}
        {user.role === "recipient" && (
          <>
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-green-700 mb-4">Available Food</h3>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2" />
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/4">
                  <option value="all">All Types</option>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                </select>
                <input type="text" placeholder="Filter by location" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/4" />
              </div>

              {foodList
                .filter(item =>
                  item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                  (filterType === "all" || item.type.toLowerCase() === filterType) &&
                  (item.location || "").toLowerCase().includes(filterLocation.toLowerCase())
                )
                .map(item => (
                  <div key={item._id} className="border border-green-200 bg-green-50 rounded p-4 mb-4 shadow-sm">
                    <p className="font-medium text-lg">{item.name} ({item.quantity}) - {item.type}</p>
                    <p className="text-sm text-gray-600">Expires: {new Date(item.expiryDate).toDateString()}</p>
                    <p className="text-sm text-gray-600">Location: {item.location}</p>
                    <p className="text-sm text-gray-600">Contact: {item.contactNumber}</p>
                    <p className="text-sm text-gray-600">Provider: {item.provider?.name || "N/A"}</p>
                    <button onClick={() => handleRequest(item._id)} className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Request</button>
                  </div>
                ))}
            </section>

            <section>
              <h3 className="text-xl font-semibold text-purple-700 mb-4">My Requests</h3>
              {myRequests.length === 0 ? (
                <p className="text-gray-500">No requests made yet.</p>
              ) : (
                myRequests.map(req => (
                  <div key={req._id} className="border-l-4 border-purple-500 bg-purple-50 rounded p-3 mb-3 shadow-sm">
                    <p className="font-medium">{req.foodItem?.name || "N/A"}</p>
                    <p className="text-sm text-gray-600">Requested on: {new Date(req.requestedAt).toLocaleDateString()}</p>
                    <p className="text-sm">Status: <span className="font-semibold text-purple-700">{req.status}</span></p>
                  </div>
                ))
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
