import { createSlice } from '@reduxjs/toolkit';

const defaultChannelId = 1;

const channelsInfoSlice = createSlice({
  name: 'channelsInfo',
  initialState: {
    currentChannelId: null,
    channels: [],
  },
  reducers: {
    setInitialData(state, action) {
      const { channels, currentChannelId } = action.payload;
      return { channels, currentChannelId };
    },
    setCurrentChannelId(state, action) {
      return { ...state, currentChannelId: action.payload };
    },
    addChannel(state, action) {
      const { payload } = action;
      state.channels.push(payload);
    },
    renameChannel(state, action) {
      const { payload } = action;
      const channelId = Number(payload.id);
      const channel = state.channels.find(({ id }) => id === channelId);
      channel.name = payload.name;
    },
    removeChannel(state, action) {
      const { payload } = action;
      const channelId = Number(payload.id);
      const filteredChannels = state.channels.filter(({ id }) => id !== channelId);
      return { channels: filteredChannels, currentChannelId: defaultChannelId };
    },
  },
});

const { actions, reducer } = channelsInfoSlice;
export const {
  setInitialData, addChannel, renameChannel, removeChannel, setCurrentChannelId,
} = actions;
export default reducer;
