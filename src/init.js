/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import i18next from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { noop } from 'lodash';
import ru from './locales/ru.js';
import en from './locales/en.js';
import App from './App.jsx';
import messagesReducer, { addMessage } from './slices/messages.js';
import channelsReducer, { addChannel, renameChannel, removeChannel } from './slices/channels.js';
import currentChannelIdReducer from './slices/currentChannelId.js';
import uiStateReducer from './slices/uiState.js';
import { socketContext } from './contexts/index.jsx';

const init = (socket) => {
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
    const sendMessageSocketWrapper = (data) => {
      if (socket.connected) {
        socket.emit('newMessage', data, noop);
      } else {
        throw new Error('Network error!');
      }
    };

    const addChannelSocketWrapper = (data) => {
      if (socket.connected) {
        socket.emit('newChannel', data, noop);
      } else {
        throw new Error('Network error!');
      }
    };

    const removeChannelSocketWrapper = (data) => {
      if (socket.connected) {
        socket.emit('removeChannel', data, noop);
      } else {
        throw new Error('Network error!');
      }
    };

    const renameChannelSocketWrapper = (data) => {
      if (socket.connected) {
        socket.emit('renameChannel', data, noop);
      } else {
        throw new Error('Network error!');
      }
    };

    return (
      <socketContext.Provider value={{
        sendMessageSocketWrapper,
        addChannelSocketWrapper,
        removeChannelSocketWrapper,
        renameChannelSocketWrapper,
      }}
      >
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
