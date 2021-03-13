import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

export const createMessage = createAsyncThunk(
  'messages/create',
  // eslint-disable-next-line no-unused-vars
  async ({ text, currentChannelId, userName }, thunkAPI) => {
    const response = await axios({
      method: 'post',
      url: routes.channelMessagesPath(currentChannelId),
      data: {
        data: { attributes: { text, userName } },
      },
    });
    return response.data;
  },
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
  },
});

const { reducer, actions } = messagesSlice;
export const { addMessage } = actions;
export default reducer;
