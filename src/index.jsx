/* eslint-disable import/no-unresolved */
import React from 'react';
import ReactDOM from 'react-dom';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../assets/application.scss';
import gon from 'gon';
import Rollbar from 'rollbar';
import { io } from 'socket.io-client';
import App from './App.jsx';

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
ReactDOM.render(<App gon={gon} rollbar={rollbar} socket={socket} />, container);
