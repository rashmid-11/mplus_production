import React, { useState, useEffect, useRef } from 'react';
import {
  Button, Input, Container, Row, Col, FormGroup, Label, Card, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import axios from 'axios';
import successgif from '../../../assets/images/succsessful2.gif';
import '../../../assets/css/successgif.css';
import mplus from "../../../assets/images/mplus.png";
import QRCode from 'react-qr-code'; // Import QRCode
const Panelty = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [penaltyFor, setPenaltyFor] = useState('');
  const [penaltyRate, setPenaltyRate] = useState(0);
  const [noOfTimes, setNoOfTimes] = useState(1);
  const [amount, setAmount] = useState(0);
  const [penaltyTypes, setPenaltyTypes] = useState([]);
  const [success, setSuccess] = useState(false);
  const [modal, setModal] = useState(false);
  const [duplicateModal, setDuplicateModal] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState({});

  const receiptRef = useRef(null);
  const duplicateReceiptRef = useRef(null);

  

  useEffect(() => {
    const fetchPenaltyTypes = async () => {
      try {
        const imei = sessionStorage.getItem('IMEI');
        const emailID = sessionStorage.getItem('Email');
        const password = sessionStorage.getItem('Password');
        const token = sessionStorage.getItem('Token');
        const siteId = sessionStorage.getItem('SiteId');

        const response = await axios.post('https://testingNewAPI.mplusparking.com/AppServerCall/getPenaltyTypes', {
          imei,
          emailID,
          password,
          token,
          siteId
        });

        if (response.data?.Data?.penaltylist && Array.isArray(response.data.Data.penaltylist)) {
          setPenaltyTypes(response.data.Data.penaltylist);
          const initialPenalty = response.data.Data.penaltylist[0];
          setPenaltyFor(initialPenalty?.penaltyType || '');
          setPenaltyRate(initialPenalty?.charges || 0);
          setAmount(noOfTimes * (initialPenalty.charges || 0));
        } else {
          //console.error('Unexpected response data format:', response.data);
          setPenaltyTypes([]);
        }
      } catch (error) {
        //console.error('Error fetching penalty types:', error);
        setPenaltyTypes([]);
      }
    };

    fetchPenaltyTypes();
  }, []);

  const handleNoOfTimesChange = (e) => {
    const times = parseInt(e.target.value, 10);
    setNoOfTimes(times);
    setAmount(times * penaltyRate);
  };

  const handlePenaltyTypeChange = (e) => {
    const selectedPenalty = e.target.value;
    const penaltyInfo = penaltyTypes.find(penalty => penalty.penaltyType === selectedPenalty);
    if (penaltyInfo) {
      setPenaltyFor(penaltyInfo.penaltyType);
      setPenaltyRate(penaltyInfo.charges || 0);
      setAmount(noOfTimes * (penaltyInfo.charges || 0));
    }
  };
  

  const handlePenaltyRateChange = (e) => {
    const newRate = parseFloat(e.target.value) || 0;
    setPenaltyRate(newRate);
    setAmount(noOfTimes * newRate);
  };

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
      penaltyType: penaltyFor,
      penaltyRate:penaltyRate,
      no_of_time: noOfTimes
    };

    axios.post('https://testingNewAPI.mplusparking.com/AppServerCall/penaltyDetails', null, {
      params: storedSession
    })
      .then(response => {
        //console.log('Penalty details saved:', response.data);
        setVehicleDetails(response.data.Data);
        setSuccess(true);
        setModal(true);
        setTimeout(() => {
          setSuccess(false);
          setVehicleNumber('');
          setPenaltyFor('');
          setPenaltyRate(0);
          setNoOfTimes(1);
          setAmount(0);
        }, 2000);
      })
      .catch(error => {
        //console.error('Error saving penalty details:', error);
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
      // Close the window
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
 
              <CardTitle tag="h6" className="cardt text-center">Penalty</CardTitle>
              <FormGroup>
                <Label style={{ fontSize: '18px' }} for="vehicleNumber">Vehicle Number</Label>
                <Input
                  type="text"
                  id="vehicleNumber"
                  value={vehicleNumber}
                  placeholder="Enter Vehicle No"
                  onChange={(e) => setVehicleNumber(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label style={{ fontSize: '18px' }} for="penaltyType">Penalty Type</Label>
                <Input
                  type="select"
                  id="penaltyType"
                  value={penaltyFor}
                  onChange={handlePenaltyTypeChange}
                >
                  {penaltyTypes.map((penalty, index) => (
                    <option key={index} value={penalty.penaltyType}>
                      {penalty.penaltyType}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label style={{ fontSize: '18px' }} for="penaltyRate">Penalty Rate</Label>
                <Input
                  type="number"
                  id="penaltyRate"
                  value={penaltyRate}
                  onChange={handlePenaltyRateChange}
                  
                />
              </FormGroup>
              <FormGroup>
                <Label style={{ fontSize: '18px' }} for="noOfTimes">Number of Times</Label>
                <Input
                  type="number"
                  id="noOfTimes"
                  value={noOfTimes}
                  onChange={handleNoOfTimesChange}
                />
              </FormGroup>
              <FormGroup>
                <Label style={{ fontSize: '18px' }} for="amount">Total Amount</Label>
                <Input
                  type="text"
                  id="amount"
                  value={amount.toFixed(2)}
                  readOnly
                />
              </FormGroup>
              <Button color="primary" onClick={handleSubmit}>Submit</Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
      <ModalHeader toggle={() => setModal(!modal)}>Penalty Details</ModalHeader>
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
            <strong>PENALTY RECEIPT</strong> {/* Underlined via CSS */}
          </h4>
          <div className="receipt-item">
          <p>Vehicle Number:<strong> {vehicleDetails?.vehno || ''} </strong></p>
            <p>PenaltyNumber:<strong> {vehicleDetails?.PenaltyNumber || ''} </strong></p>
            <p>Penalty Type:<strong> {vehicleDetails?.penaltyType || ''} </strong></p>
            <p>Penalty Rate:<strong> {vehicleDetails?.penaltyrate || ''} </strong></p>
            <p>No of Times:<strong> {vehicleDetails?.no_of_time || ''} </strong></p>
            <p>Total Amount:<strong> {vehicleDetails?.amount || ''} </strong></p>
          </div>
          <p className="receipt-footer">
            <span style={{ fontSize: "10px", fontFamily: 'Arial' }}>
              We are not responsible for any vehicle damage or theft. Vehicles are parked at the
              owners risk. This receipt is valid for single-use only.
            </span>
          </p>
          {/* QR Code */}
          <div className="qrcode-container" style={{textAlign:'center'}}>
              <QRCode value={vehicleDetails.PenaltyNumber || ''} size={100} />
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

    <Modal isOpen={duplicateModal} toggle={() => setDuplicateModal(!duplicateModal)}>
      <ModalHeader toggle={() => setDuplicateModal(!duplicateModal)}>Penalty Details Duplicate</ModalHeader>
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
            <strong>PENALTY RECEIPT DUPLICATE</strong> {/* Underlined via CSS */}
          </h4>
          <div className="receipt-item">
            <p>Vehicle Number:<strong> {vehicleDetails?.vehno || ''} </strong></p>
            <p>PenaltyNumber:<strong> {vehicleDetails?.PenaltyNumber || ''} </strong></p>
            <p>Penalty Type:<strong> {vehicleDetails?.penaltyType || ''} </strong></p>
            <p>Penalty Rate:<strong> {vehicleDetails?.penaltyrate || ''} </strong></p>
            <p>No of Times:<strong> {vehicleDetails?.no_of_time || ''} </strong></p>
            <p>Total Amount:<strong> {vehicleDetails?.amount || ''} </strong></p>
       
          </div>
          <p className="receipt-footer">
            <span style={{ fontSize: "10px", fontFamily: 'Arial' }}>
              We are not responsible for any vehicle damage or theft. Vehicles are parked at the
              owners risk. This receipt is valid for single-use only.
            </span>
          </p>
           {/* QR Code */}
           <div className="qrcode-container" style={{textAlign:'center'}}>
              <QRCode value={vehicleDetails.PenaltyNumber || ''} size={100} />
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

export default Panelty;
