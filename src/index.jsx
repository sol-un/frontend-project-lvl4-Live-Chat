/* eslint-disable import/no-unresolved */
import React from 'react';
import ReactDOM from 'react-dom';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../assets/application.scss';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import gon from 'gon';
import Cookies from 'js-cookie';
import faker from 'faker';
import App from './components/App.jsx';
import AppContext from './app-context.js';
import { channelsReducer, messagesReducer, currentChannelIdReducer } from './slices/index.js';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const provideUserName = () => {
  let userName = Cookies.get('hexletChatUserName');
  if (!userName) {
    userName = faker.fake('{{commerce.productAdjective}}-{{random.word}}-{{random.number}}').toLowerCase();
    Cookies.set('hexletChatUserName', userName);
  }
  return userName;
};

const store = configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    currentChannelId: currentChannelIdReducer,
  },
  preloadedState: gon,
});

const container = document.querySelector('#chat');
ReactDOM.render(
  <Provider store={store}>
    <AppContext.Provider value={provideUserName()}>
      <App />
    </AppContext.Provider>
  </Provider>,
  container,
);
