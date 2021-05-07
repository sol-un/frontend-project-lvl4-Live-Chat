import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Row, Col,
} from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import ChannelNav from './ChannelNav.jsx';
import Messages from './Messages.jsx';
import MessageForm from './MessageForm.jsx';
import { addChannels } from '../slices/channels.js';
import { addMessages } from '../slices/messages.js';
import { hideModal } from '../slices/uiState.js';
import Modal from './modals/Modal.jsx';
import routes from '../routes.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('hexletChatUserId'));

  if (userId) {
    return { Authorization: `Bearer ${userId}` };
  }

  return {};
};

const Chat = () => {
  const [isLoaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const uiState = useSelector((state) => state.uiState);
  const onHide = () => dispatch(hideModal());
  useEffect(() => {
    const authHeader = getAuthHeader();
    async function getData() {
      const res = await axios({
        method: 'get',
        url: routes.dataPath(),
        headers: authHeader,
      });
      const { channels, messages } = res.data;
      dispatch(addChannels(channels));
      dispatch(addMessages(messages));
      setLoaded(true);
    }
    try {
      getData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [dispatch]);
  return isLoaded
    ? (
      <>
        <Modal uiState={uiState} onHide={onHide} />
        <Row className="flex-grow-1 h-100 pb-3">
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
