// @ts-check

import 'regenerator-runtime/runtime.js';
import 'core-js/stable/index.js';
import '../assets/application.scss';
import { io } from 'socket.io-client';
import _ from 'lodash';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Rollbar from 'rollbar';
import App from './components/App.jsx';
import { socketContext, authContext } from './contexts/index.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const AuthProvider = ({ children }) => {
  const isLoggedIn = _.has(localStorage, 'hexletChatUserId');
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const [username, setUsername] = useState(null);

  const logIn = (name) => {
    setUsername(name);
    setLoggedIn(true);
  };
  const logOut = () => {
    localStorage.removeItem('hexletChatUserId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{
      username, loggedIn, logIn, logOut,
    }}
    >
      {children}
    </authContext.Provider>
  );
};

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

const logError = (error) => {
  console.log(error);
  rollbar.error(error);
};

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
    <button type="button" onClick={resetErrorBoundary}>Try again</button>
  </div>
);

const socket = io();

const container = document.querySelector('#chat');
ReactDOM.render(
  <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
    <AuthProvider>
      <socketContext.Provider value={socket}>
        <App />
      </socketContext.Provider>
    </AuthProvider>
  </ErrorBoundary>,
  container,
);
