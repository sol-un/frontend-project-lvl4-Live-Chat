import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Row, Col,
} from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import ChannelNav from './ChannelNav.jsx';
import Messages from './Messages.jsx';
import MessageForm from './MessageForm.jsx';
import { setInitialData } from '../slices/channels.js';
import { hideModal } from '../slices/uiState.js';
import Modal from './Modal.jsx';
import routes from '../routes.js';
import { useAuth } from '../hooks/index.jsx';

const Chat = () => {
  const [isLoaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const uiState = useSelector((state) => state.uiState);
  const onHide = () => dispatch(hideModal());
  const auth = useAuth();
  useEffect(() => {
    const authHeader = auth.getAuthHeader();
    const getData = async () => {
      const res = await axios({
        method: 'get',
        url: routes.dataPath(),
        headers: authHeader,
      });
      dispatch(setInitialData(res.data));
      setLoaded(true);
    };
    try {
      getData();
    } catch (err) {
      if (!err.isAxiosError || !err.response.status === 401) {
        throw err;
      }
      history.push('/login');
    }
  }, [dispatch]);
  return isLoaded
    ? (
      <>
        <Modal uiState={uiState} onHide={onHide} />
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
