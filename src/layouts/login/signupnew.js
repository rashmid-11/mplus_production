import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";
import axios from "axios";
import Logo from "./image.png";
import video from '../../assets/images/backgroundvideo2.mp4';
import { Input, FormGroup, Label, Input as BootstrapInput } from "reactstrap";
import "./Login.css";

function SignUpnew() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
 
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  
  const [error, setError] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !userName.trim() || !mobileNo.trim()) {
      setError("Please fill in all the required fields.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3005https://testingNewAPI.mplusparking.com/save-hr-data', {
        userName,
        email,
        mobileNo,
        password,
        gender,
        birthDate
    
      });

      if (response.status === 200) {
        //console.log('Signup successful!');
        navigate("/login");
      } else {
        setError('Signup failed: ' + response.data.message);
      }
    } catch (error) {
      //console.error('Error during signup:', error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="login-page d-flex align-items-center" style={{ overflowY: 'auto' }}>
      <video autoPlay muted loop className="bg-video">
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="container">
        <div className="row d-flex justify-content-center" style={{ marginTop: '15px' }}>
        <div className="bordered-div col-lg-4 col-10 ">

            <div className="login_container d-flex justify-content-center" >
              <img
                src={Logo}
                alt="logo"
                width="250"
                height="100%"
                className="logo d-inline-block align-top d-flex justify-content-center"
              />
            </div>

            <ArgonBox component="form" role="form" style={{ fontSize: "20px", padding: '10px' }} onSubmit={handleSignup} >
              <div className="text-dark" style={{ marginBottom: "20px", textAlign: "center" }}>
                <ArgonTypography variant="h3" fontWeight="bold">
                  <span className="text-dark">Sign Up</span>
                </ArgonTypography>
                <div className="text-dark" style={{ fontSize: "16px", marginTop: "10px" }}>
                  Enter your details to create a new account
                </div>
              </div>
            
                  <ArgonBox mb={2}>
                    <Input
                      type="text"
                      placeholder="User Name"
                      style={{ background: 'transparent' }}
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}

                    />
                  </ArgonBox>
                  <ArgonBox mb={2}>
                    <Input
                      type="email"
                      placeholder="Email"
                      style={{ backgroundColor: 'transparent' }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </ArgonBox>
                  <ArgonBox mb={2}>
                    <Input
                      type="password"
                      placeholder="Password"
                      style={{ background: 'transparent' }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </ArgonBox>
                  <ArgonBox mb={2}>
                    <FormGroup>

                      <BootstrapInput
                        type="select"
                        id="genderSelect"
                        style={{ background: 'transparent' }}
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </BootstrapInput>
                    </FormGroup>
                  </ArgonBox>

                  <ArgonBox >
                    <Input
                      type="text"
                      placeholder="Mobile No"
                      style={{ background: 'transparent' }}
                      value={mobileNo}
                      onChange={(e) => setMobileNo(e.target.value)}
                    />
                  </ArgonBox>
   
                  <ArgonBox mb={2}>
                    <Label style={{fontSize:'15px',color:'#0d0d0d'}}>Date of Birth</Label>
                    <Input
                      type="date"
                      placeholder="Birth Date"
                      style={{ background: 'transparent' }}
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </ArgonBox>            

              {error && (
                <ArgonBox mt={2} mb={2}>
                  <ArgonTypography color="error" textAlign='center' sx={{ fontSize: "18px" }}>{error}</ArgonTypography>
                </ArgonBox>
              )}

              <ArgonBox mt={3} mb={1}>
                <ArgonButton
                  color="primary"
                  fullWidth
                  style={{ fontSize: "16px" }}
                  type="submit"
                >
                  Sign Up
                </ArgonButton>
              </ArgonBox>

              <ArgonBox mt={2} textAlign="center">
                <ArgonTypography
                  variant="button"
                  color="text"
                  fontWeight="regular"
                  style={{ fontSize: "15px" }}
                >
                  Already have an account?{" "}
                  <ArgonTypography
                    component={Link}
                    to="/login"
                    variant="button"
                    color="primary"
                    fontWeight="medium"
                    style={{ fontSize: "15px" }}
                  >
                    Sign In
                  </ArgonTypography>
                </ArgonTypography>
              </ArgonBox>
            </ArgonBox>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpnew;
