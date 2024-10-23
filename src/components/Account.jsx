import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaMapMarkerAlt, FaTwitter, FaLinkedin, FaGithub, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import Error from './Error';

const Account = () => {
  // State for account information
  const [accountInfo, setAccountInfo] = useState({
    name: 'John Doe',
    age: '30',
    gender: 'male',
    location: 'New York, USA',
    bio: "I'm a software developer passionate about creating user-friendly applications.",
    twitter: 'johndoe',
    linkedin: 'john-doe',
    github: 'johndoe'
  });

  const navigate = useNavigate(); // Navigation hook
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [editedUser, setEditedUser] = useState(accountInfo); // State for edited user info
  const [isChanged, setIsChanged] = useState(false); // State to track if changes were made
  const [toastMsg, setToastMsg] = useState(''); // State for toast messages
  const token = localStorage.getItem('token'); // Retrieve token from local storage

  // Fetch account info on component mount
  useEffect(() => {
    if (!token) {
      navigate('/'); // Redirect if no token found
      return;
    }

    const fetchAccount = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/account`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok) {
          setAccountInfo(data); // Set account info from API response
        } else {
          // Show error message and navigate if fetching fails
          if (data.msg) setToastMsg(data.msg);
          setTimeout(() => {
            navigate('/');
          }, 4000);
        }
      } catch (error) {
        console.error('Error fetching account info', error);
      }
    };

    fetchAccount();
  }, [navigate, token]);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleClose = () => {
    setShowModal(false);
    setIsChanged(false); // Reset change state on close
  };

  const handleShow = () => {
    setEditedUser(accountInfo); // Set edited user to current account info
    setShowModal(true); // Show modal for editing
    setIsChanged(false); // Reset change state
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevUser => ({ ...prevUser, [name]: value })); // Update edited user state
  };

  // Check if the edited user info differs from the original account info
  useEffect(() => {
    setIsChanged(JSON.stringify(accountInfo) !== JSON.stringify(editedUser));
  }, [editedUser, accountInfo]);

  // Handle form submission for updating account
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    const updateAccount = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(editedUser) // Send updated user data
        });
        const data = await res.json();

        if (res.ok) {
          setAccountInfo(data); // Update account info with new data
        } else {
          setToastMsg('Error updating'); // Show error message if update fails
        }
      } catch (error) {
        console.error('Error updating account info', error);
      }
    };

    updateAccount(); // Call update function
    handleClose(); // Close modal after submission
    console.log('Updated user data:', editedUser); // Log updated user data
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>User Dashboard</h1>
        <Button variant="outline-danger" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </Button>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="text-center mb-4">
            <FaUserCircle size={100} className="text-primary mb-3" />
            <h2 className="display-4 mb-0">{accountInfo.name}</h2>
            <p className="text-muted">{accountInfo.age} years old • {accountInfo.gender}</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <p className="lead text-center mb-4">{accountInfo.bio}</p>
              <div className="d-flex justify-content-center align-items-center mb-3">
                <FaMapMarkerAlt className="text-danger me-2" />
                <span>{accountInfo.location}</span>
              </div>
              <div className="d-flex justify-content-center">
                <a href={`https://twitter.com/${accountInfo.twitter}`} className="mx-2" target="_blank" rel="noopener noreferrer">
                  <FaTwitter size={24} className="text-primary" />
                </a>
                <a href={`https://linkedin.com/in/${accountInfo.linkedin}`} className="mx-2" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin size={24} className="text-primary" />
                </a>
                <a href={`https://github.com/${accountInfo.github}`} className="mx-2" target="_blank" rel="noopener noreferrer">
                  <FaGithub size={24} className="text-dark" />
                </a>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <Button variant="primary" onClick={handleShow}>
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAge">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={editedUser.age}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGender">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={editedUser.gender}
                onChange={handleInputChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={editedUser.location}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={editedUser.bio}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTwitter">
              <Form.Label>Twitter</Form.Label>
              <Form.Control
                type="text"
                name="twitter"
                value={editedUser.twitter}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLinkedIn">
              <Form.Label>LinkedIn</Form.Label>
              <Form.Control
                type="text"
                name="linkedin"
                value={editedUser.linkedin}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGitHub">
              <Form.Label>GitHub</Form.Label>
              <Form.Control
                type="text"
                name="github"
                value={editedUser.github}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleSubmit} disabled={!isChanged}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {toastMsg && <Error msg={toastMsg} />}
    </div>
  );
};

export default Account;
