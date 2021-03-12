import { createSlice } from '@reduxjs/toolkit';

const channelsSlice = createSlice({
  name: 'channels',
  initialState: [],
  reducers: {
    createChannel(state, action) {},
    updateChannel(state, action) {},
    deleteChannel(state, action) {},
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = channelsSlice;
// Extract and export each action creator by name
export const { createPost, updatePost, deletePost } = actions;
// Export the reducer, either as a default or named export
export default reducer;
