import { Link, useNavigate } from "react-router-dom";
import avatar from '../assets/images/avatar.png';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { apiUrl, imageUrl } from "../util/api";
import useToast from "../util/useToast";

const Layout = ({ children, menuactive, friendrequestCount = 0, friendlistCount = 0 }) => {
    const makeToast = useToast();
    const [showNotificationPane, setShowNotificationPane] = useState(false);
    const [showProfileSettingsPane, setShowProfileSettingsPane] = useState(false);
    const [searchResult, setsearchResult] = useState(false);
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const searchboxRef = useRef();
    const [sidebarShow, setSidebarShow] = useState(true);
    const [reqCount, setReqCount] = useState(friendrequestCount);
    const [listCount, setListCount] = useState(friendlistCount);
    const [notifications, setNotifications] = useState([]);
    const [notificationFlag, setNotificationFlag] = useState(false);
    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${apiUrl}/notifications/getnotifications`);
            if (res.data.status === 200) {
                setNotifications(res.data.notifications);
                setNotificationFlag(res.data.flag);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const fetchLoggedinuserDetails = async () => {
        try {
            const res = await axios.get(`${apiUrl}/users/getloggedinuser`);
            setUser(res.data.user);
        } catch (error) {
            console.log(error);
        }
    }
    const handleLogout = async () => {
        try {
            const res = await axios.post(`${apiUrl}/users/logout`);
            makeToast(res.data.status, res.data.message, res.data.redirect, res.data.redirecturl);
        } catch (error) {
            console.log(error);
        }
    }
    const handleProfileimageupload = async (e) => {
        try {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('image', file);
            const res = await axios.put(`${apiUrl}/users/profileimageupload`, formData, {
                'Content-Type': 'multipart/form-data'
            });
            if (res.data.status === 200) {
                fetchLoggedinuserDetails();
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleRemoveProfilePicture = async () => {
        try {
            const res = await axios.put(`${apiUrl}/users/removeprofilepicture`);
            if (res.data.status === 200) {
                fetchLoggedinuserDetails();
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleDeactivateProfile = async () => {
        try {
            const res = await axios.put(`${apiUrl}/users/deactivateprofile`);
            makeToast(res.data.status, res.data.message, res.data.redirect, res.data.redirecturl);
        } catch (error) {
            console.log(error);
        }
    }
    const handleSearchUser = async (event) => {
        try {
            const searchValue = event.target.value;
            if (searchValue.length > 0) {
                setsearchResult(true);
            } else {
                setsearchResult(false);
                setUsers([]);
                return;
            }
            const res = await axios.post(`${apiUrl}/users/searchusers`, {
                search: searchValue
            });
            if (res.data.status === 200) {
                setUsers(res.data.users);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleClickOutside = (event) => {
        if (searchboxRef.current && !searchboxRef.current.contains(event.target)) {
            setsearchResult(false);
        }
    }
    const navigate = useNavigate();
    const handleMarkReadandRedirect = async (id, redirecturl) => {
        try {
            const res = await axios.put(`${apiUrl}/notifications/markread/${id}`);
            if (res.data.status === 200) {
                navigate(redirecturl);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleNotificationDelete = async (id) => {
        try {
            const res = await axios.delete(`${apiUrl}/notifications/deletenotification/${id}`);
            makeToast(res.data.status, res.data.message);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        const fetchRequestsCounts = async () => {
            try {
                const res = await axios.get(`${apiUrl}/users/getfriendrequestscount`);
                if (res.data.status === 200) {
                    setReqCount(res.data.count);
                }
            } catch (error) {
                console.log(error);
            }
        }
        const fetchListCounts = async () => {
            try {
                const res = await axios.get(`${apiUrl}/users/getfriendlistcount`);
                if (res.data.status === 200) {
                    setListCount(res.data.count);
                }
            } catch (error) {
                console.log(error);
            }
        }
        const handleResize = () => {
            if (window.innerWidth <= 700) {
                setSidebarShow(false);
            } else {
                setSidebarShow(true);
            }
        }
        fetchLoggedinuserDetails();
        fetchRequestsCounts();
        fetchListCounts();
        fetchNotifications();
        const timeoutfetchcounts = setInterval(() => {
            fetchRequestsCounts();
            fetchListCounts();
            fetchNotifications();
        }, 2000);
        handleResize();
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', handleResize);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); 
            window.addEventListener('resize', handleResize);
            clearInterval(timeoutfetchcounts);
        }
    }, []);
    return (
        <>
        <header className="border-bottom position-fixed w-100 top-0 left-0 bg-white">
            <div className="container-fluid">
                <nav className="d-flex justify-content-between py-2">
                    <button className="sidebar-toogler" aria-label="sidebr-toogler" onClick={() => setSidebarShow(true)}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </button>
                    <div className="col-lg-2 col-xl-3 col-lg-4 col-md-5 col-sm-6 col-10 p-0">
                        <div className="position-relative">
                            <input type="text" className="form-control" placeholder="Search" onChange={(e) => handleSearchUser(e)} spellCheck={false}/>
                            {
                                searchResult &&
                                <div ref={searchboxRef} className="position-absolute w-100 left-0 bg-white shadow border-default applicationheader-usersearch border-radius mt-2">
                                    {
                                        users.length > 0 ?
                                        <ul className="p-2">
                                            {
                                                users.map((el, index) => {
                                                    return (
                                                        <Link to={`/dashboard/view-profile/${el._id}`} className="border-radius user-link d-flex align-items-center p-2" key={index}>
                                                            <i className="profile-avatar">
                                                                <img src={el.image ? `${imageUrl}/uploads/users/${el.image}` : avatar} alt="avatar"/>
                                                            </i>
                                                            <span className="pl-2 flex-grow-1 profile-name text-dark">{el.name}</span>
                                                        </Link>
                                                    )
                                                })
                                            }
                                        </ul> : <p className="mb-0 p-2">No Records Found</p>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </nav>
            </div>
        </header>
        <aside className={`application-sidebar position-fixed top-0 vh-100 bg-primary d-flex flex-column ${sidebarShow ? "show": ""}`}>
            <div className="application-sidebar-header">
                <div className="d-flex align-items-center p-2 pb-0">
                    <i className="profile-avatar">
                        <img src={user && user.image ? `${imageUrl}/uploads/users/${user.image}` : avatar} alt="avatar"/>
                    </i>
                    <span className="pl-2 flex-grow-1 profile-name">{user && user.name}</span>
                    <ul className="d-flex align-items-center gap-1 m-0">
                        <li className="profile-settings">
                            <button className="profile-settings position-relative" aria-label="profile-notification" onClick={ () => setShowNotificationPane(true)}>
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z"/>
                                </svg>
                                {notificationFlag && <span className="notification-flag" style={{ width: "5px", height: "5px" }}></span>}
                            </button>
                        </li>
                        <li className="profile-settings" onClick={() => setShowProfileSettingsPane(true)}>
                            <button className="profile-settings" aria-label="profile-settings">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M20 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6h-2m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4"/>
                                </svg>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="p-2 flex-grow-1">
                <ul className="application-sidebar-nav">
                    <li>
                        <Link to="/dashboard" className={`application-sidebar-link ${menuactive === "dashboard" ? "active": ""}`}>
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.143 4H4.857A.857.857 0 0 0 4 4.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 10 9.143V4.857A.857.857 0 0 0 9.143 4Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 20 9.143V4.857A.857.857 0 0 0 19.143 4Zm-10 10H4.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286A.857.857 0 0 0 9.143 14Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z"/>
                            </svg>
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/friend-requests" className={`application-sidebar-link ${menuactive === "friendrequests" ? "active": ""}`}>
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
                            </svg>
                            <span className="flex-grow-1">Friend Requests</span>
                            {
                                reqCount > 0 &&
                                <em className="capsule bg-danger text-white">{reqCount}</em>
                            }
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/friend-list" className={`application-sidebar-link ${menuactive === "friendlist" ? "active": ""}`}>
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                            </svg>
                            <span className="flex-grow-1">Friend List</span>
                            {
                                listCount > 0 &&
                                <em className="capsule bg-info text-white">{listCount}</em>
                            }
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="p-2">
                <button className="btn btn-danger w-100" onClick={() => setSidebarShow(false)}>
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4 4 4"/>
                    </svg>
                    <span>Collapse</span>
                </button>
            </div>
        </aside>
        <div className={`application-menu-slide position-fixed top-0 vh-100 d-flex flex-column ${showNotificationPane ? "show": ""}`}>
            <div className="p-3 bg-primary text-white">
                <h5 className="mb-0">Notification</h5>
            </div>
            <div className="flex-grow-1 bg-white p-2">
                {
                    notifications.length > 0 ?
                    <>
                    {
                        notifications.map((el, index) => {
                            return (
                                <div className="card shadow mb-2" key={index}>
                                    <div className="card-header position-relative">
                                        <strong>{el.notificationtitle}</strong>
                                        {!el.read && <span className="notification-flag"></span>}
                                    </div>
                                    <div className="card-body position-relative">
                                        <p className="mb-0">{el.notificationbody}</p>
                                        <button className="absolute-btn" onClick={() => handleMarkReadandRedirect(el._id, el.redirectlink)} aria-label="notification view"></button>
                                    </div>
                                    <div className="card-footer">
                                        <div className="d-flex align-items-center justify-content-end gap-3">
                                            <button className="btn btn-danger" onClick={() => handleNotificationDelete(el._id)} aria-label="delete notification">
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    </> : <p>No Notifications</p>
                }
            </div>
            <button className="btn btn-primary w-100 border-radius-0" onClick={() => setShowNotificationPane(false)}>
                Close
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4"/>
                </svg>
            </button>
        </div>
        <div className={`slide-menu-backdrop position-fixed w-100 vh-100 top-0 right-0 ${showNotificationPane ? "show": ""}`} onClick={ () => setShowNotificationPane(false)}></div>
        <div className={`application-menu-slide position-fixed top-0 vh-100 d-flex flex-column ${showProfileSettingsPane ? "show": ""}`}>
            <div className="p-3 bg-primary text-white">
                <h5 className="mb-0">Profile</h5>
            </div>
            <div className="flex-grow-1 bg-secondary-light p-2 overflow-y-auto overflow-x-hidden">
                <p className="mb-0"><strong>Profile ID:-</strong></p>
                <p>{user && user._id}</p>
                <p className="mb-0"><strong>Level:-</strong></p>
                <p>{user && user.level}</p>
                <div className="row">
                    <div className="col-12">
                        <div className="custom-image-upload">
                            <img src={user && user.image ? `${imageUrl}/uploads/users/${user.image}` : avatar} alt="avatar" className="custom-image-upload-label"/>
                            <input type="file" accept="image/*" className="custom-image-input" onChange={handleProfileimageupload}/>
                        </div>
                    </div>
                </div>
                <div className="d-flex mt-1 justify-content-end">
                    <button className="link link-danger" onClick={() => handleRemoveProfilePicture()}>Remove</button>
                </div>
            </div>
            <div className="py-1 px-2 bg-secondary-light">
                <button className="btn btn-danger w-100 mb-1" onClick={() => handleDeactivateProfile()}>
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>
                    Deactivate Profile
                </button>
                <button className="btn btn-danger-bordered w-100" onClick={() => handleLogout()}>
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/>
                    </svg>
                    Logout
                </button>
            </div>
            <button className="btn btn-primary w-100 border-radius-0" onClick={() => setShowProfileSettingsPane(false)}>
                Close
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4"/>
                </svg>
            </button>
        </div>
        <div className={`slide-menu-backdrop position-fixed w-100 vh-100 top-0 right-0 ${showProfileSettingsPane ? "show": ""}`} onClick={ () => setShowProfileSettingsPane(false)}></div>
        <main className={`application-main-content d-flex flex-column ${sidebarShow ? "collapse": ""}`}>
            <div className="flex-grow-1 overflow-y-auto">
                { children }
            </div>
            <footer className="py-2 border-top">
                <div className="container-fluid">
                    <h6 className="mb-0 text-center">Designed and developed by Srijan Sinha</h6>
                </div>
            </footer>
        </main>
        </>
    )
}

export default Layout;