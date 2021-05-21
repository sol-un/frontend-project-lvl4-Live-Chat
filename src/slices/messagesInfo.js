import { createSlice } from '@reduxjs/toolkit';
import { setInitialData, removeChannel } from './channelsInfo.js';

const messagesInfoSlice = createSlice({
  name: 'messagesInfo',
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage(state, action) {
      const { payload } = action;
      state.messages.push(payload);
    },
  },
  extraReducers: {
    [setInitialData]: (state, action) => ({ messages: action.payload.messages }),
    [removeChannel]: (state, action) => {
      const { payload } = action;
      const channelId = Number(payload.id);
      const filteredMessages = state.messages.filter((item) => item.channelId !== channelId);
      return { messages: filteredMessages };
    },
  },
});

const { reducer, actions } = messagesInfoSlice;
export const { addMessage } = actions;
export default reducer;
