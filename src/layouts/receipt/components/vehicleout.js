import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Container, Row, Col, Card, CardBody, CardTitle, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';
import successgif from '../../../assets/images/succsessful2.gif';
import '../../../assets/css/successgif.css';
import mplus from "../../../assets/images/mplus.png";

const VehicleLogout = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [modal, setModal] = useState(false);
  const [duplicateModal, setDuplicateModal] = useState(false);
  const [logoutDetails, setLogoutDetails] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const receiptRef = useRef(null);
  const duplicateReceiptRef = useRef(null);

  const [paymentModes, setPaymentModes] = useState([]);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');
  const [paymentTypes, setPaymentTypes] = useState({});

  useEffect(() => {
    const fetchPaymentTypes = async () => {
      try {
        const imei = sessionStorage.getItem('IMEI');
        const emailID = sessionStorage.getItem('Email');
        const password = sessionStorage.getItem('Password');
        const token = sessionStorage.getItem('Token');
        const siteId = sessionStorage.getItem('SiteId');

        const response = await axios.post('https://testingNewAPI.mplusparking.com/AppServerCall/getPaymentTypes', null, {
          params: {
            imei,
            emailID,
            password,
            token,
            siteId
          }
        });

        if (response.data?.Data?.Plist && Array.isArray(response.data.Data.Plist)) {
          const modes = response.data.Data.Plist.map((item) => item.PaymentMode);
          const types = response.data.Data.Plist.reduce((acc, item) => {
            acc[item.PaymentMode] = item.PaymentType;
            return acc;
          }, {});

          setPaymentModes(modes);
          setPaymentTypes(types);
        } else {
          //console.error('Unexpected response data format:', response.data);
          setPaymentModes([]);
          setPaymentTypes({});
        }
      } catch (error) {
        //console.error('Error fetching Payment Modes:', error);
        setPaymentModes([]);
        setPaymentTypes({});
      }
    };

    fetchPaymentTypes();
  }, []);

  const handlePaymentModeChange = (e) => {
    const mode = e.target.value;
    setSelectedPaymentMode(mode);
    setSelectedPaymentType(paymentTypes[mode] || '');
  };

  const [selectedPaymentType, setSelectedPaymentType] = useState('');

  const handleANPRClick = async () => {
    try {
      const response = await fetch('http://localhost:3005https://testingNewAPI.mplusparking.com/latestout-nprdata');
      if (response.ok) {
        const data = await response.json();
        setVehicleNumber(data.plateNumber);
      } else {
        //console.error('Failed to fetch ANPR data');
      }
    } catch (error) {
      //console.error('Error fetching ANPR data:', error);
    }
  };

  const handleLogout = async () => {
    const imei = sessionStorage.getItem('IMEI');
    const emailID = sessionStorage.getItem('Email');
    const password = sessionStorage.getItem('Password');
    const token = sessionStorage.getItem('Token');
    const siteId = sessionStorage.getItem('SiteId');
    const deviceId = sessionStorage.getItem('DeviceId');
    const userId = sessionStorage.getItem('IdCustomer');

    if (!vehicleNumber) {
      setErrorMessage('Vehicle number is required');
      return;
    }

    if (!imei || !emailID || !password || !token || !siteId || !deviceId || !userId) {
      setErrorMessage('Required session parameters are missing');
      return;
    }

    if (!selectedPaymentMode) {
      setErrorMessage('Please select a Payment Mode');
      return;
    }

    if (!selectedPaymentType) {
      setErrorMessage('Payment type is not selected');
      return;
    }

    setErrorMessage('');

    try {
      const response = await axios.post('https://testingNewAPI.mplusparking.com/AppServerCall/vehicleOutRequest', null, {
        params: {
          imei,
          emailID,
          password,
          token,
          vehNo: vehicleNumber,
          siteId,
          deviceId,
          userId,
          isPrepaid: sessionStorage.getItem("SiteType") == "True" ? 1 : 0,
          paymenttype: selectedPaymentType, 
          paymentmode: selectedPaymentMode 
        }
      });

      if (response.data) {
        const { Message, ShResult, Data, ...details } = response.data;

        if (ShResult === 100) {
          setShowSuccess(true); 
          setLogoutDetails(Data); 
          setModal(true); 

          setTimeout(() => {
            setShowSuccess(false);
            setVehicleNumber('');
            setSelectedPaymentMode(''); 
            setSelectedPaymentType(''); 
          }, 1000);
        } else {
          setErrorMessage('Logout failed: ' + Message);
        }
      } else {
        //console.log('Unexpected response format:', response);
      }
    } catch (error) {
      //console.error('Error logging out vehicle:', error);
      if (error.response) {
        setErrorMessage('Error: ' + error.response.data.Message || 'Unexpected server error');
      } else {
        setErrorMessage('Error: Unable to logout vehicle');
      }
    }
  };

  const printReceipt = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            .receipt {
              text-align: center;
            }
            .center-image {
              display: block;
              margin: 0 auto;
            }
            .receipt-description {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-bottom: 10px;
              margin: 10px 0 1px 0;
            }
            .receipt-description p {
              font-size: 12px;
              margin: 5px 0 1px 0;
              line-height: 1.1;
              color: #555;
            }
            .receipt-item p {
              font-size: 12px;
              margin: 1px 0;
              line-height: 1.1;
              white-space: nowrap;
            }
            .receipt-title {
              font-size: 14px;
              margin: 10px 0;
              text-align: center;
              border-bottom: 1px solid #000;
              padding-bottom: 5px;
            }
            .receipt-item p {
              font-size: 12px;
              margin: 1px 0;
              line-height: 1.1;
              white-space: nowrap;
              position: relative;
            }
            .receipt-item p:last-of-type {
              padding-bottom: 10px;
              border-bottom: 1px solid #000;
            }
            .receipt-footer {
              font-size: 5px;
              line-height: 1.1;
              color: #555;
              font-family: Arial;
            }
          </style>
        </head>
        <body>
          ${receiptRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = () => {
      setModal(false);
      setTimeout(() => {
        setDuplicateModal(true);
      }, 1000);
      // Close the window after printing
      printWindow.close();
    };
  };

  const printDuplicateReceipt = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Duplicate Receipt</title>
          <style>
            .receipt {
              text-align: center;
            }
            .center-image {
              display: block;
              margin: 0 auto;
            }
            .receipt-description {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin: 10px 0 1px 0;
              margin-bottom: 10px;
            }
            .receipt-description p {
              font-size: 12px;
              margin: 5px 0 1px 0;
              line-height: 1.1;
              color: #555;
            }
            .receipt-item p {
              font-size: 12px;
              margin: 1px 0;
              line-height: 1.1;
              white-space: nowrap;
            }
            .receipt-title {
              font-size: 14px;
              margin: 10px 0;
              text-align: center;
              border-bottom: 1px solid #000;
              padding-bottom: 5px;
            }
            .receipt-item p {
              font-size: 12px;
              margin: 1px 0;
              line-height: 1.1;
              white-space: nowrap;
              position: relative;
            }
            .receipt-item p:last-of-type {
              padding-bottom: 10px;
              border-bottom: 1px solid #000;
            }
            .receipt-footer {
              font-size: 5px;
              line-height: 1.1;
              color: #555;
              font-family: Arial;
            }
          </style>
        </head>
        <body>
          ${duplicateReceiptRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = () => {
      setDuplicateModal(false);
      // Close the window
      printWindow.close();
    };
  };

  return (
    <Container>
      <Row className="mt-2 justify-content-center">
        <Col md="8">
          <Card className='formcard'>
            <CardBody>
              <CardTitle tag="h6" className="cardt text-center">Vehicle Logout</CardTitle>
              <Row>
                <Label for="vehicleNumber" style={{ fontSize: '18px' }}>Vehicle Number</Label>
                <Col md={9}>
                  <FormGroup>

                    <Input
                      type="text"
                      id="vehicleNumber"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      placeholder="Enter vehicle number"
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>


                  <Button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleANPRClick}
                  >ANPR </Button>

                </Col>
              </Row>

              <FormGroup>
                <Label for="paymentType" style={{ fontSize: "18px" }}>
                  Select Payment Mode
                </Label>
                <Input
                  type="select"
                  id="paymentMode"
                  value={selectedPaymentMode}
                  onChange={handlePaymentModeChange}
                >
                  <option value="" disabled>
                    Select Payment Mode
                  </option>
                  {paymentModes.map((mode, index) => (
                    <option key={index} value={mode}>
                      {mode}
                    </option>
                  ))}
                </Input>

              </FormGroup>


              {errorMessage && <p className="text-danger">{errorMessage} </p>}
              <Row>
                <Col xs="6">
                  <Button className='mybutton' color="info" block onClick={handleLogout}>Logout</Button>
                </Col>
                <Col xs="6">
                  <Button className='mybutton' color="info" block>Scan QR</Button>
                </Col>
              </Row>
              {showSuccess && (
                <div className="success-overlay">
                  <img src={successgif} alt="Success" className="success-gif" />
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>Vehicle Logout Details</ModalHeader>
        <ModalBody>
          <div id="printable-receipt" ref={receiptRef} className="receipt">
            <img src={mplus} height="80" width="150" className="center-image" alt="Logo" />
            <div className="receipt-description">
              <p>
                <strong>{logoutDetails.siteName}</strong>
              </p>
              <p>MANAGED BY</p>
              <p>
                <strong>M PLUS PARKING</strong>
              </p>
            </div>

            <h4 className="receipt-title">
              <strong>VEHICLE OUT RECEIPT</strong> {/* Underlined via CSS */}
            </h4>
            <div className="receipt-item">
              <p>Vehicle Number:<strong> {logoutDetails.vehNo}</strong></p>
              <p>In Time:<strong> {logoutDetails.inTime}</strong></p>
              <p>Out Time:<strong> {logoutDetails.outTime}</strong></p>
              <p>Receipt Number:<strong> {logoutDetails.receiptNumber}</strong></p>
              <p>Total Amount:<strong> {logoutDetails.rate}</strong></p>
            </div>
            <p className="receipt-footer">
              <span style={{ fontSize: "10px", fontFamily: 'Arial' }}>
                We are not responsible for any vehicle damage or theft. Vehicles are parked at the
                owners risk. This receipt is valid for single-use only.
              </span>
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={printReceipt}>
            Print
          </Button>
          <Button color="secondary" onClick={() => setModal(!modal)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={duplicateModal} toggle={() => setDuplicateModal(!duplicateModal)}>
        <ModalHeader toggle={() => setDuplicateModal(!duplicateModal)}>Vehicle Logout Details Duplicate</ModalHeader>
        <ModalBody>
          <div id="printable-receipt-duplicate" ref={duplicateReceiptRef} className="receipt">
            <img src={mplus} height="80" width="150" className="center-image" alt="Logo" />
            <div className="receipt-description">
              <p>
                <strong>{logoutDetails.siteName}</strong>
              </p>
              <p>MANAGED BY</p>
              <p>
                <strong>M PLUS PARKING</strong>
              </p>
            </div>

            <h4 className="receipt-title">
              <strong>VEHICLE OUT RECEIPT DUPLICATE</strong> {/* Underlined via CSS */}
            </h4>
            <div className="receipt-item">
              <p>Vehicle Number:<strong> {logoutDetails.vehNo}</strong></p>
              <p>In Time:<strong> {logoutDetails.inTime}</strong></p>
              <p>Out Time:<strong> {logoutDetails.outTime}</strong></p>
              <p>Receipt Number:<strong> {logoutDetails.receiptNumber}</strong></p>
              <p>Total Amount:<strong> {logoutDetails.rate}</strong></p>
            </div>
            <p className="receipt-footer">
              <span style={{ fontSize: "10px", fontFamily: 'Arial' }}>
                We are not responsible for any vehicle damage or theft. Vehicles are parked at the
                owners risk. This receipt is valid for single-use only.
              </span>
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={printDuplicateReceipt}>
            Print Duplicate
          </Button>
          <Button color="secondary" onClick={() => setDuplicateModal(!duplicateModal)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default VehicleLogout;
