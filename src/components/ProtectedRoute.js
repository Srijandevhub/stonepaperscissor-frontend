import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../util/api";

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProtected = async () => {
            try {
                const res = await axios.get(`${apiUrl}/users/protected`);
                if (res.data.status === 403) {
                    navigate("/signin");
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchProtected();
    }, [navigate])
    return (
        <>{ children }</>
    )
}

export default ProtectedRoute;