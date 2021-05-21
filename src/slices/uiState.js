import { createSlice } from '@reduxjs/toolkit';

const uiStateSlice = createSlice({
  name: 'uiState',
  initialState: {
    type: null,
    isVisible: false,
    channelId: null,
  },
  reducers: {
    showModal(state, action) {
      return {
        ...state,
        ...action.payload,
        isVisible: true,
      };
    },
    hideModal() {
      return {
        type: null,
        isVisible: false,
        channelId: null,
      };
    },
  },
});

const { actions, reducer } = uiStateSlice;
export const { showModal, hideModal } = actions;
export default reducer;
