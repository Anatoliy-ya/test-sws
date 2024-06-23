import { createAsyncThunk } from '@reduxjs/toolkit';
import { addRow } from './rowsSlice';
import { DataRowProps } from 'src/types/types';
import { RootState, AppDispatch } from '../store';
import { api } from 'src/api/api';

export const createRowThunk = createAsyncThunk<
  DataRowProps,
  { eID: number; parentId: number | null; newRow: DataRowProps },
  { state: RootState; dispatch: AppDispatch }
>('rows/createRow', async ({ eID, parentId, newRow }, { dispatch }) => {
  const result = await dispatch(api.endpoints.createRow.initiate({ eID, row: newRow })).unwrap();
  dispatch(addRow({ parentId, row: result }));
  return result;
});
