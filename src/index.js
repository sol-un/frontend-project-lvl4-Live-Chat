// @ts-check

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import '../assets/application.scss';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import gon from 'gon';
import app from './App.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const container = document.querySelector('#chat');
app(container, gon);
