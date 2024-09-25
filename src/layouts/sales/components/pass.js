import React, { useState, useEffect, useRef } from 'react';
import {
  Button, Input, Container, Row, Col, FormGroup, Label, Card, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import axios from 'axios';
import successgif from '../../../assets/images/succsessful2.gif'; 
import '../../../assets/css/successgif.css'; 
import QRCode from 'react-qr-code'; // Import QRCode
import mplus from "../../../assets/images/mplus.png";

const Pass = () => {
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [selectDate, setSelectDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [passType, setPassType] = useState('');
  const [passTypes, setPassTypes] = useState([]);
  const [passAmount, setPassAmount] = useState('');
  const [dailyRate, setDailyRate] = useState(0);
  const [editableAmount, setEditableAmount] = useState(0);
  const [vehicleUserName, setVehicleUserName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactno, setContactno] = useState('');
  const [email, setEmail] = useState(null); 
  const [designation, setDesignation] = useState(null);
  const [success, setSuccess] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [modal, setModal] = useState(false);
  const [duplicateModal, setDuplicateModal] = useState(false);
  const receiptRef = useRef(null);
  const duplicateReceiptRef = useRef(null);

  useEffect(() => {
    const fetchPassTypes = async () => {
      try {
        const imei = sessionStorage.getItem('IMEI');
        const emailID = sessionStorage.getItem('Email');
        const password = sessionStorage.getItem('Password');
        const token = sessionStorage.getItem('Token');
        const siteId = sessionStorage.getItem('SiteId');
  
        const response = await axios.post('https://testingNewAPI.mplusparking.com/AppServerCall/getPassTypes', null, {
          params: {
            imei,
            emailID,
            password,
            token,
            siteId
          }
        });
  
        if (response.data?.Data?.passlist && Array.isArray(response.data.Data.passlist)) {
          setPassTypes(response.data.Data.passlist);
          const firstPass = response.data.Data.passlist[0] || {};
          setPassType(firstPass.passType || '');
          setVehicleType(firstPass.VehicleType || ''); 
          setPassAmount(firstPass.passAmount || '');
          const validityDays = firstPass.ValidityDays || '';
          setDailyRate(validityDays ? parseFloat(firstPass.passAmount) / parseInt(validityDays) : 0);
          setEditableAmount(firstPass.passAmount || 0);
          calculateEndDate(selectDate, validityDays);
        } else {
          //console.error('Unexpected response data format:', response.data);
          setPassTypes([]);
        }
      } catch (error) {
        //console.error('Error fetching pass types:', error);
        setPassTypes([]);
      }
    };
  
    fetchPassTypes();
  }, []);

  useEffect(() => {
    if (passType) {
      const selectedPass = passTypes.find(pass => pass.passType === passType);
      if (selectedPass) {
        const validityDays = selectedPass.ValidityDays;
        setDailyRate(validityDays ? parseFloat(selectedPass.passAmount) / parseInt(validityDays) : 0);
        setEditableAmount(selectedPass.passAmount);
        calculateEndDate(selectDate, validityDays);
      }
    }
  }, [passType, selectDate]);

  const handlePassTypeChange = (e) => {
    const selectedPassType = e.target.value;
    setPassType(selectedPassType);
    const selectedPass = passTypes.find(pass => pass.passType === selectedPassType);
    setVehicleType(selectedPass?.VehicleType || '');
    setPassAmount(selectedPass?.passAmount || '');
    const validityDays = selectedPass?.ValidityDays || '';
    setDailyRate(validityDays ? parseFloat(selectedPass.passAmount) / parseInt(validityDays) : 0);
    setEditableAmount(selectedPass?.passAmount || 0);
    calculateEndDate(selectDate, validityDays);
  };

  const calculateEndDate = (startDate, validityDays) => {
    if (startDate && validityDays) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + parseInt(validityDays));
      setEndDate(start.toISOString().split('T')[0]);
    }
  };

  const handleDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    // calculateEditableAmount(selectDate, newEndDate);
  };

  // const calculateEditableAmount = (startDate, endDate) => {
  //   if (startDate && endDate && dailyRate) {
  //     const start = new Date(startDate);
  //     const end = new Date(endDate);
  //     const daysDifference = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  //     setEditableAmount(daysDifference * dailyRate);
  //   }
  // };

  const handleSubmit = () => {
    const storedSession = {
      imei: sessionStorage.getItem('IMEI'),
      emailID: sessionStorage.getItem('Email'),
      password: sessionStorage.getItem('Password'),
      token: sessionStorage.getItem('Token'),
      siteId: sessionStorage.getItem('SiteId'),
      deviceId: sessionStorage.getItem('DeviceId'),
      userId: sessionStorage.getItem('IdCustomer'),
      vehNo: vehicleNumber,
      passType,
      startdate: selectDate,
      endDate:endDate,
      passAmount:editableAmount,
      vehicleType,
      personName: vehicleUserName,
      companyName,
      contactno,
      personemailID: email || '',
      designation: designation || ''
    };
  
    axios.post('https://testingNewAPI.mplusparking.com/AppServerCall/passDetails', null, {
      params: storedSession
    })
      .then(response => {
        //console.log('Pass created:', response.data);
        setVehicleDetails(response.data.Data);
        setSuccess(true);
        setModal(true);
        setTimeout(() => {
          setSuccess(false); 
          setVehicleNumber('');
          setSelectDate('');
          setPassType(passTypes.length > 0 ? passTypes[0].passType : ''); 
          setVehicleUserName('');
          setCompanyName('');
          setContactno('');
        }, 2000);
      })
      .catch(error => {
        //console.error('Error creating pass:', error);
      });
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
      // Close the window after printing
      printWindow.close();
    };
  };

  return (
    <Container>
      <Row className="justify-content-center">
       
      <Col md="10">
          {success && (
            <div className="success-overlay">
              <img src={successgif} alt="Success" className="success-gif" />
            </div>
          )}
        <Card className='formcard'>
            <CardBody>
              <CardTitle tag="h6" className="cardt text-center">Pass</CardTitle>
             
              <FormGroup>
                <Label style={{ fontSize: '18px' }}for="passType">Pass Type</Label>
                <Input
                  type="select"
                  id="passType"
                  value={passType}
                  onChange={handlePassTypeChange}
                >
                  {passTypes.map((type, index) => (
                    <option key={index} value={type.passType}>
                      {type.passType}
                    </option>
                  ))}
                </Input>
              </FormGroup>
         
              {/* <FormGroup>
                <Label style={{ fontSize: '18px' }}for="vehicleType">Vehicle Type</Label>
                <Input
                  type="text"
                  id="vehicleType"
                  value={vehicleType}
                  readOnly
                />
              </FormGroup> */}
              <Row>
                <Col md={6}>
                <FormGroup>
                  <Label style={{ fontSize: '18px' }} for="selectDate">Start Date</Label>
                  <Input
                    type="date"
                    id="selectDate"
                    value={selectDate}
                    onChange={(e) => {
                      setSelectDate(e.target.value);
                      calculateEndDate(e.target.value, passTypes.find(pass => pass.passType === passType)?.ValidityDays);
                    }}
                  />
                </FormGroup>
                </Col>
                <Col md={6}>
                <FormGroup>
                  <Label style={{ fontSize: '18px' }} for="endDate">End Date</Label>
                  <Input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={handleDateChange}
                  />
                </FormGroup>
                </Col>
              </Row>
             
            

                <FormGroup>
                  <Label style={{ fontSize: '18px' }} for="editableAmount">Amount</Label>
                  <Input
                    type="number"
                    id="editableAmount"
                    value={editableAmount}
                    onChange={(e) => setEditableAmount(e.target.value)}
                  />
                </FormGroup>

              <FormGroup>
                <Label style={{ fontSize: '18px' }}for="vehicleNumber">Vehicle Number</Label>
                <Input
                  id="vehicleNumber"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                   placeholder="Enter Vehicle No"
                />
              </FormGroup>
         
              <FormGroup>
                <Label style={{ fontSize: '18px' }}for="vehicleUserName">Vehicle User Name</Label>
                <Input
                  id="vehicleUserName"
                  value={vehicleUserName}
                  placeholder="Enter Vehicle User Name"
                  onChange={(e) => setVehicleUserName(e.target.value)}
                />
              </FormGroup>
           
              <FormGroup>
                <Label style={{ fontSize: '18px' }}for="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                   placeholder="Enter Company Name"
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </FormGroup>
         
              <FormGroup>
                <Label style={{ fontSize: '18px' }}for="contactno">Contact Number</Label>
                <Input
                  id="contactno"
                  value={contactno}
                   placeholder="Enter Contact No"
                  onChange={(e) => setContactno(e.target.value)}
                />
              </FormGroup>
           
         
          <Button color="primary" onClick={handleSubmit}>
            Submit
            </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
     
      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>Vehicle In Details</ModalHeader>
        <ModalBody>
        <div id="printable-receipt" ref={receiptRef} className="receipt">
            <img src={mplus} height="80" width="150" className="center-image" alt="Logo" />
            <div className="receipt-description">
              <p>
                <strong>{vehicleDetails?.siteName}</strong>
              </p>
              <p>MANAGED BY</p>
              <p>
                <strong>M PLUS PARKING</strong>
              </p>
            </div>

            <h4 className="receipt-title">
              <strong> MONTHLY PASS RECEIPT</strong> {/* Underlined via CSS */}
             
            </h4>
            <div className="receipt-item">
              <p>Vehicle Number:<strong> {vehicleDetails?.vehno || ''} </strong></p>
              <p>PassNumber:<strong> {vehicleDetails?.PassNumber || ''} </strong></p>
              <p>Pass Amount:<strong> {vehicleDetails?.passAmonut || ''} </strong></p>
              <p>Pass Type:<strong> {vehicleDetails?.passType || ''} </strong></p>
              <p>Pass Validity days:<strong> {vehicleDetails?.passValiditydays || ''} </strong></p>
              <p>Pass holder Name:<strong> {vehicleDetails?.passholderName || ''} </strong></p>
              <p>Start date:<strong> {vehicleDetails?.startdate || ''} </strong></p>
              <p>End date:<strong> {vehicleDetails?.Enddate || ''} </strong></p>
          
            </div>
            <p className="receipt-footer">
              <span style={{ fontSize: "10px", fontFamily: 'Arial' }}>
                We are not responsible for any vehicle damage or theft. Vehicles are parked at the
                owners risk. This receipt is valid for single-use only.
              </span>
            </p>
              {/* QR Code */}
              <div className="qrcode-container" style={{textAlign:'center'}}>
              <QRCode value={vehicleDetails.PassNumber || ''} size={100} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={printReceipt}>
            Print
          </Button>
          <Button color="secondary" onClick={() => setModal(!modal)}>Cancel</Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={duplicateModal} toggle={() => setModal(!duplicateModal)}>
        <ModalHeader toggle={() => setModal(!duplicateModal)}>Vehicle In Details</ModalHeader>
        <ModalBody>
        <div id="printable-receipt-duplicate" ref={duplicateReceiptRef} className="receipt">
            <img src={mplus} height="80" width="150" className="center-image" alt="Logo" />
            <div className="receipt-description">
              <p>
                <strong>{vehicleDetails?.siteName}</strong>
              </p>
              <p>MANAGED BY</p>
              <p>
                <strong>M PLUS PARKING</strong>
              </p>
            </div>

            <h4 className="receipt-title">
              <strong> MONTHLY PASS RECEIPT DUPLICATE</strong> {/* Underlined via CSS */}
             
            </h4>
            <div className="receipt-item">
              <p>Vehicle Number:<strong> {vehicleDetails?.vehno || ''} </strong></p>
              <p>PassNumber:<strong> {vehicleDetails?.PassNumber || ''} </strong></p>
              <p>Pass Amount:<strong> {vehicleDetails?.passAmonut || ''} </strong></p>
              <p>Pass Type:<strong> {vehicleDetails?.passType || ''} </strong></p>
              <p>Pass Validity days:<strong> {vehicleDetails?.passValiditydays || ''} </strong></p>
              <p>Pass holder Name:<strong> {vehicleDetails?.passholderName || ''} </strong></p>
              <p>Start date:<strong> {vehicleDetails?.startdate || ''} </strong></p>
              <p>End date:<strong> {vehicleDetails?.Enddate || ''} </strong></p>
             
            </div>
            <p className="receipt-footer">
              <span style={{ fontSize: "10px", fontFamily: 'Arial' }}>
                We are not responsible for any vehicle damage or theft. Vehicles are parked at the
                owners risk. This receipt is valid for single-use only.
              </span>
            </p>
              {/* QR Code */}
              <div className="qrcode-container" style={{textAlign:'center'}}>
              <QRCode value={vehicleDetails.PassNumber || ''} size={100} />
            </div>
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

export default Pass;
