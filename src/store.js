/* eslint-disable import/no-unresolved */
import { configureStore } from '@reduxjs/toolkit';
import gon from 'gon';
import { channelsReducer, messagesReducer, currentChannelIdReducer } from './slices/index.js';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    currentChannelId: currentChannelIdReducer,
  },
  preloadedState: gon,
});
