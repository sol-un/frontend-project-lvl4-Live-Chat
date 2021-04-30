import _ from 'lodash';
import React, { useState } from 'react';
import { authContext } from './contexts/index.jsx';
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

const App = () => (
  <AuthProvider>
    <Main />
  </AuthProvider>
);

export default App;
