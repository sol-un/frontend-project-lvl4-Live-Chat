import { createSlice } from '@reduxjs/toolkit';

const channelsSlice = createSlice({
  name: 'channels',
  initialState: [],
  reducers: {
    setInitialData(state, action) {
      return action.payload.channels;
    },
    addChannel(state, action) {
      const { payload } = action;
      state.push(payload);
    },
    renameChannel(state, action) {
      const { payload } = action;
      const channelId = Number(payload.id);
      const channel = state.find(({ id }) => id === channelId);
      channel.name = payload.name;
    },
    removeChannel(state, action) {
      const { payload } = action;
      const channelId = Number(payload.id);
      return state.filter(({ id }) => id !== channelId);
    },
  },
});

const { actions, reducer } = channelsSlice;
export const {
  setInitialData, addChannel, renameChannel, removeChannel,
} = actions;
export default reducer;
