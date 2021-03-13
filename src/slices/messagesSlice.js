import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { unionBy } from 'lodash';
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

export const fetchMessages = createAsyncThunk(
  'messages/fetchByChannelId',
  // eslint-disable-next-line no-unused-vars
  async (channelId, thunkAPI) => {
    const response = await axios({
      method: 'get',
      url: routes.channelMessagesPath(channelId),
    });
    return response.data;
  },
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {},
  extraReducers: {
    [createMessage.fulfilled]: () => console.log('Message created!'),
    [fetchMessages.fulfilled]: (state, action) => {
      const { payload } = action;
      const normalizedData = payload.data.map(({ attributes }) => attributes);
      return unionBy(normalizedData, state, 'id');
    },
  },
});

const { reducer } = messagesSlice;
export default reducer;
