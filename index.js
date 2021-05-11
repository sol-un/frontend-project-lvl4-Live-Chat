/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import i18next from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import ru from './src/locales/ru.js';
import en from './src/locales/en.js';
import App from './src/App.jsx';
import messagesReducer, { addMessage } from './src/slices/messages.js';
import channelsReducer, { addChannel, renameChannel, removeChannel } from './src/slices/channels.js';
import currentChannelIdReducer from './src/slices/currentChannelId.js';
import uiStateReducer from './src/slices/uiState.js';
import { socketContext } from './src/contexts/index.jsx';

const init = (socket) => {
  console.log(process.env.ROLLBAR_ACCESS_TOKEN);
  const i18nextInstance = i18next.createInstance();
  i18nextInstance
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

  const SocketProvider = ({ children }) => {
    const emitSocketEvent = (event, data) => {
      if (socket.connected) {
        socket.emit(event, data, () => {});
      } else {
        throw new Error('Network error!');
      }
    };

    return (
      <socketContext.Provider value={emitSocketEvent}>
        {children}
      </socketContext.Provider>
    );
  };

  socket.on('newMessage', (response) => dispatch(addMessage(response)));
  socket.on('newChannel', (response) => dispatch(addChannel(response)));
  socket.on('renameChannel', (response) => dispatch(renameChannel(response)));
  socket.on('removeChannel', (response) => dispatch(removeChannel(response)));

  return (
    <Provider store={store}>
      <SocketProvider>
        <I18nextProvider i18n={i18nextInstance}>
          <App />
        </I18nextProvider>
      </SocketProvider>
    </Provider>
  );
};

export default init;
