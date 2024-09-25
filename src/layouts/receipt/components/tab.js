import React, { useState } from 'react';
import { Row, Col, Card, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter, Button ,CardImg} from 'reactstrap';
import VehicleIn from './vehiclein'; // Import the VehicleIn component
import VehicleOut from './vehicleout'; // Import the VehicleOut component

import vin from '../../../assets/images/In.mp4';
import parking from '../../../assets/images/Out.mp4';



import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/tab.css'; // Import the custom CSS file
import { Container } from 'react-bootstrap';
import in2 from '../../../assets/images/in2.jpg'; 
import out from '../../../assets/images/out2.jpg';
const Tabsnew = () => {
  const [modalIn, setModalIn] = useState(false);
  const [modalOut, setModalOut] = useState(false);

  const toggleModalIn = () => setModalIn(!modalIn);
  const toggleModalOut = () => setModalOut(!modalOut);

  return (
    <Container>
      <Row>
        {/* Vehicle In card */}
        <Col md="6" onClick={toggleModalIn}>
          <Card className="clickable-card" style={{ boxShadow:'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
          <CardBody>
              <CardTitle tag="h4" style={{ fontWeight: '800' }}>Vehicle In</CardTitle>
            </CardBody>
            {/* <CardImg className='cimg' top width="100%" height="330px" src={in2} alt="User Wise Reports" /> */}
             <div className="video-container">
              <video width="100%" height="100%" autoPlay loop muted>
                <source src={vin} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
           
          </Card>
        </Col>

        {/* Vehicle Out card */}
        <Col md="6" onClick={toggleModalOut}>
          <Card className="clickable-card" style={{ boxShadow:'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
          <CardBody>
              <CardTitle tag="h4" style={{ fontWeight: '800' }}>Vehicle Out</CardTitle>
            </CardBody>
            {/* <CardImg className='cimg' top width="100%" height="330px" src={out} alt="User Wise Reports" /> */}
            <div className="video-container">
              <video width="100%" height="100%" autoPlay loop muted>
                <source src={parking} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          
          </Card>
        </Col>
      </Row>

      {/* Modal for Vehicle In form */}
      <Modal isOpen={modalIn} toggle={toggleModalIn} size="lg" centered>
        <ModalHeader toggle={toggleModalIn}>Vehicle In</ModalHeader>
        <ModalBody>
          <VehicleIn />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModalIn}>Close</Button>
        </ModalFooter>
      </Modal>

      {/* Modal for Vehicle Out form */}
      <Modal isOpen={modalOut} toggle={toggleModalOut} size="lg" centered>
        <ModalHeader toggle={toggleModalOut}>Vehicle Out</ModalHeader>
        <ModalBody>
          <VehicleOut />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModalOut}>Close</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Tabsnew;
