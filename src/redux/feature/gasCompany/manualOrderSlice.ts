import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  delivery: null,
  isLoading: false,
  error: null,
};

const manualOrderSlice = createSlice({
  name: "manualOrder",
  initialState,

  reducers: {
    setDelivery: (state, action) => {
      state.delivery = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    setLoading: (state) => {
      state.isLoading = true;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearDelivery: (state) => {
      state.delivery = null;
    },
  },
});

export const {
  setDelivery,
  setLoading,
  setError,
  clearDelivery,
} = manualOrderSlice.actions;

export default manualOrderSlice.reducer;