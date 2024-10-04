import Layout from "../components/Layout"
import avatar from '../assets/images/avatar.png';
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl, imageUrl } from "../util/api";
import { useEffect, useState } from "react";
import useToast from "../util/useToast";

const ViewProfile = () => {
    const { id } = useParams();
    const makeToast = useToast();
    const [user, setUser] = useState(null);
    const [allreadyRequested, setAllreadyRequested] = useState(false);
    const [hasSentRequest, setHasSentRequest] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const handleFetchUserDetails2 = async () => {
        try {
            const res = await axios.get(`${apiUrl}/users/${id}`);
            if (res.data.status === 200) {
                setUser(res.data.user);
            }
            setAllreadyRequested(res.data.friendrequestsent);
            setHasSentRequest(res.data.hassentrequest);
            setIsFriend(res.data.isFriend);
        } catch (error) {
            console.log(error);
        }
    }
    const handleFriendRequest = async (id) => {
        try {
            const res = await axios.post(`${apiUrl}/users/sendfriendrequest`, {
                id: id
            });
            makeToast(res.data.status, res.data.message);
            if (res.data.status === 200) {
                handleFetchUserDetails2();
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleCancelFriendRequest = async (id) => {
        try {
            const res = await axios.post(`${apiUrl}/users/cencelfriendrequest`, {
                id: id
            });
            makeToast(res.data.status, res.data.message);
            if (res.data.status === 200) {
                handleFetchUserDetails2();
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleUnfriend = async (id) => {
        try {
            const res = await axios.post(`${apiUrl}/users/unfriend`, {
                id: id
            });
            if (res.data.status === 200) {
                handleFetchUserDetails2();
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
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        const handleFetchUserDetails = async () => {
            try {
                const res = await axios.get(`${apiUrl}/users/get-user/${id}`);
                if (res.data.status === 200) {
                    setUser(res.data.user);
                }
                setAllreadyRequested(res.data.friendrequestsent);
                setHasSentRequest(res.data.hassentrequest);
                setIsFriend(res.data.isFriend);
            } catch (error) {
                console.log(error);
            }
        }
        handleFetchUserDetails();
    }, [id]);
    return (
        <Layout>
            <div className="container">
                <div className="card border-radius shadow">
                    <div className="card-body">
                        <div className="application-viewprofile-image">
                            <img src={user && user.image ? `${imageUrl}/uploads/users/${user.image}` : avatar} alt="avatar"/>
                        </div>
                        <h1>Name: {user && user.name}</h1>
                        <h3>Level: {user && user.level}</h3>
                        {
                            isFriend ?
                            <button className="btn btn-danger" onClick={() => handleUnfriend(id)}>Unfriend</button>
                            :
                            <>
                            {
                                hasSentRequest ?
                                <button className="btn btn-success" onClick={() => handleAcceptFriendRequest(id)}>Accept Friend Request</button>
                                :
                                <>
                                {
                                    allreadyRequested ?
                                    <button className="btn btn-danger" onClick={() => handleCancelFriendRequest(id)}>Cancel Friend Request</button>
                                    :
                                    <button className="btn btn-primary" onClick={() => handleFriendRequest(id)}>Send Friend Request</button>
                                }
                                </>
                            }
                            </>
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ViewProfile;