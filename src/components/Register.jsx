import { Popover } from "bootstrap";
import React, { useEffect, useState } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Error from "./Error";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState("");
  const [age, setAge] = useState();
  const [gender, setGender] = useState("Select a gender");
  const bio="I'm a software developer passionate about creating user-friendly applications.";
  const twitter= "";
  const github="";
  const linkedin="";
  const [toastMsg, setToastMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name === "" || email === "" || password === "" || confirmPassword === "") {
      await setToastMsg('All fields are required.');
      return;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setToastMsg('Invalid email format.')
      return;
    }

    if (password.length < 8) {
      setToastMsg("Password must be at least 8 characters long.");
      return;
    }
    if (/\d/.test(name)) {
      setToastMsg('Name should not contain numbers');
      return;
    }
    
    if (/\s/.test(password)) {
      setToastMsg("Password cannot contain spaces.");
      return;
    }

    if (password.toLowerCase().includes(name.toLowerCase())) {
      setToastMsg("Password cannot contain the user's name.");
      return;
    }

    if (!/\d/.test(password) || !/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      setToastMsg("Password must contain at least one uppercase letter, one lowercase letter, and one number.");
      return;
    }

    if (password !== confirmPassword) {
      setToastMsg("Passwords do not match.");
      return;
    }
    if (!/^\d+$/.test(age) || age < 15 || age > 99) {
      setToastMsg("Invalid age. Age must be between 15 and 99.");
      return;
    }
    
    if (toastMsg) {
      setToastMsg('');
    }
    

    // Send the registration request to the server
    try {
      const res = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password,age,gender,location,bio,twitter,linkedin,github }),
      });

      if (res.ok) {
        alert("Registration successful");
        navigate("/");
      } else {
        const error = await res.json();
        setToastMsg(error.msg);
      }
    } catch (error) {
      console.error("Error during registration", error);
      setToastMsg("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    const popoverTrigger = document.getElementById("popoverButton");
    const popover = new Popover(popoverTrigger, {
      trigger: 'focus', // Optional: Automatically show/hide on focus
    });

    // Cleanup on component unmount
    return () => {
      popover.dispose();
    };
  }, []);

  return (
    <div className=" d-flex justify-content-center align-items-center w-100 p-6 m-6 ">
      <div className="w-30 border px-2 py-2 rounded-3 ">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="d-flex flex-column">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Name"
              value={name}
              className="form-control"
              onChange={(e) => setName(e.target.value)}
            />
           
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              id="email"
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Age</label>
            <input
              type="number"
              placeholder="Age"
              value={age}
              id="age"
              className="form-control"
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="floatingSelect" className="form-label">Gender</label>
            <select className="form-select" id="floatingSelect" aria-label="Floating label select example" onChange={(e)=>{setGender(e.target.value)}}>
              <option  value={gender}>Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
             <option value="LGBTQ+">LGBTQ+</option>
            </select>
        </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              type="text"
              placeholder="New York, USA"
              value={location}
              id="location"
              className="form-control"
              onChange={(e) => setLocation(e.target.value)}
            />
            
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="position-relative">
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <button
                id="popoverButton"
                type="button"
                className="position-absolute bg-light top-50 start-95 translate-middle border border-light"
                data-bs-container="body"
                data-bs-toggle="popover"
                data-bs-placement="top"
                data-bs-content="The password must be at least 8 characters long, contain no spaces, and include at least one A-Z, one a-z, and one 0-9."
              >
                <IoMdInformationCircleOutline />
              </button>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              className="form-control"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            
          </div>
          <div className="fs-7">
            <button type="submit" className="btn btn-primary me-2">Register</button>
            <span>
              Already have an account? <a href="/">Login</a>
            </span>
          </div>
        </form>
      </div>
      {toastMsg && <Error message={toastMsg} onClose={setToastMsg} />}
    </div>
  );
};

export default Register;
