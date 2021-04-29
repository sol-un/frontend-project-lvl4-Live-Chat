/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import './src/i18n.js';
import App from './src/App.jsx';
import messagesReducer from './src/slices/messages.js';
import channelsReducer from './src/slices/channels.js';
import currentChannelIdReducer from './src/slices/currentChannelId.js';
import uiStateReducer from './src/slices/uiState.js';

const store = configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    currentChannelId: currentChannelIdReducer,
    uiState: uiStateReducer,
  },
});

export const { dispatch } = store;

export default (socket) => (
  <Provider store={store}>
    <App socket={socket} />
  </Provider>
);
