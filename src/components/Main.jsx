import axios from 'axios';
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
import { Navbar, NavDropdown, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import routes from '../routes.js';
import LogInForm from './LogInForm.jsx';
import SignUpForm from './SignUpForm.jsx';
import Chat from './Chat.jsx';
import NoMatch from './NoMatch.jsx';
import { useAuth, useSocket } from '../hooks/index.jsx';
import messagesReducer, { addMessage } from '../slices/messages.js';
import channelsReducer, { addChannel, renameChannel, removeChannel } from '../slices/channels.js';
import currentChannelIdReducer from '../slices/currentChannelId.js';
import uiStateReducer from '../slices/uiState.js';

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
  const { t } = useTranslation();
  return auth.loggedIn && <Button className="ml-2" variant="outline-secondary" onClick={auth.logOut}>{t('logout')}</Button>;
};

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('hexletChatUserId'));

  if (userId) {
    return { Authorization: `Bearer ${userId}` };
  }

  return {};
};

export default ({ i18n }) => {
  const [data, setData] = useState({
    channels: [],
    messages: [],
    currentChannelId: null,
    uiState: {
      type: null,
      channelId: null,
      channelName: null,
    },
  });
  const auth = useAuth();
  useEffect(() => {
    const authHeader = getAuthHeader();
    async function getData() {
      const res = await axios({
        method: 'get',
        url: routes.dataPath(),
        headers: authHeader,
      });
      setData((prevState) => ({ ...prevState, ...res.data }));
    }
    getData();
  }, [auth.loggedIn]);

  const store = configureStore({
    reducer: {
      channels: channelsReducer,
      messages: messagesReducer,
      currentChannelId: currentChannelIdReducer,
      uiState: uiStateReducer,
    },
    preloadedState: data,
  });
  const { dispatch } = store;

  const socket = useSocket();
  socket.on('newMessage', (response) => dispatch(addMessage(response)));
  socket.on('newChannel', (response) => dispatch(addChannel(response)));
  socket.on('renameChannel', (response) => dispatch(renameChannel(response)));
  socket.on('removeChannel', (response) => dispatch(removeChannel(response)));

  const handleSelect = (eventKey) => i18n.changeLanguage(eventKey);

  return (
    <div className="d-flex flex-column h-100">
      <Router>
        <Navbar className="mb-3" expand="lg">
          <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
          <NavDropdown className="ml-auto" id="nav-dropdown" title="&#127758;" onSelect={handleSelect}>
            <NavDropdown.Item eventKey="ru">RU</NavDropdown.Item>
            <NavDropdown.Item eventKey="en">EN</NavDropdown.Item>
          </NavDropdown>
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
          <AuthRoute exact path="/signup">
            <SignUpForm />
          </AuthRoute>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </Router>

    </div>
  );
};
