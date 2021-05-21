import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import i18next from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { noop } from 'lodash';
import ru from './locales/ru.js';
import en from './locales/en.js';
import App from './App.jsx';
import messagesInfoReducer, { addMessage } from './slices/messagesInfo.js';
import channelsInfoReducer, {
  addChannel as addChannelAction,
  renameChannel as renameChannelAction,
  removeChannel as removeChannelAction,
} from './slices/channelsInfo.js';
import modalReducer from './slices/modal.js';
import { socketContext } from './contexts/index.jsx';

const init = async (socket) => {
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance
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
      channelsInfo: channelsInfoReducer,
      messagesInfo: messagesInfoReducer,
      modal: modalReducer,
    },
  });

  const { dispatch } = store;

  const SocketProvider = ({ children }) => {
    const wrapper = (event, data) => {
      if (socket.connected) {
        socket.emit(event, data, noop);
      } else {
        throw new Error('Network error!');
      }
    };

    const sendMessage = (data) => wrapper('newMessage', data);
    const addChannel = (data) => wrapper('newChannel', data);
    const removeChannel = (data) => wrapper('removeChannel', data);
    const renameChannel = (data) => wrapper('renameChannel', data);

    return (
      <socketContext.Provider value={{
        sendMessage,
        addChannel,
        removeChannel,
        renameChannel,
      }}
      >
        {children}
      </socketContext.Provider>
    );
  };

  socket.on('newMessage', (response) => dispatch(addMessage(response)));
  socket.on('newChannel', (response) => dispatch(addChannelAction(response)));
  socket.on('renameChannel', (response) => dispatch(renameChannelAction(response)));
  socket.on('removeChannel', (response) => dispatch(removeChannelAction(response)));

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
