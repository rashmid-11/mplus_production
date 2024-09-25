import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Login.css";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";
import PropTypes from "prop-types";
import axios from "axios";
import Logo from "./image.png";
import video from '../../assets/images/backgroundvideo2.mp4'
import { Input } from "reactstrap";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imei, setImei] = useState('');
  const [error, setError] = useState("");
  const [initialRender, setInitialRender] = useState(true);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  async function loginUser(email, password, imei) {
    try {
      const response = await axios.post('https://testingNewAPI.mplusparking.com/AppServerCall/loginCustomer', null, {
        params: {
          imei: imei,
          emailID: email,
          password: password
        },
        withCredentials: true
      });

      // Handle successful login
      if (response.status === 200 && response.data.ShResult === 100) {
        const { userName, password, emailID, mobileNo, imei, token, siteName, idCustomer, siteAddress, deviceId, siteId, deviceNumber, siteType, siteTypeName,sitelaneid,sitelanename,anprid,anprcamera,anprsn} = response.data.Data;

        //console.log('Login successful!');
        //console.log('UserName:', userName);
        //console.log('Password:', password);
        //console.log('Email:', emailID);
        //console.log('MobileNo:', mobileNo);
        //console.log('IMEI:', imei);
        //console.log('Token:', token);
        //console.log('SiteName:', siteName);
        //console.log('IdCustomer:', idCustomer);
        //console.log('SiteAddress:', siteAddress);
        //console.log('DeviceId:', deviceId);
        //console.log('SiteId:', siteId);
        //console.log('DeviceNumber:', deviceNumber);
        //console.log('SiteType:', siteType);
        //console.log('SiteTypeName:', siteTypeName);
        //console.log('sitelaneid:', sitelaneid);
        //console.log('sitelanename:', sitelanename);
        //console.log('anprid:', anprid);
        //console.log('anprcamera:', anprcamera);
         //console.log('anprsn:', anprsn);
        
       

        // Store user information in session storage
        sessionStorage.setItem('UserName', userName);
        sessionStorage.setItem('Password', password);
        sessionStorage.setItem('Email', emailID);
        sessionStorage.setItem('MobileNo', mobileNo);
        sessionStorage.setItem('IMEI', imei);
        sessionStorage.setItem('Token', token);
        sessionStorage.setItem('SiteName', siteName);
        sessionStorage.setItem('IdCustomer', idCustomer);
        sessionStorage.setItem('SiteAddress', siteAddress);
        sessionStorage.setItem('DeviceId', deviceId);
        sessionStorage.setItem('SiteId', siteId);
        sessionStorage.setItem('DeviceNumber', deviceNumber);
        sessionStorage.setItem('SiteType', siteType);
        sessionStorage.setItem('SiteTypeName', siteTypeName);
        sessionStorage.setItem('sitelaneid', sitelaneid);
        sessionStorage.setItem('sitelanename', sitelanename);
        sessionStorage.setItem('anprid', anprid);
        sessionStorage.setItem('anprcamera', anprcamera);
        
        sessionStorage.setItem('isLoggedIn', true);

        setIsLoggedIn(true);
        navigate("/dashboard");

      } else {
        setError('Login failed: ' + response.data.Message);
      }
    } catch (error) {
      //console.error('Error during login:', error);
      setError("An unexpected error occurred.");
    }
  }

  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);
    }
  }, [initialRender]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    //console.log("Email: ", email);
    //console.log("Password: ", password);
    //console.log("IMEI: ", imei);

    await loginUser(email, password, imei);
  };

 

  return (
    <div className="login-page d-flex align-items-center">
      <video autoPlay muted loop className="bg-video">
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="container ">
        <div className="row d-flex justify-content-center " >
          <div className="bordered-div col-lg-4 col-10 ">

            <div className="login_container d-flex justify-content-center" style={{ marginTop: "20px" }}>
              <img
                src={Logo}
                alt="logo"
                width="250"
                height="100%"
                className="logo d-inline-block align-top d-flex justify-content-center"
              />
            </div>

            <ArgonBox component="form" role="form" style={{ fontSize: "20px", padding: '10px' }} onSubmit={handleLogin} >
              <div className="text-dark" style={{ marginBottom: "20px", textAlign: "center" }}>
                <ArgonTypography variant="h3" fontWeight="bold">
                  <span className="text-dark">Sign In</span>
                </ArgonTypography>
                <div className="text-dark" style={{ fontSize: "16px", marginTop: "10px" }}>
                  Enter your email and password to sign in AA007878711111gf
                </div>
              </div>
              
              <ArgonBox mb={2}>
                <Input
                  type="text"
                  placeholder="IMEI"

                  style={{ background: 'transparent' }}
                  value={imei}
                  onChange={(e) => setImei(e.target.value)}
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

              {error && (
                <ArgonBox mt={2} mb={2}>
                  <ArgonTypography color="error" textAlign='center' sx={{ fontSize: "18px" }}>{error}</ArgonTypography>
                </ArgonBox>
              )}

              <ArgonBox mt={4} mb={1}>
                <ArgonButton
                  color="primary"

                  fullWidth
                  style={{ fontSize: "16px" }}
                  type="submit"
                >
                  Login
                </ArgonButton>
              </ArgonBox>
              <ArgonBox mt={3} textAlign="center">
                <ArgonTypography
                  variant="button"
                  color="text"
                  fontWeight="regular"
                  style={{ fontSize: "15px" }}
                >
                  Dont have an account?{" "}
                  <ArgonTypography
                    component={Link}
                    to="/newsignup"
                    variant="button"
                    color="primary"
                    fontWeight="medium"
                    style={{ fontSize: "15px" }}
                  >
                    Sign up
                  </ArgonTypography>

                </ArgonTypography>
              </ArgonBox>
              <br />
            </ArgonBox>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default Login;
