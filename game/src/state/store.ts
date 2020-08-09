import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { ui }                                   from './ui.state';


export const store = configureStore({
  reducer   : {
    ui: ui.reducer,
  },
  devTools  : process.env.NODE_ENV !== 'production',
  enhancers : [],
  middleware: getDefaultMiddleware().concat([]),
});
