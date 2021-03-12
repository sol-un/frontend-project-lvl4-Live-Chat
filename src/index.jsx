/* eslint-disable import/no-unresolved */
import React from 'react';
import ReactDOM from 'react-dom';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../assets/application.scss';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import gon from 'gon';
import App from './components/App.jsx';
import { channelsReducer, messagesReducer, currentChannelIdReducer } from './slices/index.js';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const store = configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    currentChannelId: currentChannelIdReducer,
  },
  preloadedState: gon,
});

const container = document.querySelector('#chat');
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  container,
);
