import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap';
import axios from 'axios';
import '../css/userwise.css'
import '../css/tab.css'; // Import your CSS file for custom styling
import mplus from "../../../assets/images/mplus.png";
import '../../../assets/css/successgif.css';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
const UserWiseReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userName, setUserName] = useState(''); // State for storing userName

  const receiptRef = useRef(null);
  useEffect(() => {
    // Retrieve userName from sessionStorage on component mount
    const storedUserName = sessionStorage.getItem('UserName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleShowReport = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const imei = sessionStorage.getItem('IMEI');
      const emailID = sessionStorage.getItem('Email');
      const password = sessionStorage.getItem('Password');
      const token = sessionStorage.getItem('Token');

      if (!imei || !emailID || !password || !token || !userName) {
        //console.error('Required session parameters are missing');
        setErrorMessage('Required session parameters are missing.');
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      const url = `https://testingNewAPI.mplusparking.com/AppServerCall/getRequests`;
      const data = {
        imei,
        emailID,
        password,
        token,
        userName,
        search: today,
        type: 1
      };

      const response = await axios.post(url, data);

      //console.log('User and Site wise sales data:', response.data);

      if (response.data && response.data.Data && Array.isArray(response.data.Data.list)) {
        setReportData(response.data.Data.list);
      } else {
        //console.error('Unexpected data format:', response.data);
        setReportData([]);
      }
    } catch (error) {
      //console.error('Error fetching user and site wise sales data:', error.response?.data || error.message);
      setErrorMessage('Error fetching user and site wise sales data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = () => {
    const printContent = document.getElementById("printable-receipt").innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };
  const generatePDF = (receiptRef) => {
    const receiptElement = receiptRef.current;

    // Add padding/margin to the receipt element
    const originalStyle = receiptElement.style.cssText;
    receiptElement.style.padding = '10px';
    receiptElement.style.margin = '10px';
    receiptElement.style.boxSizing = 'border-box';

    html2canvas(receiptElement, { scale: 1.5 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('User wise sales data Report.pdf');

      // Reset the style after generating the PDF
      receiptElement.style.cssText = originalStyle;
    });
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md="8">
          <Card className='formcard'>
            <CardBody>
              <CardTitle tag="h6" className="cardt text-center">User Wise Report</CardTitle>
              <Button className='mybutton' color="info" block onClick={handleShowReport} disabled={loading}>
                {loading ? 'Loading...' : 'Show'}
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {errorMessage && (
        <Row className="justify-content-center mt-4">
          <Col md="8">
            <Card>
              <CardBody>
                <CardTitle tag="h6" className="cardt text-center text-danger">{errorMessage}</CardTitle>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {reportData.length > 0 && (
        <Row className="justify-content-center mt-4">
          <Col md="8">
            <Card>
              <CardBody>
                <CardTitle tag="h6" className="cardt text-center">User Wise Sales Data</CardTitle>
                <div id="printable-receipt" ref={receiptRef} className="receipt">
                  <img src={mplus} height="80" width="150" className="center-image" alt="Logo" />
                  <div className="receipt-description">
                    <p>
                      <strong>User Wise Sales Data for {userName}: {new Date().toLocaleDateString()}</strong>
                    </p>
                  </div>
                  {reportData.map((item, index) => (
                    <div key={index} className="receipt-item">
                      <p>Vehicle No:<strong> {item.vehno}</strong></p>
                      <p>Tick No:<strong> {item.receipt}</strong></p>
                      <p>Intime:<strong> {item.intime}</strong></p>
                      <p>Outtime:<strong> {item.outtime === '-' ? 'N/A' : item.outtime}</strong></p>
                      <p>Operator Name:<strong> {item.operatorname}</strong></p>
                      <p>Status:<strong> {item.status === '1' ? 'Completed' : 'Pending'}</strong></p>
                      <p>Vehicle Type:<strong> {item.vehtype === '-' ? 'N/A' : item.vehtype}</strong></p>
                      <p>Amount:<strong> {item.amount === '-' ? 'N/A' : item.amount}</strong></p>
                      <p>Pass Unique Number:<strong> {item.passuniquenumber === '-' ? 'N/A' : item.passuniquenumber}</strong></p>
                      <p>Pass Holder Name:<strong> {item.passholdername === '-' ? 'N/A' : item.passholdername}</strong></p>
                      <p>Pass Amount:<strong> {item.passamount === '-' ? 'N/A' : item.passamount}</strong></p>
                      <p>Pass Start Date:<strong> {item.passstartdate === '-' ? 'N/A' : item.passstartdate}</strong></p>
                      <p>Pass Expiry Date:<strong> {item.passexpirydate === '-' ? 'N/A' : item.passexpirydate}</strong></p>
                      <p>Pass Validity:<strong> {item.passvalidity === '-' ? 'N/A' : item.passvalidity}</strong></p>
                      <p>Pass Designation:<strong> {item.passDesignation === '-' ? 'N/A' : item.passDesignation}</strong></p>
                      <p>Pass Type:<strong> {item.passtype === '-' ? 'N/A' : item.passtype}</strong></p>
                      <p>No of Penalties:<strong> {item.No_of_penalty === '-' ? 'N/A' : item.No_of_penalty}</strong></p>
                      <p>Penalty Amount:<strong> {item.penaltyamount === '-' ? 'N/A' : item.penaltyamount}</strong></p>
                      <p>Penalty Type:<strong> {item.penaltytype === '-' ? 'N/A' : item.penaltytype}</strong></p>
                      <p>Penalty Time:<strong> {item.penaltytime === '-' ? 'N/A' : item.penaltytime}</strong></p>
                      <p>Penalty Unique Number:<strong> {item.PenaltyUniqueNumber === '-' ? 'N/A' : item.PenaltyUniqueNumber}</strong></p>
                    </div>
                  ))}
                  <p className="receipt-footer">
                    <br></br>
                    <span style={{ fontSize: "10px", fontFamily: 'Arial' }}>
                      We are not responsible for any errors or omissions in the report. Please verify the data with your records.
                    </span>
                  </p>
                </div>
              </CardBody>
              <Button className="w-100 mt-2" color="secondary" onClick={() => generatePDF(receiptRef)}>
                Download PDF
              </Button>
              <br></br>
              <Button className="w-100 mt-2" color="primary" onClick={printReceipt}>
                Print
              </Button>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default UserWiseReport;
