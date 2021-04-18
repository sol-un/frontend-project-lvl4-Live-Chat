import { createSlice } from '@reduxjs/toolkit';

const uiStateSlice = createSlice({
  name: 'uiState',
  initialState: {
    type: null,
    channelId: null,
    channelName: null,
  },
  reducers: {
    showModal(state, action) {
      return { ...state, ...action.payload };
    },
    hideModal() {
      return {
        type: null,
        channelId: null,
        channelName: null,
      };
    },
  },
});

const { actions, reducer } = uiStateSlice;
export const { showModal, hideModal } = actions;
export default reducer;
