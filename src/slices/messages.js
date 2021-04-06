import { createSlice } from '@reduxjs/toolkit';

import { removeChannel } from './channels.js';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {
    addMessage(state, action) {
      const { payload } = action;
      state.push(payload);
    },
  },
  extraReducers: {
    [removeChannel]: (state, action) => {
      const { payload } = action;
      const channelId = Number(payload.id);
      return state.filter((item) => item.channelId !== channelId);
    },
  },
});

const { reducer, actions } = messagesSlice;
export const { addMessage } = actions;
export default reducer;
