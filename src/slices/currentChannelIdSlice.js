import { createSlice } from '@reduxjs/toolkit';

const currentChannelIdSlice = createSlice({
  name: 'currentChannelId',
  initialState: null,
  reducers: {
    changeCurrentChannelId(state, action) {
      return action.payload;
    },
  },
});

const { actions, reducer } = currentChannelIdSlice;
export const { changeCurrentChannelId } = actions;
export default reducer;
