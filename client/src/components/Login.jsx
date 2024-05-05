import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login({ setUserData }) {
  const [credentials, setCredentials] = useState({
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

  const login = async (e) => {
    e.preventDefault();
    try {
      if (!username) {
        alert("Please create an account first");
        navigate("/CreateNewAccountPage");
      } else if (username === "" || password === "") {
        alert("Please fill in all fields");
      } else {
        const response = await axios.post("/api/auth/login", { username, password });
        console.log("Response from login:", response.data);
        localStorage.setItem("token", response.data.token);
        setUserData(response.data.student);
        navigate("/Dashboard");
        setData(response.data.message);
      }
    } catch (error) {
      console.log("Error logging in:", error.message);
      setData(error.message);
    }
  };

  const handleNavigateToRegisterNewStudent = () => {
    navigate("/RegisterNewStudent");
  };

  return (
    <>
      <h3>Login</h3>
      <div className="login">
        <div className="login-form">
          <form onSubmit={login}>
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
            <button type="submit" className="login-button">Submit</button>
            <p className="register-option">
              Not registered? 
              <Link to="/RegisterNewStudent" className="link-to-add-new-acct">Create an account</Link> 
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
