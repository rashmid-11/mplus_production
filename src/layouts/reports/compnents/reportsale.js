import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, FormGroup, Label, Input, Button, Table } from 'reactstrap';
import axios from 'axios';
import '../css/tab.css';
import mplus from "../../../assets/images/mplus.png";
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
const Reportsale = () => {
  const [selectDate, setSelectDate] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalVeh, setTotalVeh] = useState(0);
  const receiptRef = useRef(null);

  const [passTypes, setPassTypes] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [penaltyTypes, setPenaltyTypes] = useState([]);

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

        //console.log('Penalty Types API response:', response.data);

        if (response.data?.Data?.penaltylist && Array.isArray(response.data.Data.penaltylist)) {
          setPenaltyTypes(response.data.Data.penaltylist);
        }
      } catch (error) {
        //console.error('Error fetching penalty types:', error);
      }
    };

    fetchPenaltyTypes();
  }, []);

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const imei = sessionStorage.getItem('IMEI');
        const emailID = sessionStorage.getItem('Email');
        const password = sessionStorage.getItem('Password');
        const token = sessionStorage.getItem('Token');
        const siteId = sessionStorage.getItem('SiteId');

        const response = await axios.post('https://testingNewAPI.mplusparking.com/AppServerCall/getVehicleTypes', null, {
          params: { imei, emailID, password, token, siteId }
        });

        //console.log('Vehicle Types API response:', response.data);

        if (response.data?.Data?.list && Array.isArray(response.data.Data.list)) {
          setVehicleTypes(response.data.Data.list); // Update to use 'list' from API response
        }
      } catch (error) {
        //console.error('Error fetching vehicle types:', error);
      }
    };

    fetchVehicleTypes();
  }, []);

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

        //console.log('Pass Types API response:', response.data);

        if (response.data?.Data?.passlist && Array.isArray(response.data.Data.passlist)) {
          setPassTypes(response.data.Data.passlist);
        }
      } catch (error) {
        //console.error('Error fetching pass types:', error);
      }
    };

    fetchPassTypes();
  }, []);
  const handleShowSales = async () => {
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

      const url = `https://testingNewAPI.mplusparking.com/AppServerCall/getRequests`;
      const data = {
        imei,
        emailID,
        password,
        token,
        search: selectDate,
        type: 1
      };

      const response = await axios.post(url, data);

      //console.log('Sales Data API response:', response.data);
      //console.log('Selected Date:', selectDate);

      if (response.data && response.data.Data && Array.isArray(response.data.Data.list)) {
        const list = response.data.Data.list;
        setSalesData(list);

        // Initialize counts and totals
        const vehicleCounts = {};
        const passCounts = {};
        const penaltyCounts = {};
        const vehicleAmounts = {};
        const passAmounts = {};
        const penaltyAmounts = {};

        // Filtered lists for debugging
        const filteredPasses = [];
        const filteredPenalties = [];

        list.forEach(item => {
          // Log the item dates
          // //console.log('Item Pass Start Date:', item.passstartdate);
          // //console.log('Item Penalty Time:', item.penaltytime);

          // Filter by pass start date for passes
          if (item.passstartdate && item.passstartdate.includes(selectDate)) {
            filteredPasses.push(item);
            //console.log(`Matching Pass Start Date: ${item.passstartdate}`);
            const passType = item.passType;
            if (passCounts[passType]) {
              passCounts[passType]++;
            } else {
              passCounts[passType] = 1;
            }
            if (passAmounts[passType]) {
              passAmounts[passType] += parseFloat(item.passAmount || 0);
            } else {
              passAmounts[passType] = parseFloat(item.passAmount || 0);
            }
          }

          // Filter by penalty time for penalties
          if (item.penaltytime && item.penaltytime.includes(selectDate)) {
            filteredPenalties.push(item);
            //console.log(`Matching Penalty Time: ${item.penaltytime}`);
            const penaltyType = item.penaltyType;
            if (penaltyCounts[penaltyType]) {
              penaltyCounts[penaltyType]++;
            } else {
              penaltyCounts[penaltyType] = 1;
            }
            if (penaltyAmounts[penaltyType]) {
              penaltyAmounts[penaltyType] += parseFloat(item.charges || 0);
            } else {
              penaltyAmounts[penaltyType] = parseFloat(item.charges || 0);
            }
          }

          // Update vehicle counts and amounts
          const vehicleType = item.vehicleType;
          if (vehicleCounts[vehicleType]) {
            vehicleCounts[vehicleType]++;
          } else {
            vehicleCounts[vehicleType] = 1;
          }
          if (vehicleAmounts[vehicleType]) {
            vehicleAmounts[vehicleType] += parseFloat(item.amount || 0);
          } else {
            vehicleAmounts[vehicleType] = parseFloat(item.amount || 0);
          }
        });

        //console.log('Filtered Passes:', filteredPasses.length);
        //console.log('Filtered Penalties:', filteredPenalties.length);
        //console.log('Filtered Passes Details:', filteredPasses);
        //console.log('Filtered Penalties Details:', filteredPenalties);

        setTotalVeh(Object.values(vehicleCounts).reduce((a, b) => a + b, 0));
        setTotalAmount(Object.values(vehicleAmounts).reduce((a, b) => a + b, 0));
      } else {
        //console.error('Unexpected data format:', response.data);
        setSalesData([]);
      }
    } catch (error) {
      //console.error('Error fetching sales data:', error);
    }
  };


  const renderTableRows = () => {
    // Calculate totals based on filtered data
    const filteredPasses = salesData.filter(item => item.passstartdate && item.passstartdate.includes(selectDate));
    const filteredPenalties = salesData.filter(item => item.penaltytime && item.penaltytime.includes(selectDate));

    const totalPassAmount = filteredPasses
      .reduce((acc, curr) => acc + (parseFloat(curr.passamount) || 0), 0);

    const totalPenaltyAmount = filteredPenalties
      .reduce((acc, curr) => acc + (parseFloat(curr.penaltyamount) || 0), 0);

    const totalVehicleAmount = salesData
      .filter(item => item.amount)
      .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

    const grandTotalAmount = totalPassAmount + totalPenaltyAmount + totalVehicleAmount;

    const vehicleRows = vehicleTypes.map(vehicleType => {
      const count = salesData.filter(item => item.vehtype === vehicleType.vehType).length;
      const amount = salesData
        .filter(item => item.vehtype === vehicleType.vehType)
        .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

      return (
        <tr key={vehicleType.vehTypeId}>
          <td style={{ fontSize: '12px' }}>{vehicleType.vehType}</td>
          <td style={{ fontSize: '12px' }}>{count}</td>
          <td style={{ fontSize: '12px' }}>{amount.toFixed(2)}</td>
        </tr>
      );
    });

    const passRows = passTypes.map(passType => {
      const count = filteredPasses.filter(item => item.passtype === passType.passType).length;
      const amount = filteredPasses
        .filter(item => item.passtype === passType.passType)
        .reduce((acc, curr) => acc + (parseFloat(curr.passamount) || 0), 0);

      return (
        <tr key={passType.idpass}>
          <td style={{ fontSize: '12px' }}>{passType.passType}</td>
          <td style={{ fontSize: '12px' }}>{count}</td>
          <td style={{ fontSize: '12px' }}>{amount.toFixed(2)}</td>
        </tr>
      );
    });

    const penaltyRows = penaltyTypes.map(penaltyType => {
      const count = filteredPenalties.filter(item => item.penaltytype === penaltyType.penaltyType).length;
      const amount = filteredPenalties
        .filter(item => item.penaltytype === penaltyType.penaltyType)
        .reduce((acc, curr) => acc + (parseFloat(curr.penaltyamount) || 0), 0);

      return (
        <tr key={penaltyType.idpenalty}>
          <td style={{ fontSize: '12px' }}>{penaltyType.penaltyType}</td>
          <td style={{ fontSize: '12px' }}>{count}</td>
          <td style={{ fontSize: '12px' }}>{amount.toFixed(2)}</td>
        </tr>
      );
    });

    return (
      <>
        {vehicleRows}
        {passRows}
        {penaltyRows}
        <tr style={{ fontWeight: 'bold' }}>
          <td style={{ fontSize: '12px' }}>Total</td>
          <td style={{ fontSize: '12px' }}>{salesData.length}</td>
          <td style={{ fontSize: '12px' }}>{grandTotalAmount.toFixed(2)}</td>
        </tr>
      </>
    );
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
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };
  };

  const generatePDF = (receiptRef) => {
    const receiptElement = receiptRef.current;

    // Add padding/margin to the receipt element
    const originalStyle = receiptElement.style.cssText;
    receiptElement.style.padding = '10px';
    receiptElement.style.margin = '20px';
    receiptElement.style.boxSizing = 'border-box';

    html2canvas(receiptElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      // Adjust imgWidth and calculate imgHeight based on aspect ratio
      const imgWidth = 180; // Adjusted width for better spacing
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add margin to the PDF (left and top)
      const marginLeft = 15; // Left margin
      const marginTop = 10; // Top margin

      pdf.addImage(imgData, 'PNG', marginLeft, marginTop, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', marginLeft, position + marginTop, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('Sales Report.pdf');

      // Reset the style after generating the PDF
      receiptElement.style.cssText = originalStyle;
    });
  };


  // const generatePDF = (receiptRef) => {
  //   const receiptElement = receiptRef.current;

  //   // Add padding/margin to the receipt element
  //   const originalStyle = receiptElement.style.cssText;
  //   receiptElement.style.padding = '10px';
  //   receiptElement.style.margin = '10px';
  //   receiptElement.style.boxSizing = 'border-box';


  //   html2canvas(receiptElement, { scale: 2 }).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF();
  //     const imgWidth = 210;
  //     const pageHeight = 295;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     let heightLeft = imgHeight;

  //     let position = 0;

  //     pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;

  //     while (heightLeft >= 0) {
  //       position = heightLeft - imgHeight;
  //       pdf.addPage();
  //       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;
  //     }

  //     pdf.save('Sales Report.pdf');

  //     // Reset the style after generating the PDF
  //     receiptElement.style.cssText = originalStyle;
  //   });
  // };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md="8">
          <Card className='formcard'>
            <CardBody>
              <CardTitle tag="h6" className="cardt text-center">Sales</CardTitle>

              <FormGroup>
                <Label style={{ fontSize: '18px' }} for="selectDate">Select Date</Label>
                <Input
                  type="date"
                  id="selectDate"
                  value={selectDate}
                  onChange={(e) => setSelectDate(e.target.value)}
                  placeholder="dd-mm-yyyy"
                />
              </FormGroup>

              <Button className='mybutton' color="info" block onClick={handleShowSales}>Show</Button>

            </CardBody>
          </Card>
        </Col>
      </Row>

      {salesData.length > 0 && (
        <Row className="justify-content-center mt-4">
          <Col md="8">
            <Card>
              <CardBody>
                <div id="printable-receipt" ref={receiptRef} className="receipt">
                  <img src={mplus} height="80" width="150" className="center-image" alt="Logo" />
                  <div className="receipt-description">
                    <p><strong>{sessionStorage.getItem('SiteName')}</strong></p>
                    <p>MANAGED BY</p>
                    <p><strong>M PLUS PARKING</strong></p>
                  </div>

                  <h4 className="receipt-title">Sales Date: {selectDate}</h4>

                  <Table>
                    <thead>
                      <tr>
                        <th style={{ fontSize: '13px' }}>VEH</th>
                        <th style={{ fontSize: '13px' }}>QTY</th>
                        <th style={{ fontSize: '13px' }}>AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderTableRows()}
                    </tbody>
                  </Table>

                  <p className="receipt-footer">
                    <span style={{ fontSize: "10px", fontFamily: 'Arial' }}>
                      We are not responsible for any vehicle damage or theft. Vehicles are parked at the
                      owners risk. This receipt is valid for single-use only.
                    </span>
                  </p>
                </div>
                <Row>
                  <Col md={6}  >
                    <Button  className="w-100 mt-2" onClick={() => generatePDF(receiptRef)}>
                      Download PDF
                    </Button>
                  </Col>
                
                  <Col md={6} >
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

export default Reportsale;
