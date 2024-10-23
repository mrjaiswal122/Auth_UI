import React, { useState } from "react"; // Import React and useState hook
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { RiLockPasswordLine } from "react-icons/ri"; // Import password icon
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"; // Import visibility icons
import Error from "./Error"; // Import Error component for displaying messages

const Login = () => {
  // State to store user email input
  const [email, setEmail] = useState("");
  
  // State to store user password input
  const [password, setPassword] = useState("");
  
  // State to toggle password visibility
  const [visibility, setVisibility] = useState(false);
  
  // State to store error or toast messages for user feedback
  const [toastMsg, setToastMsg] = useState('');
  
  // Initialize the navigate function for redirecting after login
  const navigate = useNavigate();

  // Function to toggle password visibility
  const handleVisibility = () => {
    // Toggle the visibility state between true and false
    setVisibility(prev => !prev);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Check if email or password fields are empty
    if (!email || !password) {
      // Set a message if credentials are missing
      setToastMsg('Please provide credentials.');
      return; // Exit the function if validation fails
    }

    try {
      // Make a POST request to the login endpoint with email and password
      const response = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Parse the JSON response
      const data = await response.json();

      // Check if a token was returned (indicating successful login)
      if (data.token) {
        // Store the token in localStorage for authentication
        localStorage.setItem("token", data.token);
        // Navigate to the account page after successful login
        navigate("/account");
      } else {
        // Set a message if login credentials are invalid
        setToastMsg('Invalid credentials.');
      }
    } catch (error) {
      // Log any error that occurs during the fetch request
      console.error("Error during login", error);
      // Set a generic error message for the user
      setToastMsg('An error occurred. Please try again.');
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="w-30 border px-2 py-2 rounded-3">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}> {/* Bind handleSubmit to form submission */}
          {/* Email Input */}
          <div className="input-group mb-3">
            <span className="input-group-text">@</span> {/* Prefix for email input */}
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)} // Update email state on change
              />
              <label htmlFor="email">Email</label>
            </div>
          </div>
          
          {/* Password Input */}
          <div className="input-group mb-3">
            <span className="input-group-text">
              <RiLockPasswordLine /> {/* Icon for password input */}
            </span>
            <div className="form-floating position-relative">
              <input
                type={visibility ? 'text' : 'password'} // Toggle input type based on visibility
                className="form-control"
                id="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)} // Update password state on change
              />
              <div 
                className="position-absolute top-50 start-95 translate-middle"
                onClick={handleVisibility} // Toggle visibility on click
                style={{ cursor: "pointer" }} // Change cursor to pointer for visual feedback
              >
                {visibility ? <FaRegEye /> : <FaRegEyeSlash />} {/* Show appropriate icon based on visibility state */}
              </div>
              <label htmlFor="password">Password</label>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="fs-7 text">
            <button type="submit" className="btn btn-primary me-2">
              Login
            </button>
            <span>
              Don't have an account? <a href="/register">Register</a>
            </span>
          </div>
        </form>
      </div>
      
      {/* Display error message if toastMsg is set */}
      {toastMsg && <Error message={toastMsg} onClose={() => setToastMsg('')} />}
    </div>
  );
};

export default Login;
