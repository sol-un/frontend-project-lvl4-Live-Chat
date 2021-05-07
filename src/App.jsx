import _ from 'lodash';
import React, { useState } from 'react';
import { authContext } from './contexts/index.jsx';
import Main from './components/Main.jsx';

const AuthProvider = ({ children }) => {
  const isLoggedIn = _.has(localStorage, 'hexletChatUserId');
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);

  const getAuthHeader = () => {
    const userId = JSON.parse(localStorage.getItem('hexletChatUserId'));

    if (userId) {
      return { Authorization: `Bearer ${userId}` };
    }

    return {};
  };

  const getUserName = () => JSON.parse(localStorage.getItem('hexletChatUserName'));

  const saveUserId = (token) => localStorage.setItem('hexletChatUserId', JSON.stringify(token));

  const logIn = (name) => {
    localStorage.setItem('hexletChatUserName', JSON.stringify(name));
    setLoggedIn(true);
  };
  const logOut = () => {
    localStorage.removeItem('hexletChatUserId');
    localStorage.removeItem('hexletChatUserName');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{
      username: getUserName(),
      getAuthHeader,
      saveUserId,
      loggedIn,
      logIn,
      logOut,
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
