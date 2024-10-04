import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import avatar from '../assets/images/avatar.png';
import { useRef, useState } from "react";
import axios from "axios";
import { apiUrl, imageUrl } from "../util/api";
import useToast from "../util/useToast";
import Select from "../components/Select";

const Dashboard = () => {
    const makeToast = useToast();
    const [sugesstionList, setSugesstionList] = useState([]);
    const handleFetchSuggestionList = async () => {
        try {
            const res = await axios.get(`${apiUrl}/users/getsuggestions`);
            if (res.data.status === 200) {
                setSugesstionList(res.data.users);
            }
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
                handleFetchSuggestionList();
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
                handleFetchSuggestionList();
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
    const [challengeOptions, setChallengeOPtions] = useState([{ value: "none", label: "-- User --", image: "" }]);
    const [selectedChallenger, setSelectedChanllenger] = useState("none");
    const [challengeRounds, setChallengeRounds] = useState("");
    const handleChallengerChange = (value) => {
        setSelectedChanllenger(value);
    }
    const fetchFriendList = async () => {
        try {
            const res = await axios.get(`${apiUrl}/users/getfriendlist`);
            if (res.data.status === 200) {
                const newOptions = res.data.users.map((el) => {
                    return {
                        value: el._id,
                        label: el.name,
                        image: el.image
                    }
                });
                setChallengeOPtions([...challengeOptions, ...newOptions]);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleCreateGame = async () => {
        try {
            const res = await axios.post(`${apiUrl}/games/creategame`, {
                player2: selectedChallenger,
                rounds: challengeRounds
            });
            if (res.data.status === 200) {
                makeToast(res.data.status, res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const [quickgamecreated, setQuickgamecreated] = useState(false);
    const [quickgameid, setquickgameid] = useState("");
    const [quickgamerounds, setQuickgamerounds] = useState("");
    const quickgameroundRef = useRef();
    const handleCreateQuickgame = async () => {
        try {
            const res = await axios.post(`${apiUrl}/games/createquickgame`, {
                rounds: quickgamerounds
            });
            makeToast(res.data.status, res.data.message);
            if (res.data.status === 200) {
                setquickgameid(res.data.gameid);
                setQuickgamecreated(true);
            } else if (res.data.status === 400 && res.data.isfocus === "quickrounds") {
                quickgameroundRef.current.focus();
            }
        } catch (error) {
            console.log(error);
        }
    }
    const [joingameid, setJoingameid] = useState("");
    const handlejoingame = async () => {
        try {
            const res = await axios.post(`${apiUrl}/games/join/${joingameid}`);
            makeToast(res.data.status, res.data.message, res.data.redirect, res.data.redirecturl);
        } catch (error) {
            console.log(error);
        }
    }
    const handlejoinquickgame = async () => {
        try {
            const res = await axios.post(`${apiUrl}/games/join/${quickgameid}`);
            makeToast(res.data.status, res.data.message, res.data.redirect, res.data.redirecturl);
        } catch (error) {
            console.log(error);
        }
    }
    const handleShareGame = async () => {
        try {
            if (navigator.share) {
                navigator.share({
                    title: "Hey let's have a quick game",
                    text: `Game ID: ${quickgameid}`
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
    useState(() => {
        handleFetchSuggestionList();
        fetchFriendList();
    }, []);
    return (
        <Layout menuactive={"dashboard"}>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xxl-8 col-xl-7">
                        <div className="card mb-4">
                            <div className="card-header bg-primary text-white">
                                <div className="h6 mb-0">Sugesstions</div>
                            </div>
                            <div className="card-body">
                                {
                                    sugesstionList.length > 0 ?
                                    <ul style={{ maxHeight: "200px", overflow: "auto" }}>
                                        {
                                            sugesstionList.map((el, index) => {
                                                return (
                                                    <li key={index}>
                                                        <div className="d-flex align-items-center p-2">
                                                            <i className="profile-avatar">
                                                                <img src={el.image ? `${imageUrl}/uploads/users/${el.image}` : avatar} alt="avatar"/>
                                                            </i>
                                                            <span className="pl-2 flex-grow-1 profile-name text-dark">{el.name}</span>
                                                            <ul className="d-flex align-items-center gap-2">
                                                                <li>
                                                                    <Link to={`/dashboard/view-profile/${el._id}`} className="btn btn-default">
                                                                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                                        <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                                                        <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                                                        </svg>
                                                                    </Link>
                                                                </li>
                                                                {
                                                                    el.hassentrequest ?
                                                                    <li>
                                                                        <button className="btn btn-success" onClick={() => handleAcceptFriendRequest(el._id)} aria-label="accept">
                                                                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11c.889-.086 1.416-.543 2.156-1.057a22.323 22.323 0 0 0 3.958-5.084 1.6 1.6 0 0 1 .582-.628 1.549 1.549 0 0 1 1.466-.087c.205.095.388.233.537.406a1.64 1.64 0 0 1 .384 1.279l-1.388 4.114M7 11H4v6.5A1.5 1.5 0 0 0 5.5 19v0A1.5 1.5 0 0 0 7 17.5V11Zm6.5-1h4.915c.286 0 .372.014.626.15.254.135.472.332.637.572a1.874 1.874 0 0 1 .215 1.673l-2.098 6.4C17.538 19.52 17.368 20 16.12 20c-2.303 0-4.79-.943-6.67-1.475"/>
                                                                            </svg>
                                                                        </button>
                                                                    </li> :
                                                                    <>
                                                                    {
                                                                        el.friendrequestsent ?
                                                                        <li>
                                                                            <button className="btn btn-danger" aria-label="add friend" onClick={() => handleCancelFriendRequest(el._id)}>
                                                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12h4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                                                                </svg>
                                                                            </button>
                                                                        </li>
                                                                        :
                                                                        <li>
                                                                            <button className="btn btn-primary" aria-label="add friend" onClick={() => handleFriendRequest(el._id)}>
                                                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                                                                </svg>
                                                                            </button>
                                                                        </li>  
                                                                    }
                                                                    </>
                                                                }
                                                            </ul>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul> : <p className="mb-0">No Records Found</p>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-xl-5">
                        <div className="card shadow mb-4">
                            <div className="card-header bg-primary text-white">
                                <div className="h6 mb-0">Create Quick Game</div>
                            </div>
                            <div className="card-body">
                                <div className="mb-2">
                                    <label className="form-label">No of rounds</label>
                                    <input className="form-control" onChange={(e) => setQuickgamerounds(e.target.value)} type="text" placeholder="No of rounds" ref={quickgameroundRef}/>
                                </div>
                                <div>
                                    <label className="form-label">Game ID</label>
                                    <div className="form-control">
                                        {quickgameid}
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="d-flex justify-content-end gap-2">
                                    {
                                        quickgamecreated ? <>
                                            <button className="btn btn-success" onClick={() => handlejoinquickgame()}>
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12v4m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM8 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V8m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                                                </svg>
                                                Join
                                            </button>
                                            <button className="btn btn-danger" onClick={() => handleShareGame()}>
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M7.926 10.898 15 7.727m-7.074 5.39L15 16.29M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm12 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0-11a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
                                                </svg>
                                                Share
                                            </button>
                                        </> : <button className="btn btn-primary" onClick={() => handleCreateQuickgame()}>Create</button>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="card shadow mb-4">
                            <div className="card-header bg-primary text-white">
                                <div className="h6 mb-0">Join Quick Game</div>
                            </div>
                            <div className="card-body">
                                <label className="form-label">Game ID</label>
                                <input type="text" className="form-control" onChange={(e) => setJoingameid(e.target.value)}/>
                            </div>
                            <div className="card-footer">
                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-success" onClick={() => handlejoingame()}>
                                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12v4m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM8 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V8m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                                        </svg>
                                        Join
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card shadow mb-4">
                            <div className="card-header bg-primary text-white">
                                <div className="h6 mb-0">Challenge</div>
                            </div>
                            <div className="card-body">
                                <div className="mb-2">
                                    <label className="form-label">No of rounds</label>
                                    <input className="form-control" type="text" value={challengeRounds} onChange={(e) => setChallengeRounds(e.target.value)} placeholder="No of rounds"/>
                                </div>
                                <div>
                                    <label className="form-label">Select Oponent:-</label>
                                    <Select options={challengeOptions} value={selectedChallenger} onChange={handleChallengerChange} hasImage={true}/>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-primary" onClick={() => handleCreateGame()}>Challenge</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard;