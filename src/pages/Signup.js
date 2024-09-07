import React from "react";
import Header from "../components/Header";
import SignupSigninComponent from "../components/SignupSignin";
import "../styles/styles.css";

function Signup() {
    return (
        <div className="signup-container" >
            <Header />
            <div className="wrapper">
                <SignupSigninComponent />
            </div>
        </div>
    );
}

export default Signup;
