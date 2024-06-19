import { configureStore } from '@reduxjs/toolkit';
import { api } from 'src/api/api';
import rowsReducer from './slices/rowsSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    rows: rowsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
