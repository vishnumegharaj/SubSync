import React, { useState } from "react";
import "./styles.css";
import Input from "../Input";
import Button from "../Button";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup
} from "firebase/auth";
import { auth, db, provider } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, getRedirectResult, GoogleAuthProvider } from "firebase/auth";

function SignupSigninComponent() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [loginForm, setLoginForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function signupWithEmail(event) {
        setLoading(true);
        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Confirm Password:", confirmpassword);
        // Authenticate the user 
        if (name !== "" && email !== "" && password !== "" && confirmpassword !== "") {
            if (password == confirmpassword) {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        //signed in
                        const user = userCredential.user;
                        console.log("User>>>", user);
                        toast.success("User Created!");
                        setLoading(false);
                        setName("");
                        setPassword("");
                        setEmail("");
                        setConfirmPassword("");
                        createDoc(user);
                        // create a doc with user id as the following id
                        navigate("/dashboard");

                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        toast.error(errorMessage);
                        setLoading(false);
                    });
            } else {
                toast.error("Password and Confirm Password don't match");
                setLoading(false);
            }
        } else {
            toast.error("All fields are mandatory");
            setLoading(false);
        }
    }

    function loginUsingEmail() {
        console.log("Email", email);
        console.log("password", password);
        setLoading(true);
        if (email !== "" && password !== "") {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    toast.success("User Logged In!");
                    console.log("User Logged In", user);
                    setLoading(false);
                    navigate("/dashboard");
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setLoading(false);
                    toast.error(errorMessage);
                });
        }
        else {
            toast.error("All fields are mandatory!");
        }

    }

    async function createDoc(user) {
        //Make sure that the doc with uid doesn't exist 
        //create a doc.
        setLoading(true);
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userData = await getDoc(userRef);
        if (!userData.exists()) {
            const { displayName, email, photoURL } = user;
            const createdAt = new Date();

            try {
                await setDoc(userRef, {
                    name: user.displayName ? user.displayName : name,
                    email: user.email,
                    photoURL: user.photoURL ? user.photoURL : "",
                    createdAt: new Date(),
                });
                toast.success("Doc Created!");
                setLoading(false);
            }

            catch (error) {
                toast.error(error.message);
                console.error("Error creating user document: ", error);
                setLoading(false);
            }
        }

    };



    function googleAuth() {
        setLoading(true);
        try {
            signInWithPopup(auth, provider)
                .then((result) => {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    // The signed-in user info.
                    const user = result.user;
                    // IdP data available using getAdditionalUserInfo(result)
                    // ...
                    console.log("User>>>", user);
                    createDoc(user);
                    setLoading(false);
                    navigate("/dashboard");
                    toast.success("User authenticated!");
                }).catch((error) => {
                    setLoading(false);
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(error.message);
                });
        } catch (e) {
            setLoading(false);
            toast.error(e.message);
        }

    }
    return (
        <>
            {loginForm ? (
                <div className="signup-wrapper">
                    <h2 className="title">
                        Login on <span style={{ color: "var(--theme)" }}>subSync.</span>
                    </h2>
                    <form>

                        <Input
                            type="email"
                            label={"Email"}
                            state={email}
                            setState={setEmail}
                            placeholder={"JohnDoe@gmail.com"}
                        />
                        <Input
                            type="password"
                            label={"Password"}
                            state={password}
                            setState={setPassword}
                            placeholder={"Example@123"}
                        />

                        <Button
                            disabled="loading"
                            text={loading ? "Loading..." : "Login Using Email and Password"}
                            onClick={loginUsingEmail}
                        />
                        <p className="p-login">or</p>
                        <Button
                            onClick={googleAuth}
                            text={loading ? "Loading..." : "Login Using Google"}
                            blue={true}
                        />
                        <p
                            className="p-login"
                            style={{ cursor: "pointer" }}
                            onClick={() => setLoginForm(!loginForm)}
                        >
                            Or Have An Account Already? Click Here
                        </p>
                    </form>
                </div>) :
                (<div className="signup-wrapper">
                    <h2 className="title">
                        Sign Up on <span style={{ color: "var(--theme)" }}>subSync.</span>
                    </h2>
                    <form>
                        <Input
                            label={"Full Name"}
                            state={name}
                            setState={setName}
                            placeholder={"John Doe"}
                        />
                        <Input
                            type="email"
                            label={"Email"}
                            state={email}
                            setState={setEmail}
                            placeholder={"JohnDoe@gmail.com"}
                        />
                        <Input
                            type="password"
                            label={"Password"}
                            state={password}
                            setState={setPassword}
                            placeholder={"Example@123"}
                        />
                        <Input
                            type="password"
                            label={"Confirm Password"}
                            state={confirmpassword}
                            setState={setConfirmPassword}
                            placeholder={"Example@123"}
                        />

                        <Button
                            disabled="loading"
                            text={loading ? "Loading..." : "Signup Using Email and Password"}
                            onClick={signupWithEmail}
                        />
                        <p className="p-login">or</p>
                        <Button
                            onClick={googleAuth}
                            text={loading ? "Loading..." : "Signup Using Google"}
                            blue={true}
                        />
                        <p className="p-login"
                            style={{ cursor: "pointer" }}
                            onClick={() => setLoginForm(!loginForm)}
                        >Or Have An Account Already? Click Here</p>
                    </form>
                </div>)}
        </>
    );
}

export default SignupSigninComponent;
