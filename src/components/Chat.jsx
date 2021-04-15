import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {
  Row, Col,
} from 'react-bootstrap';
import routes from '../routes.js';
import ChannelNav from './ChannelNav.jsx';
import Messages from './Messages.jsx';
import MessageForm from './MessageForm.jsx';
import messagesReducer from '../slices/messages.js';
import channelsReducer from '../slices/channels.js';
import currentChannelIdReducer from '../slices/currentChannelId.js';

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

  return (
    <Provider store={store}>
      <Row className="h-100 pb-3">
        <Col className="border-right" xs={3}>
          <ChannelNav />
        </Col>
        <Col className="d-flex flex-column justify-content-end h-100">
          <Messages />
          <MessageForm />
        </Col>
      </Row>
    </Provider>
  );
};
