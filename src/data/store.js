import { configureStore, createSlice } from "@reduxjs/toolkit";

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

const budgetCriterion = createSlice({
  name: 'budgetCriterion',
  initialState: '',
  reducers: {
    setBudgetCriterion(state, action) {
      return action.payload;
    }
  }
});

const isPriceVisible = createSlice({
  name: 'isPriceVisible',
  initialState: true,
  reducers: {
    setIsPriceVisible(state, action) {
      return action.payload;
    }
  }
});

const isWorkTitleVisible = createSlice({
  name: 'isWorkTitleVisible',
  initialState: true,
  reducers: {
    setIsWorkTitleVisible(state, action) {
      return action.payload;
    }
  }
});

const pickedCircle = createSlice({
  name: 'pickedCircle',
  initialState: {
    id: -1,
    space: '',
    penname: '',
    circle_name: '',
  },
  reducers: {
    setPickedCircle(state, action) {
      return action.payload;
    }
  }
});

const currentPage = createSlice({
  name: 'currentPage',
  initialState: 0,
  reducers: 0,
  reducers: {
    setCurrentPage(state, action) {
      return action.payload;
    }
  }
});

export default configureStore({
  reducer: {
    selectedCircle: selectedCircle.reducer,
    currentOrderMode: currentOrderMode.reducer,
    currentBudget: currentBudget.reducer,
    budgetCriterion: budgetCriterion.reducer,
    isPriceVisible: isPriceVisible.reducer,
    isWorkTitleVisible: isWorkTitleVisible.reducer,
    pickedCircle: pickedCircle.reducer,
    currentPage: currentPage.reducer,
  }
});

export const { setSelectedCircle } = selectedCircle.actions;
export const { setCurrentOrderMode } = currentOrderMode.actions;
export const { setCurrentBudget } = currentBudget.actions;
export const { setBudgetCriterion } = budgetCriterion.actions;
export const { setIsPriceVisible } = isPriceVisible.actions;
export const { setIsWorkTitleVisible } = isWorkTitleVisible.actions;
export const { setPickedCircle } = pickedCircle.actions;
export const { setCurrentPage } = currentPage.actions;