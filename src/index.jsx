// @ts-check

import 'regenerator-runtime/runtime.js';
import 'core-js/stable/index.js';
import '../assets/application.scss';
import { io } from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import { socketContext } from './contexts/index.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const socket = io();

const container = document.querySelector('#chat');
ReactDOM.render(
  <socketContext.Provider value={socket}>
    <App />
  </socketContext.Provider>,
  container,
);
