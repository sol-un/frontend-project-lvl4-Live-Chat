import React from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import {
  Row, Col,
} from 'react-bootstrap';
import ChannelNav from './ChannelNav.jsx';
import Messages from './Messages.jsx';
import MessageForm from './MessageForm.jsx';
import { addMessage } from '../slices/messagesSlice.js';

const socket = io();

const App = () => {
  const dispatch = useDispatch();
  socket.on('newMessage', ({ data }) => {
    dispatch(addMessage(data));
  });
  return (
    <Row className="h-100 pb-3">
      <Col className="border-right" xs={3}>
        <ChannelNav />
      </Col>
      <Col className="d-flex flex-column h-100">
        <Messages />
        <MessageForm />
      </Col>
    </Row>
  );
};

export default App;
