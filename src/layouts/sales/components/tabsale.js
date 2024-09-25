import React, { useState } from 'react';
import { Container, Row, Col, Card, CardImg, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import Panelty from './panelty'; 
import Pass from './pass'; 
import p1 from '../../../assets/images/penalty1.mp4';
import p2 from '../../../assets/images/pass1.mp4';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/tab.css'; 

const Tabsales = () => {
  const [modalPanelty, setModalPanelty] = useState(false);
  const [modalPass, setModalPass] = useState(false);

  const toggleModalPanelty = () => setModalPanelty(!modalPanelty);
  const toggleModalPass = () => setModalPass(!modalPass);

  return (
    <Container>
      <Row>
        {/* Panelty card */}
        <Col md="6" onClick={toggleModalPanelty}>
          <Card className="clickable-card" style={{ boxShadow:'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
          <CardBody>
              <CardTitle tag="h4" style={{ fontWeight: '800' }}>Penalty</CardTitle>
            </CardBody>
            {/* <CardImg className='cimg' top width="100%" height="330px" src={p1} alt="Panelty" /> */}
            <div className="video-container">
              <video width="100%" height="100%" autoPlay loop muted>
                <source src={p1} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </Card>
        </Col>

        {/* Pass card */}
        <Col md="6" onClick={toggleModalPass}>
          <Card className="clickable-card" style={{ boxShadow:'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
          <CardBody>
              <CardTitle tag="h4" style={{ fontWeight: '800' }}>Pass</CardTitle>
            </CardBody>
            {/* <CardImg className='cimg' top width="100%" height="330px" src={p2} alt="Pass" /> */}
            <div className="video-container">
              <video width="100%" height="100%" autoPlay loop muted>
                <source src={p2} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Modal for Panelty */}
      <Modal isOpen={modalPanelty} toggle={toggleModalPanelty} size="lg" centered>
        <ModalHeader toggle={toggleModalPanelty}>Penalty</ModalHeader>
        <ModalBody>
          <Panelty />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModalPanelty}>Close</Button>
        </ModalFooter>
      </Modal>

      {/* Modal for Pass */}
      <Modal isOpen={modalPass} toggle={toggleModalPass} size="lg" centered>
        <ModalHeader toggle={toggleModalPass}>Pass</ModalHeader>
        <ModalBody>
          <Pass />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModalPass}>Close</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Tabsales;
