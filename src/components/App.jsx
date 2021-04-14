import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';

import { Navbar, Button } from 'react-bootstrap';

import LogInForm from './LogInForm.jsx';
import Chat from './Chat.jsx';
import NoMatch from './NoMatch.jsx';
import authContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';

const AuthProvider = ({ children }) => {
  const isLoggedIn = localStorage.hexletChatUserId !== undefined;
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('hexletChatUserId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ loggedIn, logIn, logOut }}>
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

const LogOutButton = () => {
  const auth = useAuth();

  return auth.loggedIn && <Button className="ml-auto" variant="outline-secondary" onClick={auth.logOut}>Выйти</Button>;
};

export default () => (
  <div className="d-flex flex-column h-100">
    <AuthProvider>
      <Router>
        <Navbar className="mb-3" expand="lg">
          <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
          <LogOutButton />
        </Navbar>
        <Switch>
          <PrivateRoute exact path="/">
            <Chat />
          </PrivateRoute>
          <Route exact path="/login">
            <LogInForm />
          </Route>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  </div>
);
