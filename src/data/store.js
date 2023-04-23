import { configureStore, createSlice } from "@reduxjs/toolkit";
import { ORDER_BY_PRIORITY } from "./metadata";
import { calculateCurrentBudget } from "../function/function";

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
});

const currentBudget = createSlice({
  name: 'currentBudget',
  initialState: 0,
  reducers: {
    setCurrentBudget(state, action) {
      return action.payload;
    }
  }
});

export default configureStore({
  reducer: {
    selectedCircle: selectedCircle.reducer,
    currentOrderMode: currentOrderMode.reducer,
    currentBudget: currentBudget.reducer,
  }
});

export const { setSelectedCircle } = selectedCircle.actions;
export const { setCurrentOrderMode } = currentOrderMode.actions;
export const { setCurrentBudget } = currentBudget.actions;