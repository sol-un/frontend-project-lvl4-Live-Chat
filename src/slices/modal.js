import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
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

const { actions, reducer } = modalSlice;
export const { showModal, hideModal } = actions;
export default reducer;
