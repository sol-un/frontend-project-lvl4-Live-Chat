import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

export const createChannel = createAsyncThunk(
  'channels/create',
  // eslint-disable-next-line no-unused-vars
  async ({ name }, thunkAPI) => axios({
    method: 'post',
    url: routes.channelsPath(),
    data: {
      data: { attributes: { name } },
    },
  }),
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: [],
  reducers: {
    addChannel(state, action) {
      const { payload } = action;
      state.push(payload.attributes);
    },
  },
  extraReducers: {
    [createChannel.fulfilled]: () => console.log('Channel created!'),
    [createChannel.rejected]: (_state, action) => console.log(action.error),
  },
});

const { actions, reducer } = channelsSlice;
export const { addChannel } = actions;
export default reducer;
