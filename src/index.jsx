// @ts-check

import 'regenerator-runtime/runtime.js';
import 'core-js/stable/index.js';
import '../assets/application.scss';
import { io } from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import Rollbar from 'rollbar';
import i18n from './i18n.js';
import App from './App.jsx';

export default new Rollbar(
  {
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: 'production',
    },
  },
);

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const socket = io();

const container = document.querySelector('#chat');
ReactDOM.render(<App socket={socket} i18n={i18n} />, container);
