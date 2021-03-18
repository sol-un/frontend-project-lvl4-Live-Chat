import 'regenerator-runtime/runtime';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import faker from 'faker';
import Cookies from 'js-cookie';
import Chat from './Chat.jsx';
import AppContext from '../app-context.js';
import { channelsReducer, messagesReducer, currentChannelIdReducer } from '../slices/index.js';

const setUserNameIfEmpty = () => {
  // eslint-disable-next-line
  let userName = Cookies.get('hexletChatUserName');
  if (!userName) {
    userName = faker.internet.userName();
    Cookies.set('hexletChatUserName', userName);
  }
  return userName;
};

// eslint-disable-next-line react/prop-types
const App = ({ gon }) => {
  const store = configureStore({
    reducer: {
      channels: channelsReducer,
      messages: messagesReducer,
      currentChannelId: currentChannelIdReducer,
    },
    preloadedState: gon,
  });

  return (
    <Provider store={store}>
      <AppContext.Provider value={setUserNameIfEmpty()}>
        <Chat />
      </AppContext.Provider>
    </Provider>
  );
};

export default App;
