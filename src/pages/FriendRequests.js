import { useEffect, useState } from "react";
import Layout from "../components/Layout"
import axios from "axios";
import { apiUrl, imageUrl } from "../util/api";
import avatar from '../assets/images/avatar.png';
import useToast from "../util/useToast";

const FriendRequests = () => {
    const [users, setUsers] = useState([]);
    const [requestCount, setRequestCount] = useState(0);
    const makeToast = useToast();
    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${apiUrl}/users/getfriendrequests`);
            if (res.data.status === 200) {
                setUsers(res.data.users);
                setRequestCount(res.data.count);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleAcceptFriendRequest = async (id) => {
        try {
            const res = await axios.post(`${apiUrl}/users/acceptrequest`, {
                id: id
            });
            makeToast(res.data.status, res.data.message);
            if (res.data.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchUsers();
        const interval = setInterval(() => {
            fetchUsers();
        }, 2000);
        return () => {
            clearInterval(interval);
        }
    }, [])
    return (
        <Layout menuactive={"friendrequests"} friendrequestCount={requestCount}>
            <div className="container-fluid">
                {
                    users.length > 0 ?
                    <div className="row">
                        {
                            users.map((el, index) => {
                                return (
                                    <div className="col-xxl-3 col-lg-4 col-md-6 col-sm-12" key={index}>
                                        <div className="card shadow mb-3">
                                            <div className="card-header">
                                                <p className="mb-0">ID: <strong>{el._id}</strong></p>
                                            </div>
                                            <div className="card-body">
                                                <div className="d-flex align-items-center">
                                                    <i className="profile-avatar">
                                                        <img src={el.image ? `${imageUrl}/uploads/users/${el.image}` : avatar} alt="avatar"/>
                                                    </i>
                                                    <div className="flex-grow-1 pl-2">
                                                        <h6 className="mb-0">{el.name}</h6>
                                                        <p className="mb-0">Level: {el.level}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-footer">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <button className="btn btn-success" onClick={() => handleAcceptFriendRequest(el._id)}>Accept Request</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div> : <p>No Friendrequests Found</p>
                }
            </div>
        </Layout>
    )
}
export default FriendRequests;