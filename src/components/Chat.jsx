import React from 'react';

import {
  Row, Col,
} from 'react-bootstrap';
import ChannelNav from './ChannelNav.jsx';
import Messages from './Messages.jsx';
import MessageForm from './MessageForm.jsx';

export default () => (
  <Row className="h-100 pb-3">
    <Col className="border-right" xs={3}>
      <ChannelNav />
    </Col>
    <Col className="d-flex flex-column justify-content-end h-100">
      <Messages />
      <MessageForm />
    </Col>
  </Row>
);
