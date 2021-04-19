import axios from 'axios';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
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
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import ru from '../locales/ru.js';
import en from '../locales/en.js';
import routes from '../routes.js';
import LogInForm from './LogInForm.jsx';
import SignUpForm from './SignUpForm.jsx';
import Chat from './Chat.jsx';
import NoMatch from './NoMatch.jsx';
import { authContext } from '../contexts/index.jsx';
import { useAuth, useSocket } from '../hooks/index.jsx';
import messagesReducer, { addMessage } from '../slices/messages.js';
import channelsReducer, { addChannel, renameChannel, removeChannel } from '../slices/channels.js';
import currentChannelIdReducer from '../slices/currentChannelId.js';
import uiStateReducer from '../slices/uiState.js';

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

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
    <button type="button" onClick={resetErrorBoundary}>Try again</button>
  </div>
);

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

export default ({ rollbar }) => {
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
  }, []);

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

  const logError = (error) => {
    console.log(error);
    rollbar.error(error);
  };

  return (
    <div className="d-flex flex-column h-100">
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
        <AuthProvider>
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
        </AuthProvider>
      </ErrorBoundary>
    </div>
  );
};
