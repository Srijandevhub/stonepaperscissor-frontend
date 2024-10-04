import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewProfile from "./pages/ViewProfile";
import FriendRequests from "./pages/FriendRequests";
import FriendList from "./pages/FriendList";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "./util/api";
import PreLoader from './components/PreLoader';
import Game from "./pages/Game";

const App = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const fetchAccess = async () => {
        try {
          const res = await axios.get(`${apiUrl}/users/protected`);
          if (res.data.status === 200) {
            setAuthenticated(true);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
      fetchAccess();
    }, [])
    if (loading) {
      return <PreLoader />
    }
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={authenticated ? <Navigate to="/dashboard"/> : <Navigate to="/signin"/>}/>
          <Route path="/signin" element={<Signin />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
          <Route path="/dashboard/view-profile/:id" element={<ProtectedRoute><ViewProfile /></ProtectedRoute>}/>
          <Route path="/dashboard/friend-requests" element={<ProtectedRoute><FriendRequests /></ProtectedRoute>}/>
          <Route path="/dashboard/friend-list" element={<ProtectedRoute><FriendList /></ProtectedRoute>}/>
          <Route path="/game/:id" element={<ProtectedRoute><Game /></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    )
}

export default App;