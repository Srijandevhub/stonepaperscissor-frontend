import axios from "axios";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../util/api";
import useToast from "../util/useToast";
axios.defaults.withCredentials = true;
const Signin = () => {
    const makeToast = useToast();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [email, setEmail] = useState("");
    const [password, SetPassword] = useState("");
    const handleLogin = async () => {
        try {
            const res = await axios.post(`${apiUrl}/users/login`, {
                email: email,
                password: password
            });
            makeToast(res.data.status, res.data.message, res.data.redirect, res.data.redirecturl);
            const focuson = res.data.focusOn;
            if (focuson === "email") {
                emailRef.current.focus();
            } else if (focuson === "password") {
                passwordRef.current.focus();
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="d-flex vh-100 align-items-center justify-content-center">
            <div className="container w-100">
                <div className="row justify-content-center">
                    <div className="col-lg-4 col-md-5 col-sm-6">
                        <div className="card shadow">
                            <div className="card-header">
                                <h1 className="h3">Sign In</h1>
                            </div>
                            <div className="card-body bg-secondary-light">
                                <div className="p-2">
                                    <div className="mb-2">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" ref={emailRef} onChange={(e) => setEmail(e.target.value)}/>
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label">Password</label>
                                        <input type="password" className="form-control" ref={passwordRef} onChange={(e) => SetPassword(e.target.value)}/>
                                    </div>
                                    <div className="mb-2">
                                        <button className="btn btn-primary" onClick={() => handleLogin()}>Sign In</button>
                                    </div>
                                    <p className="mb-0">Don't have account <Link className="link" to="/signup">Create new</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signin;