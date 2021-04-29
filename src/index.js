/* eslint-disable react/jsx-filename-extension */
// @ts-check

import 'regenerator-runtime/runtime.js';
import 'core-js/stable/index.js';
import '../assets/application.scss';
import { io } from 'socket.io-client';
import ReactDOM from 'react-dom';
import Rollbar from 'rollbar';
import './i18n.js';
import init, { dispatch } from '../index.js';
import { addMessage } from './slices/messages.js';
import { addChannel, renameChannel, removeChannel } from './slices/channels.js';

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
socket.on('newMessage', (response) => dispatch(addMessage(response)));
socket.on('newChannel', (response) => dispatch(addChannel(response)));
socket.on('renameChannel', (response) => dispatch(renameChannel(response)));
socket.on('removeChannel', (response) => dispatch(removeChannel(response)));

const app = init(socket);

const container = document.querySelector('#chat');
ReactDOM.render(app, container);
