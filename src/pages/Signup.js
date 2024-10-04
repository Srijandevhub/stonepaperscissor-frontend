import axios from "axios";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from '../util/api';
import useToast from "../util/useToast";

const Signup = () => {
    const makeToast = useToast();
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSignup = async () => {
        try {
            const res = await axios.post(`${apiUrl}/users/signup`, {
                name: name,
                email: email,
                password: password
            });
            makeToast(res.data.status, res.data.message, res.data.redirect, res.data.redirecturl);
            const focuson = res.data.focusOn;
            if (focuson === "name") {
                nameRef.current.focus();
            } else if (focuson === "email") {
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
                                <h1 className="h3">Sign Up</h1>
                            </div>
                            <div className="card-body bg-secondary-light">
                                <div className="p-2">
                                    <div className="mb-2">
                                        <label className="form-label">Name</label>
                                        <input type="text" ref={nameRef} className="form-control" onChange={(e) => setName(e.target.value)}/>
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label">Email</label>
                                        <input type="email" ref={emailRef} className="form-control" onChange={(e) => setEmail(e.target.value)}/>
                                    </div>
                                    <div className="mb-2 form-password">
                                        <label className="form-label">Password</label>
                                        <input type="password" ref={passwordRef} className="form-control" onChange={(e) => setPassword(e.target.value)}/>
                                    </div>
                                    <div className="mb-2">
                                        <button className="btn btn-primary" onClick={handleSignup}>Sign Up</button>
                                    </div>
                                    <p className="mb-0">Already have account? <Link className="link" to="/signin">Sign In Now</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;