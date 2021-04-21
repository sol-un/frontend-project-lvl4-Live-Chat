// @ts-check

import 'regenerator-runtime/runtime.js';
import 'core-js/stable/index.js';
import '../assets/application.scss';
import { io } from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import Rollbar from 'rollbar';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.js';
import en from './locales/en.js';
import App from './App.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru,
      en,
    },
    lng: 'ru',
    fallbackLng: 'ru',
  });

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
ReactDOM.render(<App socket={socket} rollbar={rollbar} i18n={i18n} />, container);
