/* eslint-disable react/destructuring-assignment, react/jsx-filename-extension */

import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import './src/i18n.js';
import App from './src/App.jsx';
import messagesReducer, { addMessage } from './src/slices/messages.js';
import channelsReducer, { addChannel, renameChannel, removeChannel } from './src/slices/channels.js';
import currentChannelIdReducer from './src/slices/currentChannelId.js';
import uiStateReducer from './src/slices/uiState.js';
import { socketContext } from './src/contexts/index.jsx';

const store = configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    currentChannelId: currentChannelIdReducer,
    uiState: uiStateReducer,
  },
});

const { dispatch } = store;

export default (socket) => {
  socket.on('newMessage', (response) => dispatch(addMessage(response)));
  socket.on('newChannel', (response) => dispatch(addChannel(response)));
  socket.on('renameChannel', (response) => dispatch(renameChannel(response)));
  socket.on('removeChannel', (response) => dispatch(removeChannel(response)));

  return (
    <Provider store={store}>
      <socketContext.Provider value={socket}>
        <App />
      </socketContext.Provider>
    </Provider>
  );
};
