import React, { useState } from "react";
import ArgonBox from "components/ArgonBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Card from "@mui/material/Card";
import profilepark from '../../assets/images/profilepark4.jpg'

const Profile = () => {
  const [profileData] = useState({
    email: sessionStorage.getItem('Email'),
    phonenumber: sessionStorage.getItem('MobileNo'),
    firstname: sessionStorage.getItem('UserName'),
    siteName: sessionStorage.getItem('SiteName'),
    imei: sessionStorage.getItem('IMEI'),
    siteAddress: sessionStorage.getItem('SiteAddress'),
    deviceNumber: sessionStorage.getItem('DeviceNumber'),
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card>
            <div className="container" style={{ marginBottom: "15px", marginTop: "20px" }}>
              <div className="row ">
                <div className="col-12  ">
                  <div className="card">
                    <div className="card-header">
                      <h4 style={{ color: "#11cdef" }}>Profile</h4>
                    </div>
                    <div className="card-body ">
                      <div className="row ">
                        <div className="col-md-6">
                          <img
                            src={profilepark}
                            alt="Profile"
                            className="img-fluid "
                          />
                        </div>
                        <div className="col-md-1"></div>
                        <div className="col-md-5 d-flex align-items-center">
                          <div className="information ">
                            <h6 ><strong>Name : </strong> <span style={{ color: "#007bff" }}> {profileData.firstname}</span></h6>
                            <h6><strong>Email : </strong><span style={{ color: "#007bff" }}> {profileData.email}</span> </h6>
                            <h6><strong>Phone Number : </strong><span style={{ color: "#007bff" }}> {profileData.phonenumber}</span></h6>
                            <h6><strong>Site Name : </strong><span style={{ color: "#007bff" }}> {profileData.siteName}</span></h6>
                            <h6><strong>IMEI :</strong><span style={{ color: "#007bff" }}> {profileData.imei}</span> </h6>
                            <h6><strong>Site Address : </strong><span style={{ color: "#007bff" }}> {profileData.siteAddress}</span></h6>
                            <h6><strong>Device Number :</strong> <span style={{ color: "#007bff" }}> {profileData.deviceNumber}</span></h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </ArgonBox>
      </ArgonBox>
    </DashboardLayout>
  );
};

export default Profile;
