import axios from 'axios';
import { useRef, useEffect, useCallback, useState } from "react";

function Auth() {
    const [displaySignup, setDisplaySignup] = useState(true);
    const [signupUsername, setSignupUsername] = useState("");
	const [signupEmail, setSignupEmail] = useState("");
	const [signupPassword, setSignupPassword] = useState("");
	const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

    return (
        <>
            {
                displaySignup
                ? <>
                    <div className="alwayson-tag">AlwaysOn</div>
                    <div className="login-container">
                        <div></div>
                        <div className="auth-topline">Sign Up</div>
                        <div className="auth-input-container">
                            <div className="auth-input-title">Username</div>
                            <input className="auth-input-area" type="text" name="username" placeholder="Set a username." value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} />
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
                            if (signupPassword === signupConfirmPassword) {
                                axios.post("http://159.223.143.90/api/auth/signin", {

                                })
                            }
                        }}>Turn me on</button>
                        <a className="auth-already-tagline">Already have an account?</a>
                    </div>
                </>
                : <></>
            }
        </>
    )
}

export default Auth;