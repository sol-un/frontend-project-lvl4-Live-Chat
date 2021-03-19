import { createSlice } from '@reduxjs/toolkit';
import { removeChannel } from './channels.js';

const generalChannelId = 1;

const currentChannelIdSlice = createSlice({
  name: 'currentChannelId',
  initialState: generalChannelId,
  reducers: {
    changeCurrentChannelId(state, action) {
      return action.payload;
    },
  },
  extraReducers: {
    [removeChannel]: (state, { payload }) => (payload.id === state ? generalChannelId : state),
  },
});

const { actions, reducer } = currentChannelIdSlice;
export const { changeCurrentChannelId } = actions;
export default reducer;
