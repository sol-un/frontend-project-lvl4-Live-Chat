import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import { Navbar } from 'react-bootstrap';

import LogInForm from './components/LogInForm.jsx';
import Chat from './components/Chat.jsx';
import NoMatch from './components/NoMatch.jsx';

export default () => {
  let token;
  return (
    <div className="d-flex flex-column h-100">
      <Navbar className="mb-3" expand="lg">
        <Navbar.Brand href="/">Hexlet Chat</Navbar.Brand>
      </Navbar>
      <Router>
        <Switch>
          <Route exact path="/">
            <Chat />
          </Route>
          <Route exact path="/login">
            <LogInForm />
          </Route>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};
