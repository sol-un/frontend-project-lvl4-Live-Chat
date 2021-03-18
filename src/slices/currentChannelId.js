import { createSlice } from '@reduxjs/toolkit';
import { removeChannel } from './channels.js';

const currentChannelIdSlice = createSlice({
  name: 'currentChannelId',
  initialState: null,
  reducers: {
    changeCurrentChannelId(state, action) {
      return action.payload;
    },
  },
  extraReducers: {
    [removeChannel]: (state, { payload }) => {
      const generalId = 1;
      return payload.id === state ? generalId : state;
    },
  },
});

const { actions, reducer } = currentChannelIdSlice;
export const { changeCurrentChannelId } = actions;
export default reducer;
