// @ts-check

import 'regenerator-runtime/runtime.js';
import 'core-js/stable/index.js';
import '../assets/application.scss';
import { io } from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import Rollbar from 'rollbar';
import App from './components/App.jsx';
import { socketContext } from './contexts/index.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const rollbar = new Rollbar(
  {
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: 'production',
    },
  },
);

const socket = io();

const container = document.querySelector('#chat');
ReactDOM.render(
  <socketContext.Provider value={socket}>
    <App rollbar={rollbar} />
  </socketContext.Provider>,
  container,
);
