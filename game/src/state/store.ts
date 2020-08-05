import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { screen }                               from './screen.state';


export const store = configureStore({
  reducer   : {
    screen: screen.reducer,
  },
  devTools  : process.env.NODE_ENV !== 'production',
  enhancers : [],
  middleware: getDefaultMiddleware().concat([]),
});
