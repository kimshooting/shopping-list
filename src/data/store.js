import { configureStore, createSlice } from "@reduxjs/toolkit";
import { ORDER_BY_PRIORITY } from "./metadata";

const selectedCircle = createSlice({
  name: 'selectedCircle',
  initialState: { },
  reducers: {
    setSelectedCircle(state, action) {
      return action.payload;
    }
  },
});

const currentOrderMode = createSlice({
  name: 'currentOrderMode',
  initialState: 0,
  reducers: {
    setCurrentOrderMode(state, action) {
      return action.payload;
    }
  }
})

export default configureStore({
  reducer: {
    selectedCircle: selectedCircle.reducer,
    currentOrderMode: currentOrderMode.reducer,
  }
});

export const { setSelectedCircle } = selectedCircle.actions;
export const { setCurrentOrderMode } = currentOrderMode.actions;