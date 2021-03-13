import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

export const createMessage = createAsyncThunk(
  'messages/create',
  // eslint-disable-next-line no-unused-vars
  async ({ text, userName, currentChannelId }, thunkAPI) => axios({
    method: 'post',
    url: routes.channelMessagesPath(currentChannelId),
    data: {
      data: { attributes: { text, userName } },
    },
  }),
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {
    addMessage(state, action) {
      const { payload } = action;
      state.push(payload.attributes);
    },
  },
  extraReducers: {
    [createMessage.fulfilled]: () => console.log('Message created!'),
    [createMessage.rejected]: (_state, action) => console.log(action.error),
  },
});

const { reducer, actions } = messagesSlice;
export const { addMessage } = actions;
export default reducer;
