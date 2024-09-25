import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, FormGroup, Label, Input, Button, Table } from 'reactstrap';
import axios from 'axios';
import '../css/tab.css'; // Import your CSS file for custom styling
import mplus from "../../../assets/images/mplus.png";
import '../../../assets/css/successgif.css';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
const Details = () => {
  const [search, setSearch] = useState('');
  const [reprintData, setReprintData] = useState(null);
  const receiptRef = useRef(null);
  const handleShowReports = async () => {
    try {
      const imei = sessionStorage.getItem('IMEI');
      const emailID = sessionStorage.getItem('Email');
      const password = sessionStorage.getItem('Password');
      const token = sessionStorage.getItem('Token');

      if (!imei || !emailID || !password || !token) {
        //console.error('Required session parameters are missing');
        return;
      }

      const url = `https://testingNewAPI.mplusparking.com/AppServerCall/getReprint`;
      const data = {
        imei,
        emailID,
        password,
        token,
        search
      };

      const response = await axios.post(url, data);

      //console.log('Reprint data:', response.data);
      setReprintData(response.data);
    } catch (error) {
      //console.error('Error fetching reprint data:', error);
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


  const generatePDF = (receiptRef) => {
    const receiptElement = receiptRef.current;

    // Add padding/margin to the receipt element
    const originalStyle = receiptElement.style.cssText;
    receiptElement.style.padding = '10px';
    receiptElement.style.margin = '10px';
    receiptElement.style.boxSizing = 'border-box';

    html2canvas(receiptElement, { scale: 2 }).then((canvas) => {
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

      pdf.save('Details Report.pdf');

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
              <CardTitle tag="h6" className="cardt text-center">Details</CardTitle>
              <FormGroup>
                <Label style={{ fontSize: '18px' }} for="search">Search</Label>
                <Input
                  type="text"
                  id="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Enter search parameter"
                />
              </FormGroup>
              <Button className='mybutton' color="info" block onClick={handleShowReports}>Show Reports</Button>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {reprintData && reprintData.ShResult === 100 && (
        <Row className="justify-content-center mt-4">
          <Col md="8">
            <Card>
              <CardBody>
                <CardTitle tag="h6" className="cardt text-center">Reprint Data</CardTitle>
                {reprintData.Data.Reprintlist.length > 0 ? (
                  <div id="printable-receipt" ref={receiptRef} className="receipt">
                    <div className="receipt-header">
                      <h4 className="receipt-title"><strong>Sales Receipt</strong></h4>
                      <img src={mplus} height="80" width="150" className="center-image" alt="Logo" />
                      <div className="receipt-description">
                        <p><strong>{reprintData.siteName}</strong></p>
                        <p>MANAGED BY</p>
                        <p><strong>M PLUS PARKING</strong></p>
                      </div>
                    </div>

                    <h4 className="receipt-title"><strong>Reprint Report</strong></h4>
                    <Table>
                      <tbody>
                        {reprintData.Data.Reprintlist.map((item, index) => (
                          <tr key={index}>
                            <div className="receipt-item">
                              <p >Vehicle No: <strong >{item.vehno}</strong></p>
                              <p>Tick No: <strong>{item.receipt}</strong></p>
                              <p>Intime: <strong>{item.intime}</strong></p>
                              <p>Outtime: <strong>{item.outtime === '-' ? 'N/A' : item.outtime}</strong></p>
                              <p>Vehicle Type: <strong>{item.vehtype === '-' ? 'N/A' : item.vehtype}</strong></p>
                              <p>Amount: <strong>{item.amount === '-' ? 'N/A' : item.amount}</strong></p>
                              <p>Pass Validity: <strong>{item.passvalidity === '-' ? 'N/A' : item.passvalidity}</strong></p>
                              <p>Penalty Amount: <strong>{item.penaltyamount === '-' ? 'N/A' : item.penaltyamount}</strong></p>
                              <p>Penalty Type: <strong>{item.penaltytype === '-' ? 'N/A' : item.penaltytype}</strong></p>
                            </div>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <p className="receipt-footer">
                      <br />
                      <span style={{ fontSize: "10px", fontFamily: 'Arial' }}>
                        We are not responsible for any vehicle damage or theft. Vehicles are parked at the
                        owners risk. This receipt is valid for single-use only.
                      </span>
                    </p>
                  </div>
                ) : (
                  <p>No reprint items found.</p>
                )}
                <Row>
                  <Col md={6}>
                    <Button className="w-100 mt-2" onClick={() => generatePDF(receiptRef)}>
                      Download PDF
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button className="w-100 mt-2" color="primary" onClick={printReceipt}>
                      Print Receipt
                    </Button>
                  </Col>
                </Row>
              </CardBody>

            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Details;