import React from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import {
  Row, Col,
} from 'react-bootstrap';
import ChannelNav from './ChannelNav.jsx';
import Messages from './Messages.jsx';
import MessageForm from './MessageForm.jsx';
import { addMessage } from '../slices/messages.js';
import { addChannel, renameChannel, removeChannel } from '../slices/channels.js';

const socket = io();

const Chat = () => {
  const dispatch = useDispatch();

  socket.on('newMessage', ({ data }) => dispatch(addMessage(data)));
  socket.on('newChannel', ({ data }) => dispatch(addChannel(data)));
  socket.on('renameChannel', ({ data }) => dispatch(renameChannel(data)));
  socket.on('removeChannel', ({ data }) => dispatch(removeChannel(data)));

  return (
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
};

export default Chat;
