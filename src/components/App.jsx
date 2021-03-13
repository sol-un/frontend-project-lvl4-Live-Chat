import React from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
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
    <>
      <Messages />
      <MessageForm />
    </>
  );
};

export default App;
