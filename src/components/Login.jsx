import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import  './Login.css';
const Login = () => {
  const navigate = useNavigate();

  const login = async () => {
    try {
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      console.log("User Logged In:", result.user);
      navigate("/editor"); 
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="login-container">
        <h1>Text Editor App</h1>
      <h2>Login Page</h2>
      <button onClick={login}>Login with Google</button>
    </div>
  );
};

export default Login;
