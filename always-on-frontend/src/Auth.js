import axios from 'axios';
import { useRef, useEffect, useCallback, useState } from "react";

function Auth({ setToken }) {
    const [displaySignup, setDisplaySignup] = useState(true);
    const [signupUsername, setSignupUsername] = useState("");
	const [signupEmail, setSignupEmail] = useState("");
	const [signupPassword, setSignupPassword] = useState("");
	const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
    const [signupErrorMsg, setSignupErrorMsg] = useState("");
    const signupUsernameRef = useRef();

    const [loginUsername, setLoginUsername] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
    const [loginErrorMsg, setLoginErrorMsg] = useState("");
    const loginUsernameRef = useRef();

    useEffect(() => {
        window.electronAPI.setSize({ width: 430, height: 800 });

        signupUsernameRef.current.focus();
    }, []);

    return (
        <>
            {
                displaySignup
                ? <>
                    <div className="alwayson-tag">AlwaysOn</div>
                    <div className="signup-container">
                        <div></div>
                        <div className="auth-topline">Sign Up</div>
                        <div className="auth-error-msg">{signupErrorMsg}</div>
                        <div className="auth-input-container">
                            <div className="auth-input-title">Username</div>
                            <input className="auth-input-area" type="text" name="username" placeholder="Set a username." value={signupUsername} ref={signupUsernameRef} onChange={(e) => setSignupUsername(e.target.value)} />
                        </div>
                        <div className="auth-input-container">
                            <div className="auth-input-title">Email</div>
                            <input className="auth-input-area" type="text" name="email" placeholder="Enter your email." value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                        </div>
                        <div className="auth-input-container">
                            <div className="auth-input-title">Password</div>
                            <input className="auth-input-area" type="password" name="password" placeholder="Set a password." value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                        </div>
                        <div className="auth-input-container">
                            <div className="auth-input-title">Confirm password</div>
                            <input className="auth-input-area" type="password" name="confirm-password" placeholder="Re-type that password." value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} />
                        </div>
                        <button className="auth-submit-btn" onClick={() => {
                            setSignupErrorMsg("");
                            if (signupUsername && signupEmail && signupPassword && signupConfirmPassword) {
                                if (signupPassword === signupConfirmPassword) {
                                    axios.post("http://159.223.143.90/api/auth/signup", {
                                        username: signupUsername,
                                        email: signupEmail,
                                        password: signupPassword
                                    })
                                    .then(resp => {
                                        axios.post("http://159.223.143.90/api/auth/signin", {
                                            username: signupUsername,
                                            password: signupPassword
                                        })
                                        .then(resp => {
                                            setSignupUsername("");
                                            setSignupEmail("");
                                            setSignupPassword("");
                                            setSignupConfirmPassword("");
                                            localStorage.setItem("accessToken", resp.data.accessToken);
                                            setToken(resp.data.accessToken);
                                        })
                                    })
                                    .catch(err => {
                                        setSignupErrorMsg("Sign up failed. Try again.")
                                    })
                                } else {
                                    setSignupErrorMsg("Passwords do not match.")
                                }
                            } else {
                                setSignupErrorMsg("Please fill out all fields.")
                            }
                        }}>Turn me on</button>
                        <a className="auth-already-tagline" onClick={() => {
                            setDisplaySignup(false);
                            setSignupUsername("");
                            setSignupEmail("");
                            setSignupPassword("");
                            setSignupConfirmPassword("");
                            setSignupErrorMsg("");
                        }}>Already have an account?</a>
                    </div>
                </>
                : <>
                <div className="alwayson-tag">AlwaysOn</div>
                <div className="login-container">
                    <div></div>
                    <div className="auth-topline">Log In</div>
                    <div className="auth-error-msg">{loginErrorMsg}</div>
                    <div className="auth-input-container">
                        <div className="auth-input-title">Username</div>
                        <input className="auth-input-area" type="text" name="username" placeholder="Enter your username." value={loginUsername} ref={loginUsernameRef} onChange={(e) => setLoginUsername(e.target.value)} />
                    </div>
                    <div className="auth-input-container">
                        <div className="auth-input-title">Password</div>
                        <input className="auth-input-area" type="password" name="password" placeholder="Enter your password." value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                    </div>
                    <button className="auth-submit-btn" onClick={() => {
                        setLoginErrorMsg("");
                        if (loginUsername && loginPassword) {
                            axios.post("http://159.223.143.90/api/auth/signin", {
                                username: loginUsername,
                                password: loginPassword
                            })
                            .then(resp => {
                                setLoginUsername("");
                                setLoginPassword("");
                                localStorage.setItem("accessToken", resp.data.accessToken);
                                setToken(resp.data.accessToken);
                            })
                        } else {
                            setLoginErrorMsg("Please fill out all fields.")
                        }
                    }}>I'm back</button>
                    <a className="auth-already-tagline" onClick={() => {
                        setDisplaySignup(true);
                        setLoginUsername("");
                        setLoginPassword("");
                        setLoginErrorMsg("");
                    }}>Don't have an account?</a>
                </div>
            </>
            }
        </>
    )
}

export default Auth;