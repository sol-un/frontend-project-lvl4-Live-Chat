// @ts-check

import 'regenerator-runtime/runtime.js';
import 'core-js/stable/index.js';
import '../assets/application.scss';
import { io } from 'socket.io-client';
import ReactDOM from 'react-dom';
import Rollbar from 'rollbar';
import init from '../index.js';

const rollbar = new Rollbar( // eslint-disable-line no-unused-vars
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

init(socket).then((app) => {
  const container = document.querySelector('#chat');
  ReactDOM.render(app, container);
});
