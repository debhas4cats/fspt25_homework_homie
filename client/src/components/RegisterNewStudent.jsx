import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function newStudent() {
  const navigate = useNavigate();
  const [newStudent, setNewStudent] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    avatar: "",
    password: "",
  });

  const addNewStudent = async () => {
    console.log("This is my new student:", newStudent);
    try {
      const response = await fetch("/api/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      });

      if (response.ok) {
        // LINK TO LOGIN FORM
        navigate("/");
      } else {
        console.error("Failed to add student");
      }
    } catch (error) {
      console.log("Error adding new student", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  //handleSumbit for adding new student input into the addStudent function
  const handleSubmit = (e) => {
    e.preventDefault();
    addNewStudent();
  };

  return (
    <div className="regi-outer">
      <h3 className="regi-title">Registration Form</h3>
      <h5 className="regi-tag">
        Please add your information below to get started.
      </h5>
      <form onSubmit={handleSubmit}>
        <div className="registration-form">
          <ul className="registration-form">
            <li>
              <input
                type="text"
                className="regi-input"
                name="firstname"
                placeholder="First Name"
                onChange={handleChange}
              />
            </li>
            <li>
              <input
                type="text"
                className="regi-input"
                name="lastname"
                placeholder="Last Name"
                onChange={handleChange}
              />
            </li>
            <li>
              <input
                type="text"
                className="regi-input"
                name="email"
                placeholder="Email address"
                onChange={handleChange}
              />
            </li>
            <li>
              <input
                type="text"
                className="regi-input"
                name="username"
                placeholder="Username"
                onChange={handleChange}
              />
            </li>
            <li>
              <input
                type="text"
                className="regi-input"
                name="avatar"
                list="avatar"
                placeholder="Profile Picture"
                onChange={handleChange}
              />
            </li>
            <li>
              <input
                type="text"
                className="regi-input"
                name="password"
                list="password"
                placeholder="Password"
                onChange={handleChange}
              />
            </li>
          </ul>
        </div>
        <div>
          <Link to="/" className="link-to-login">
            Oops, I have an account.
          </Link>
        </div>
        <div className="new-acct-submit-iconbutton">
          <h5>
            Make sure your password is secure - don't share it with anyone else!
          </h5>
          <button
            className="register-button"
            type="submit"
            onClick={handleSubmit}
          >
            Register
          </button>
        </div>
        <div>
          <Link to="/" className="link-to-login">
            Oops, I have an account.
          </Link>
        </div>
        <div className="new-acct-submit-iconbutton">
          <h5>
            Make sure your password is secure - don't share it with anyone else!
          </h5>
          <button name="submit" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
