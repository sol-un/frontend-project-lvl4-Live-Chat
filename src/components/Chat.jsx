import axios from 'axios';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Row, Col,
} from 'react-bootstrap';
import ChannelNav from './ChannelNav.jsx';
import Messages from './Messages.jsx';
import MessageForm from './MessageForm.jsx';
import { addChannels } from '../slices/channels.js';
import { addMessages } from '../slices/messages.js';
import { hideModal } from '../slices/uiState.js';
import getModal from './modals/index.js';
import routes from '../routes.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('hexletChatUserId'));

  if (userId) {
    return { Authorization: `Bearer ${userId}` };
  }

  return {};
};

const renderModal = ({ uiState, onHide }) => {
  if (!uiState.type) {
    return null;
  }

  const Component = getModal(uiState.type);
  return <Component modalInfo={uiState} onHide={onHide} />;
};

export default () => {
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
    }
    try {
      getData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, []);
  return (
    <>
      {renderModal({ uiState, onHide })}
      <Row className="h-100 pb-3">
        <Col className="border-right" xs={3}>
          <ChannelNav />
        </Col>
        <Col className="d-flex flex-column justify-content-end h-100">
          <Messages />
          <MessageForm />
        </Col>
      </Row>
    </>
  );
};
