import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import { Routes, Route } from "react-router-dom";
import { getLoggedUser } from "./services/user";
import { useState, useEffect } from "react";

interface User {
  name: string;
  username: string;
  email: string;
  following: { id: string }[];
  followed_by: { id: string }[];
}

function AllRoutes() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await getLoggedUser();
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);

  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path={"/profile/:username"} element={<Profile />} />
      <Route path="/signup" element={<SignUp />} />
      <Route index element={<Login />} />
      <Route index element={<Login />} />
    </Routes>
  );
}

export default AllRoutes;
