import _ from 'lodash';
import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { socketContext, authContext } from './contexts/index.jsx';
import Main from './components/Main.jsx';

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

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
    <button type="button" onClick={resetErrorBoundary}>Try again</button>
  </div>
);

export default ({ socket, rollbar, i18n }) => {
  const logError = (error) => {
    console.log(error);
    rollbar.error(error);
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      <AuthProvider>
        <socketContext.Provider value={socket}>
          <Main i18n={i18n} />
        </socketContext.Provider>
      </AuthProvider>
    </ErrorBoundary>
  );
};
