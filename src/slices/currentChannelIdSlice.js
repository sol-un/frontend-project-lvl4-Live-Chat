import { createSlice } from '@reduxjs/toolkit';
import { removeChannel } from './channelsSlice.js';

const currentChannelIdSlice = createSlice({
  name: 'currentChannelId',
  initialState: null,
  reducers: {
    changeCurrentChannelId(state, action) {
      return action.payload;
    },
  },
  extraReducers: {
    [removeChannel]: (state, { payload }) => (state === payload.id ? 1 : state),
  },
});

const { actions, reducer } = currentChannelIdSlice;
export const { changeCurrentChannelId } = actions;
export default reducer;
