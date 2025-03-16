import { collection, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { db } from "./firebase";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";
import { FaUsers, FaChevronDown, FaChevronUp } from "react-icons/fa";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);
      const usersData = userSnapshot.docs.map((doc) => doc.data());
      setUsers(usersData);
    };

    getUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsSidebarOpen(false); // Close sidebar when a user is selected
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-100 max-w-[1400px] w-full mx-auto">
      {/* Mobile Users Dropdown Button */}
      <div className="md:hidden bg-white shadow p-3 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <FaUsers />
          Users
          {isSidebarOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* Sidebar: Shows always on desktop, toggles on mobile */}
      <div
        className={`bg-white md:w-[350px] w-full absolute md:relative z-10 md:block transition-all duration-300 ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      >
        <Sidebar users={users} onUserClick={handleUserClick} selectedUser={selectedUser} />
      </div>

      {/* Main Content */}
      <div className="bg-slate-300 flex-1 w-full">
        <MainContent selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default Home;
