import React, { useState } from 'react';
import axios from 'axios';
import ArgonBox from "components/ArgonBox";
import ArgonTypography from 'components/ArgonTypography';
import ArgonInput from 'components/ArgonInput';
import ArgonButton from 'components/ArgonButton';
import IllustrationLayout from 'layouts/authentication/components/IllustrationLayout';
import Logo from "./Logo.png";
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Import eye icons
const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reEnteredPassword, setReEnteredPassword] = useState('');
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [reEnteredPasswordVisible, setReEnteredPasswordVisible] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'reEnteredPassword') {
      setReEnteredPassword(value);
    }
  };
  
  

  const handleTogglePasswordVisibility = (field) => {
    if (field === 'newPassword') {
      setNewPasswordVisible(!newPasswordVisible);
    } else if (field === 'reEnteredPassword') {
      setReEnteredPasswordVisible(!reEnteredPasswordVisible);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (newPassword !== reEnteredPassword) {
      setMessage('Passwords do not match. Please re-enter.');
      return;
    }

    // Assuming you have a server endpoint to handle password change
    try {
      const response = await axios.post('http://localhost:3003https://testingNewAPI.mplusparking.com/reset_password_submission', {
        email,
        newPassword,
        confirmPassword: reEnteredPassword
      });

      if (response.data.success) {
        setMessage('Password successfully changed!');
        // Redirect to the login page
        window.location.href = '/login';
      } else {
        setMessage('Error changing password. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    }
  };

  const bgImage = "https://images.pexels.com/photos/8684594/pexels-photo-8684594.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  return (
    <IllustrationLayout
      illustration={{
        image: bgImage,
        description: (
          <>
         
            <div className="waviy-container">
                <div className="waviy" style={{ textAlign: "center", marginRight: "0px" }}>
                  <span className="words" style={{ "--i": 1, textAlign: "center",color:'white' }}>
                    M
                  </span>
                  <span className="words" style={{ "--i": 2, textAlign: "center" ,color:'white'}}>
                    A
                  </span>
                  <span className="words" style={{ "--i": 3, textAlign: "center",color:'white' }}>
                    T
                  </span>
                  <span className="words" style={{ "--i": 4, textAlign: "center",color:'white' }}>
                    O
                  </span>
                  <span className="words" style={{ "--i": 5, textAlign: "center" ,color:'white'}}>
                    S
                  </span>
                  <span className="words" style={{ "--i": 6, textAlign: "center" ,color:'white'}}>
                    H
                  </span>
                  <span className="words" style={{ "--i": 7, textAlign: "center" ,color:'white'}}>
                    R
                  </span>
                  <span className="words" style={{ "--i": 8, textAlign: "center", color:'white'}}>
                    E
                  </span>
                  <span className="words" style={{ "--i": 9, textAlign: "center" ,color:'white'}}>
                    E
                  </span>
                  <br></br>
                  <span className="words" style={{ "--i": 10, textAlign: "center",color:'white' }}>
                    I
                  </span>
                  <span className="words" style={{ "--i": 11, textAlign: "center",color:'white' }}>
                    N
                  </span>
                  <span className="words" style={{ "--i": 12, textAlign: "center",color:'white' }}>
                    T
                  </span>
                  <span className="words" style={{ "--i": 13, textAlign: "center",color:'white' }}>
                    E
                  </span>
                  <span className="words" style={{ "--i": 14, textAlign: "center",color:'white' }}>
                    R
                  </span>
                  <span className="words" style={{ "--i": 15, textAlign: "center",color:'white' }}>
                    I
                  </span>
                  <span className="words" style={{ "--i": 16, textAlign: "center",color:'white' }}>
                    O
                  </span>
                  <span className="words" style={{ "--i": 17, textAlign: "center",color:'white' }}>
                    R
                  </span>
                  <span className="words" style={{ "--i": 18, textAlign: "center",color:'white' }}>
                    S
                  </span>
                </div>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>

            <div className="text" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "rgb(46, 27, 6)" }}>
              <div>
                <h4 className="wavy-text" data-text="Building Dreams, Crafting Excellence............" style={{ color: 'white', fontWeight: 'bold' }}>
                  ....Building Dreams, Crafting Excellence....
                </h4>
              </div>
            </div>
          </>
        ),
      }}
    >
      <div style={{ border: "4px solid #0b99e6", padding: "30px", borderRadius: "10px" }}>
        <div className="login_container" style={{ float: "left" }}>
          <img
            src={Logo}
            alt="logo"
            width="250"
            height="100"
            style={{ marginLeft: "10px" }}
            className="d-inline-block align-top"
          />
        </div>
        <ArgonBox component="form" role="form" style={{ fontSize: "20px" }}>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <ArgonTypography variant="h4" fontWeight="bold" color="text">
              Change Password
            </ArgonTypography>
          </div>
          <ArgonBox mb={2}>
            <ArgonInput
              type="email"
              name="email"
              placeholder="Email"
              size="large"
              style={{ fontSize: "20px" }}
              value={email}
              onChange={handleChange}
            />
          </ArgonBox>

          <ArgonBox mb={2}>
            <div style={{ position: 'relative' }}>
              <ArgonInput
                type={newPasswordVisible ? 'text' : 'password'}
                placeholder="New Password"
                size="large"
                name="newPassword"
                style={{ fontSize: '20px' }}
                value={newPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => handleTogglePasswordVisibility('newPassword')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: "#11cdef" 
                }}
              >
                {newPasswordVisible ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </ArgonBox>

          <ArgonBox mb={2}>
            <div style={{ position: 'relative' }}>
              <ArgonInput
                type={reEnteredPasswordVisible ? 'text' : 'password'}
                placeholder="Re-enter Password"
                size="large"
                name="reEnteredPassword"
                style={{ fontSize: '20px' }}
                value={reEnteredPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => handleTogglePasswordVisibility('reEnteredPassword')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: "#11cdef" 
                }}
              >
                {reEnteredPasswordVisible ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </ArgonBox>

          <ArgonBox mt={4} mb={1}>
            <ArgonButton
              color="info"
              size="large"
              fullWidth
              style={{ fontSize: "16px" }}
              onClick={handleSubmit}
            >
              Change Password
            </ArgonButton>
          </ArgonBox>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#007BFF' }}>{message}</p>
        </ArgonBox>
      </div>
    </IllustrationLayout>
  );
};

export default ResetPassword;
