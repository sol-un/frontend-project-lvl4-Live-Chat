/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import i18n from './src/i18n.js';
import rollbar from './src/rollbar.js';
import App from './src/App.jsx';

export default (mockSocket) => (<App socket={mockSocket} rollbar={rollbar} i18n={i18n} />);
