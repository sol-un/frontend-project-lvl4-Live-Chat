// @ts-check

import 'regenerator-runtime/runtime.js';
import 'core-js/stable/index.js';
import '../assets/application.scss';
import { io } from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import i18n from './i18n.js';
import rollbar from './rollbar.js';
import App from './App.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const socket = io();

const container = document.querySelector('#chat');
ReactDOM.render(<App socket={socket} rollbar={rollbar} i18n={i18n} />, container);
