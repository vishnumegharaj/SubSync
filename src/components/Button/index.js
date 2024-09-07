import React from "react";
import "./styles.css";
function Button({ text, onClick, blue, disabled }) {
    return (
        <div className={blue ? "btn btn-blue" : "btn"}
            onClick={onClick}
            disabled={disabled}
        >
            {text}  
            {text == "Login Using Google" ? <img width="29" height="29" src="https://img.icons8.com/fluency/48/google-logo.png" alt="google-logo" /> : ""}
            {text == "Signup Using Google" ? <img width="29" height="29" src="https://img.icons8.com/fluency/48/google-logo.png" alt="google-logo" /> : ""}

        </div>
    );
}

export default Button;
