import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

export const createChannel = createAsyncThunk(
  'channels/create',
  async ({ name }) => axios({
    method: 'post',
    url: routes.channelsPath(),
    data: {
      data: { attributes: { name } },
    },
  }),
);

export const updateChannelName = createAsyncThunk(
  'channels/updateNameById',
  async ({ name, id }) => axios({
    method: 'patch',
    url: routes.channelPath(id),
    data: {
      data: { attributes: { name } },
    },
  }),
);

export const deleteChannel = createAsyncThunk(
  'channels/deleteById',
  async ({ id }) => axios({
    method: 'delete',
    url: routes.channelPath(id),
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
    renameChannel(state, action) {
      const { payload: { attributes } } = action;
      const channelId = Number(attributes.id);
      const channel = state.find(({ id }) => id === channelId);
      channel.name = attributes.name;
    },
    removeChannel(state, action) {
      const { payload } = action;
      const channelId = Number(payload.id);
      return state.filter(({ id }) => id !== channelId);
    },
  },
  extraReducers: {
    [createChannel.fulfilled]: () => console.log('Channel created!'),
    [createChannel.rejected]: (_state, action) => console.log(action.error),
    [updateChannelName.fulfilled]: () => console.log('Channel name updated!'),
    [updateChannelName.rejected]: (_state, action) => console.log(action.error),
    [deleteChannel.fulfilled]: () => console.log('Channel deleted!'),
    [deleteChannel.rejected]: (_state, action) => console.log(action.error),
  },
});

const { actions, reducer } = channelsSlice;
export const { addChannel, renameChannel, removeChannel } = actions;
export default reducer;
