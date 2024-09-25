/* eslint-disable no-unused-vars */
/**
=========================================================
* Argon Dashboard 2 MUI - v3.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-material-ui
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import React, { useEffect, useState } from "react";
// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DetailedStatisticsCard from "examples/Cards/StatisticsCards/DetailedStatisticsCard";
import SalesTable from "examples/Tables/SalesTable";
import CategoriesList from "examples/Lists/CategoriesList";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Argon Dashboard 2 MUI base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import Slider from "layouts/dashboard/components/Slider";
import { FaCarSide } from "react-icons/fa6";

import Card from 'react-bootstrap/Card';
import { Line } from 'react-chartjs-2';
// Data
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";
import salesTableData from "layouts/dashboard/data/salesTableData";
import categoriesListData from "layouts/dashboard/data/categoriesListData";
import Tabsales from "layouts/sales/components/tabsale";
import Tabsnew from "layouts/receipt/components/tab";
import Tabreports from "layouts/reports/compnents/tabreports";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft, FaPenAlt } from "react-icons/fa";
import borders from "assets/theme/base/borders";

import {   FaSignInAlt, FaSignOutAlt, FaCarAlt } from "react-icons/fa";

import { Box } from "@mui/material";
import axios from "axios";




function Default() {

  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [lineChartData, setLineChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [] // Start with an empty array and populate it later
  });
  
  // Function to generate colors dynamically
  const generateColor = (index) => {
    const colors = [
      'rgba(255,99,132,0.4)', // Pink
      'rgba(75,192,192,0.4)', // Teal
      'rgba(255,205,86,0.4)', // Yellow
      'rgba(153,102,255,0.4)', // Purple
      'rgba(255,159,64,0.4)'  // Orange
    ];
    const borderColors = [
      'rgba(255,99,132,1)',   // Pink
      'rgba(75,192,192,1)',   // Teal
      'rgba(255,205,86,1)',   // Yellow
      'rgba(153,102,255,1)',  // Purple
      'rgba(255,159,64,1)'    // Orange
    ];
    return {
      backgroundColor: colors[index % colors.length],
      borderColor: borderColors[index % borderColors.length]
    };
  };
  
  useEffect(() => {
    // Fetch vehicle types from the API
    const fetchVehicleTypes = async () => {
      try {
        const imei = sessionStorage.getItem("IMEI");
        const emailID = sessionStorage.getItem("Email");
        const password = sessionStorage.getItem("Password");
        const token = sessionStorage.getItem("Token");
        const siteId = sessionStorage.getItem("SiteId");
  
        const response = await axios.post("https://testingNewAPI.mplusparking.com/AppServerCall/getVehicleTypes", null, {
          params: { imei, emailID, password, token, siteId },
        });
  
        if (response.data?.Data?.list && Array.isArray(response.data.Data.list)) {
          setVehicleTypes(response.data.Data.list);
        } else {
          //console.error("Unexpected response data format:", response.data);
          setVehicleTypes([]);
        }
      } catch (error) {
        //console.error("Error fetching vehicle types:", error);
        setVehicleTypes([]);
      }
    };
  
    fetchVehicleTypes();
  }, []);
  
  useEffect(() => {
    // Fetch report data and update the chart
    const handleShowReport = async () => {
      try {
        const imei = sessionStorage.getItem('IMEI');
        const emailID = sessionStorage.getItem('Email');
        const password = sessionStorage.getItem('Password');
        const token = sessionStorage.getItem('Token');
        const siteName = sessionStorage.getItem('SiteName');
  
        if (!imei || !emailID || !password || !token || !siteName) {
          //console.error('Required session parameters are missing');
          return;
        }
  
        const currentYear = new Date().getFullYear(); // Get the current year
const startDate = `${currentYear}-01-01`; // Start date: January 1st of the current year
const endDate = `${currentYear}-12-31`;   // End date: December 31st of the current year

  
        const url = `https://testingNewAPI.mplusparking.com/AppServerCall/getRequests`;
        const data = {
          imei,
          emailID,
          password,
          token,
          search: `${startDate},${endDate}`,
          type: 0
        };
  
        const response = await axios.post(url, data);
        //console.log('range data', response);
  
        if (response.data && response.data.Data && Array.isArray(response.data.Data.list)) {
          const list = response.data.Data.list;
  
          // Initialize counts for each vehicle type
          const vehicleCount = vehicleTypes.reduce((acc, type) => {
            acc[type.vehType] = new Array(12).fill(0); // Initialize counts for each month
            return acc;
          }, {});
  
          //console.log('Initialized vehicle counts:', vehicleCount); // Debug line
  
          // Count vehicles per type and month
          list.forEach(item => {
            const vehicleType = item.vehtype; // Vehicle type from the API
  
            // Ensure vehicleType is a string and trim any whitespace
            if (typeof vehicleType !== 'string') {
              //console.error('Vehicle type is not a string:', item);
              return;
            }
  
            const trimmedVehicleType = vehicleType.trim(); // Trim any extra whitespace
  
            if (!trimmedVehicleType) {
              //console.error('Vehicle type is empty:', item);
              return;
            }
  
            if (trimmedVehicleType in vehicleCount) {
              const itemDate = new Date(item.intime);
              const month = itemDate.getMonth(); // getMonth returns 0 for January, 1 for February, etc.
  
              // Verify if itemDate is valid
              if (!isNaN(itemDate.getTime())) {
                vehicleCount[trimmedVehicleType][month]++;
              } else {
                //console.error('Invalid date:', item.intime);
              }
            } else {
              //console.error('Vehicle type not found in vehicleCount:', trimmedVehicleType);
            }
          });
  
          //console.log('Updated vehicle counts:', vehicleCount); // Debug line
  
          // Prepare datasets for the chart
          const datasets = vehicleTypes.map((type, index) => {
            const typeName = type.vehType;
            const color = generateColor(index); // Get color for the type
  
            return {
              label: typeName,
              fill: false,
              lineTension: 0.1,
              backgroundColor: color.backgroundColor,
              borderColor: color.borderColor,
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: color.borderColor,
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: color.borderColor,
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: vehicleCount[typeName] || new Array(12).fill(0) // Monthly counts for each vehicle type
            };
          });
  
          // Update chart data
          setLineChartData(prevData => ({
            ...prevData,
            datasets
          }));
        }
      } catch (error) {
        //console.error('Error fetching data', error);
      }
    };
  
    if (vehicleTypes.length > 0) {
      handleShowReport();
    }
  }, [vehicleTypes]);
  
const [inVehicleCount, setInVehicleCount] = useState(0);
const [outVehicleCount, setOutVehicleCount] = useState(0);
const [saleVehicleCount, setSaleVehicleCount] = useState(0);
const [stockVehicleCount, setStockVehicleCount] = useState(0);



  useEffect(() => {
    const fetchInVehicleCount = async () => {
      try {
        const imei = sessionStorage.getItem('IMEI');
        const emailID = sessionStorage.getItem('Email');
        const password = sessionStorage.getItem('Password');
        const token = sessionStorage.getItem('Token');
        const siteId = sessionStorage.getItem('SiteId');

        const response = await axios.post('https://testingNewAPI.mplusparking.com/AppServerCall/getInVehicleCount', {
          imei,
          emailID,
          password,
          token,
          siteId
        });

        //console.log('InVehicleCount API response:', response.data);

        // Assuming 'Data' contains the count
        if (response.data?.Data) {
          setInVehicleCount(response.data.Data); // Update the state with the count value
        }
      } catch (error) {
        //console.error('Error fetching InVehicleCount:', error);
      }
    };

    fetchInVehicleCount();
  }, []);

  useEffect(() => {
    const fetchOutVehicleCount = async () => {
      try {
        const imei = sessionStorage.getItem('IMEI');
        const emailID = sessionStorage.getItem('Email');
        const password = sessionStorage.getItem('Password');
        const token = sessionStorage.getItem('Token');
        const siteId = sessionStorage.getItem('SiteId');

        const response = await axios.post('https://testingNewAPI.mplusparking.com/AppServerCall/getOutVehicleCount', {
          imei,
          emailID,
          password,
          token,
          siteId
        });

        //console.log('InVehicleCount API response:', response.data);

        // Assuming 'Data' contains the count
        if (response.data?.Data) {
          setOutVehicleCount(response.data.Data); // Update the state with the count value
        }
      } catch (error) {
        //console.error('Error fetching InVehicleCount:', error);
      }
    };

    fetchOutVehicleCount();
  }, []);

  useEffect(() => {
    const fetchSaleVehicleCount = async () => {
      try {
        const imei = sessionStorage.getItem('IMEI');
        const emailID = sessionStorage.getItem('Email');
        const password = sessionStorage.getItem('Password');
        const token = sessionStorage.getItem('Token');
        const siteId = sessionStorage.getItem('SiteId');

        const response = await axios.post('https://testingNewAPI.mplusparking.com/AppServerCall/getTotalSale', {
          imei,
          emailID,
          password,
          token,
          siteId
        });

        //console.log('InVehicleCount API response:', response.data);

        // Assuming 'Data' contains the count
        if (response.data?.Data) {
          setSaleVehicleCount(response.data.Data); // Update the state with the count value
        }
      } catch (error) {
        //console.error('Error fetching InVehicleCount:', error);
      }
    };

    fetchSaleVehicleCount();
  }, []);

  useEffect(() => {
    const fetchStockVehicleCount = async () => {
      try {
        const imei = sessionStorage.getItem('IMEI');
        const emailID = sessionStorage.getItem('Email');
        const password = sessionStorage.getItem('Password');
        const token = sessionStorage.getItem('Token');
        const siteId = sessionStorage.getItem('SiteId');

        const response = await axios.post('https://testingNewAPI.mplusparking.com/AppServerCall/getStockVehicleCount', {
          imei,
          emailID,
          password,
          token,
          siteId
        });

        //console.log('InVehicleCount API response:', response.data);

        // Assuming 'Data' contains the count
        if (response.data?.Data) {
          setStockVehicleCount(response.data.Data); // Update the state with the count value
        }
      } catch (error) {
        //console.error('Error fetching InVehicleCount:', error);
      }
    };

    fetchStockVehicleCount();
  }, []);



  const { size } = typography;
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
      <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="Stock Vehicle"
             
              count={ stockVehicleCount}
             
              icon={{
                color: "info",
                component: (
                  <Box
                    sx={{
                      backgroundColor: "#17a2b8",
                      borderRadius: "50%",
                      height: "70px",
                      width: "70px",
                      padding: "10px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight:'10px',
                      marginTop:'10px'
                    }}
                  >
                    {/* Stack multiple car icons */}
                    <FaCarAlt size={20} style={{ marginRight: "-5px" }} />
                    <FaCarAlt size={24} style={{ marginRight: "-5px" }} />
                    <FaCarAlt size={32} />
                  </Box>
                ),
          
           }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="In Vehicle"
              count={inVehicleCount}

              icon={{
                color: "success",
                component: (
                  <Box
                    sx={{
                      backgroundColor: "green",
                      borderRadius: "50%",
                      padding: "10px", // Reduced padding to allow more room for icons
                      height: "70px",  // Increased height
                      width: "70px",   // Increased width
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                        marginRight:'10px',
                      marginTop:'10px'
                    }}
                  >
                    <FaCarSide size={30} />    {/* Increased icon size */}
                    <FaSignInAlt size={30} style={{ marginLeft: "4px" }} />  {/* Increased icon size */}
                  </Box>
                ),
           }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="Out Vehicle"
            
              count={outVehicleCount}

              icon={{
                color: "error",
                component: (
                  <Box
                    sx={{
                      backgroundColor: "red",
                      borderRadius: "50%",
                      padding: "10px",
                      height: "70px",
                      width: "70px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                        marginRight:'10px',
                      marginTop:'10px'
                    }}
                  >
                    <FaCarSide size={30} />
                    <FaSignOutAlt size={30} style={{ marginLeft: "4px" }} />
                  </Box>
                ),
          
          }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="sales"
              
              count={saleVehicleCount}
              icon={{
                color: "warning",
                component: (
                  <Box
                    sx={{
                      backgroundColor: "#ffc107",
                      borderRadius: "50%",
                      padding: "10px",
              
                      height: "70px",
                      width: "70px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                        marginRight:'10px',
                      marginTop:'10px'
                      
                    }}
                  >
                    <i  className="ni ni-cart" />
                  </Box>
                ),
         }}
            />
          </Grid>
          
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} lg={7}>
              <Card sx={{ position: "relative", display: "block", height: "100%", overflow: "hidden",border:'none'}}>
          <ArgonBox m={2}>
              <ArgonBox display="flex" alignItems="center">
                <ArgonBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                  <Icon sx={{ fontWeight: "bold" }}>arrow_upward</Icon>
                </ArgonBox>
                <ArgonTypography variant="button"  fontWeight="medium">
                  4% more{" "}
                  <ArgonTypography variant="button" fontWeight="regular">
                    in {new Date().getFullYear()}
                  </ArgonTypography>
                </ArgonTypography>
              </ArgonBox>
              <ArgonBox mt={4}>
                <div>
                  <Line
                    data={lineChartData}
                    // options={{
                    //   scales: {
                    //     yAxes: [{
                    //       ticks: {
                    //         beginAtZero: true
                    //       }
                    //     }]
                    //   }
                    // }}
                  />
                </div>
              </ArgonBox>
            </ArgonBox>
            </Card>
          </Grid>
          <Grid item xs={12} lg={5}>
            <Slider />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} >
        <Tabsnew></Tabsnew>
          </Grid>
          <Grid item xs={12} md={12}>
          <Tabsales></Tabsales>
          </Grid>
          <Grid item xs={12} md={12}>
       <Tabreports></Tabreports>
          </Grid>
        </Grid>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Default;
