/* eslint-disable react/prop-types */
import 'regenerator-runtime/runtime';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';
import faker from 'faker';
import Cookies from 'js-cookie';
import Rollbar from 'rollbar';
import { ErrorBoundary } from 'react-error-boundary';
import {
  Row, Col,
} from 'react-bootstrap';
import AppContext from './app-context.js';
import ChannelNav from './components/ChannelNav.jsx';
import Messages from './components/Messages.jsx';
import MessageForm from './components/MessageForm.jsx';
import messagesReducer, { addMessage } from './slices/messages.js';
import channelsReducer, { addChannel, renameChannel, removeChannel } from './slices/channels.js';
import currentChannelIdReducer from './slices/currentChannelId.js';

const setUserNameIfEmpty = () => {
  // eslint-disable-next-line
  let userName = Cookies.get('hexletChatUserName');
  if (!userName) {
    userName = faker.internet.userName();
    Cookies.set('hexletChatUserName', userName);
  }
  return userName;
};

const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: 'production',
  },
});

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
    <button type="button" onClick={resetErrorBoundary}>Try again</button>
  </div>
);

const logToRollbar = (error) => rollbar.error(error);

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
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={logToRollbar}>
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
    </ErrorBoundary>
  );
};

export default App;