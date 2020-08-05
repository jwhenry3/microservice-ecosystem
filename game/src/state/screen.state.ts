import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';

export interface ScreenState {
  screen:string
}

export const screen = createSlice<ScreenState, SliceCaseReducers<ScreenState>>({
  name        : 'screen',
  initialState: {
    screen: '',
  },
  reducers    : {
    'screen.set': (state, action) => ({ screen: action.payload }),
  },
});

export const setScreen = screen.actions['screen.set'];
