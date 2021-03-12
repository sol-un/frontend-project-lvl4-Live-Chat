import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

export const createMessage = createAsyncThunk(
  'messages/create',
  // eslint-disable-next-line no-unused-vars
  async ({ text, currentChannelId }, thunkAPI) => {
    const data = {
      attributes: { text },
    };
    const response = await axios({
      method: 'post',
      url: routes.channelMessagesPath(currentChannelId),
      data: { data },
    });
    return response.data;
  },
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {},
  extraReducers: {
    [createMessage.fulfilled]: (state, { payload }) => {
      const { data } = payload;
      state.push(data.attributes);
    },
  },
});

const { reducer } = messagesSlice;
export default reducer;
