import { createSlice } from '@reduxjs/toolkit';

import { removeChannel } from './channels.js';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {
    addMessages(state, action) {
      return action.payload;
    },
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
export const { addMessages, addMessage } = actions;
export default reducer;
