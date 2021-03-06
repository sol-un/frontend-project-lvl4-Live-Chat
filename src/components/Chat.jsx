import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Row, Col,
} from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import ChannelNav from './ChannelNav.jsx';
import Messages from './Messages.jsx';
import MessageForm from './MessageForm.jsx';
import { setInitialData } from '../slices/channelsInfo.js';
import Modal from './Modal.jsx';
import routes from '../routes.js';
import pageRoutes from './routes.js';
import { useAuth } from '../hooks/index.jsx';

const Chat = () => {
  const [isLoaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const auth = useAuth();
  useEffect(() => {
    const authHeader = auth.getAuthHeader();
    const fetchData = async () => {
      try {
        const res = await axios({
          method: 'get',
          url: routes.dataPath(),
          headers: authHeader,
        });
        dispatch(setInitialData(res.data));
        setLoaded(true);
      } catch (err) {
        if (!err.isAxiosError || !err.response.status === 401) {
          throw err;
        }
        auth.logOut();
        history.push(pageRoutes.logInPath());
      }
    };
    fetchData();
  }, [auth, dispatch, history]);

  return isLoaded
    ? (
      <>
        <Modal />
        <Row className="flex-grow-1 h-75 pb-3">
          <Col className="border-right" xs={3}>
            <ChannelNav />
          </Col>
          <Col className="h-100">
            <div className="d-flex flex-column h-100">
              <Messages />
              <MessageForm />
            </div>
          </Col>
        </Row>
      </>
    )
    : (
      <Spinner className="mx-auto my-auto" animation="grow" variant="primary" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
};

export default Chat;
