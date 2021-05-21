import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import { Navbar, NavDropdown, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import LogInForm from './LogInForm.jsx';
import SignUpForm from './SignUpForm.jsx';
import Chat from './Chat.jsx';
import NoMatch from './NoMatch.jsx';
import { useAuth } from '../hooks/index.jsx';
import routes from './routes.js';

const {
  rootPath,
  signUpPath,
  logInPath,
  noMatchPath,
} = routes;

const PrivateRoute = ({ children, path }) => {
  const auth = useAuth();

  return (
    <Route
      path={path}
      render={({ location }) => (auth.loggedIn
        ? children
        : <Redirect to={{ pathname: logInPath(), state: { from: location } }} />)}
    />
  );
};

const AuthRoute = ({ children, path }) => {
  const auth = useAuth();

  return (
    <Route
      path={path}
      render={({ location }) => (auth.loggedIn
        ? <Redirect to={{ pathname: rootPath(), state: { from: location } }} />
        : children)}
    />
  );
};

const LogOutButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  return auth.loggedIn && <Button className="ml-2" variant="outline-secondary" onClick={auth.logOut}>{t('logout')}</Button>;
};

const Main = () => {
  const { i18n } = useTranslation();
  const handleSelect = (eventKey) => i18n.changeLanguage(eventKey);

  return (
    <div className="d-flex flex-column h-100">
      <Router>
        <Navbar className="mb-3" expand="lg">
          <Navbar.Brand as={Link} to={rootPath()}>Hexlet Chat</Navbar.Brand>
          <NavDropdown className="ml-auto" id="nav-dropdown" title="&#127758;" onSelect={handleSelect}>
            <NavDropdown.Item eventKey="ru">RU</NavDropdown.Item>
            <NavDropdown.Item eventKey="en">EN</NavDropdown.Item>
          </NavDropdown>
          <LogOutButton />
        </Navbar>
        <Switch>
          <PrivateRoute exact path={rootPath()}>
            <Chat />
          </PrivateRoute>
          <AuthRoute exact path={logInPath()}>
            <LogInForm />
          </AuthRoute>
          <AuthRoute exact path={signUpPath()}>
            <SignUpForm />
          </AuthRoute>
          <Route path={noMatchPath()}>
            <NoMatch />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default Main;
