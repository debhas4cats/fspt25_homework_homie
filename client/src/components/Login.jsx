import React, { useState } from 'react';

export default function Login() {
    
    const [ credentials, setCredentials ] = useState({
        username: "",
        password: ""
    });

    const [data, setData] = useState(null);

    const { username, password } = credentials;

    const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    };

    const login = async () => {
        try {
          const { data } = await axios("/api/auth/login", {
            method: "POST",
            data: credentials,
          });
    
          //store it locally
          localStorage.setItem("token", data.token);
          console.log(data.message, data.token);
          setData(data.message);
        } catch (error) {
          console.log(error);
          setData(error.message);
        }
      };



    return (
    <>
    <div className="row gx-5">
      <div className="col col-md-6 offset-md-3">
        <input
          value={username}
          onChange={handleChange}
          name="username"
          type="text"
          className="form-control mb-2"
        /> 
        <input
          value={password}
          onChange={handleChange}
          name="password"
          type="password"
          className="form-control mb-2"
        />
        <button type="button" class="btn btn-primary" onClick={login}>Submit</button>
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