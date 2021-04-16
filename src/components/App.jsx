import axios from 'axios';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import { Navbar, Button } from 'react-bootstrap';
import routes from '../routes.js';
import LogInForm from './LogInForm.jsx';
import Chat from './Chat.jsx';
import NoMatch from './NoMatch.jsx';
import { authContext } from '../contexts/index.jsx';
import { useAuth, useSocket } from '../hooks/index.jsx';
import messagesReducer, { addMessage } from '../slices/messages.js';
import channelsReducer from '../slices/channels.js';
import currentChannelIdReducer from '../slices/currentChannelId.js';

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

const PrivateRoute = ({ children, path }) => {
  const auth = useAuth();

  return (
    <Route
      path={path}
      render={({ location }) => (auth.loggedIn
        ? children
        : <Redirect to={{ pathname: '/login', state: { from: location } }} />)}
    />
  );
};

const AuthRoute = ({ children, path }) => {
  const auth = useAuth();

  return (
    <Route
      path={path}
      render={({ location }) => (auth.loggedIn
        ? <Redirect to={{ pathname: '/', state: { from: location } }} />
        : children)}
    />
  );
};

const LogOutButton = () => {
  const auth = useAuth();

  return auth.loggedIn && <Button className="ml-auto" variant="outline-secondary" onClick={auth.logOut}>Выйти</Button>;
};

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('hexletChatUserId'));

  if (userId) {
    return { Authorization: `Bearer ${userId}` };
  }

  return {};
};

export default () => {
  const [data, setData] = useState({ channels: [], messages: [], currentChannelId: null });

  useEffect(() => {
    const authHeader = getAuthHeader();
    async function getData() {
      const res = await axios({
        method: 'get',
        url: routes.dataPath(),
        headers: authHeader,
      });
      setData(res.data);
    }
    getData();
  }, []);

  const store = configureStore({
    reducer: {
      channels: channelsReducer,
      messages: messagesReducer,
      currentChannelId: currentChannelIdReducer,
    },
    preloadedState: data,
  });
  const { dispatch } = store;

  const socket = useSocket();
  socket.on('newMessage', (response) => dispatch(addMessage(response)));

  return (
    <div className="d-flex flex-column h-100">
      <AuthProvider>
        <Router>
          <Navbar className="mb-3" expand="lg">
            <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
            <LogOutButton />
          </Navbar>
          <Switch>
            <PrivateRoute exact path="/">
              <Provider store={store}>
                <Chat />
              </Provider>
            </PrivateRoute>
            <AuthRoute exact path="/login">
              <LogInForm />
            </AuthRoute>
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </Router>
      </AuthProvider>
    </div>
  );
};
