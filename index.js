/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import ru from './src/locales/ru.js';
import en from './src/locales/en.js';
import App from './src/App.jsx';
import messagesReducer, { addMessage } from './src/slices/messages.js';
import channelsReducer, { addChannel, renameChannel, removeChannel } from './src/slices/channels.js';
import currentChannelIdReducer from './src/slices/currentChannelId.js';
import uiStateReducer from './src/slices/uiState.js';
import { socketContext } from './src/contexts/index.jsx';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru,
      en,
    },
    lng: 'ru',
    fallbackLng: 'ru',
  });

const store = configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    currentChannelId: currentChannelIdReducer,
    uiState: uiStateReducer,
  },
});

const { dispatch } = store;

const init = (socket) => {
  socket.on('newMessage', (response) => dispatch(addMessage(response)));
  socket.on('newChannel', (response) => dispatch(addChannel(response)));
  socket.on('renameChannel', (response) => dispatch(renameChannel(response)));
  socket.on('removeChannel', (response) => dispatch(removeChannel(response)));

  return (
    <Provider store={store}>
      <socketContext.Provider value={socket}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </socketContext.Provider>
    </Provider>
  );
};

export default init;
