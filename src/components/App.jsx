import React from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import Messages from './Messages.jsx';
import MessageForm from './MessageForm.jsx';
import { fetchMessages } from '../slices/messagesSlice.js';

const socket = io();

const App = () => {
  const dispatch = useDispatch();
  socket.on('newMessage', ({ data }) => {
    const { attributes } = data;
    dispatch(fetchMessages(attributes.channelId));
  });
  return (
    <>
      <Messages />
      <MessageForm />
    </>
  );
};

export default App;
