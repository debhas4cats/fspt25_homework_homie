import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login({setUserData}) {
    
    const [ credentials, setCredentials ] = useState({
        username: "",
        password: ""
    });

    const [data, setData] = useState(null);

    const navigate = useNavigate();

    const { username, password } = credentials;

    const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    };

    // LOGIN
    const login = async () => {
        
      if (!username) {
        alert("Please create an account first");
        navigate("/CreateNewAccountPage");
      }  else if (username === "" || password === "") {
        alert("Please fill in all fields");
      } else {
        try {
          const { data } = await axios("/api/auth/login", {
            method: "POST",
            data: credentials,
          });
    
          //store it locally
          localStorage.setItem("token", data.token);
          const userData = data.student;
          setUserData(userData);
          navigate("./Dashboard");
          console.log(data.message, data.token);
          setData(data.message);
        } catch (error) {
          console.log(error);
          setData(error.message);
        }
      };
    }

    // LOGOUT
    const logout = () => {
      //remove the token from local storage
      localStorage.removeItem("token");
      alert("You have been successfully logged out");
    };

    // LINK TO REGISTRATION FORM
    const handleNavigateToRegisterNewStudent = () => { // moves the user to the registration form if they don't have an account
      navigate("./RegisterNewStudent");
    }
    
    return (
    <>
    <h3>Login</h3>
    <div className="login">
      <div className="login-form">
        <form>
        <input
          value={username}
          onChange={handleChange}
          name="username"
          type="text"
          className="form-control mb-2"
          placeholder='username'
          autoComplete='off'
        /> 
        <input
          value={password}
          onChange={handleChange}
          name="password"
          type="password"
          className="form-control mb-2"
          placeholder='password'
          autoComplete='off'
        />
        <button type="button" className="login-button" onClick={login}>Submit</button>
        <p className="register-option">
          Not registered? 
          <br></br>
          <Link to="./RegisterNewStudent" onClick={handleNavigateToRegisterNewStudent} className="link-to-add-new-acct">Create an account</Link> 
        </p>
        </form>
      </div>
      </div>

      {data && (
        <div className="text-center p-4">
          <div className="alert">{data}</div>
        </div>
      )}
    </>
  );
}