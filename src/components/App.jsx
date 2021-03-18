import 'regenerator-runtime/runtime';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';
import faker from 'faker';
import Cookies from 'js-cookie';
import {
  Row, Col,
} from 'react-bootstrap';
import ChannelNav from './ChannelNav.jsx';
import Messages from './Messages.jsx';
import MessageForm from './MessageForm.jsx';
import messagesReducer, { addMessage } from '../slices/messages.js';
import channelsReducer, { addChannel, renameChannel, removeChannel } from '../slices/channels.js';
import AppContext from '../app-context.js';

import currentChannelIdReducer from '../slices/currentChannelId.js';

const setUserNameIfEmpty = () => {
  // eslint-disable-next-line
  let userName = Cookies.get('hexletChatUserName');
  if (!userName) {
    userName = faker.internet.userName();
    Cookies.set('hexletChatUserName', userName);
  }
  return userName;
};

// eslint-disable-next-line react/prop-types
const App = ({ gon }) => {
  const store = configureStore({
    reducer: {
      channels: channelsReducer,
      messages: messagesReducer,
      currentChannelId: currentChannelIdReducer,
    },
    preloadedState: gon,
  });
  const { dispatch } = store;

  const socket = io();
  socket.on('newMessage', ({ data }) => dispatch(addMessage(data)));
  socket.on('newChannel', ({ data }) => dispatch(addChannel(data)));
  socket.on('renameChannel', ({ data }) => dispatch(renameChannel(data)));
  socket.on('removeChannel', ({ data }) => dispatch(removeChannel(data)));

  return (
    <Provider store={store}>
      <AppContext.Provider value={setUserNameIfEmpty()}>
        <Row className="h-100 pb-3">
          <Col className="border-right" xs={3}>
            <ChannelNav />
          </Col>
          <Col className="d-flex flex-column justify-content-end h-100">
            <Messages />
            <MessageForm />
          </Col>
        </Row>
      </AppContext.Provider>
    </Provider>
  );
};

export default App;
