import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataRowProps } from '../../types/types';

interface RowsState {
  rows: DataRowProps[];
}

const initialState: RowsState = {
  rows: [],
};

const rowsSlice = createSlice({
  name: 'rows',
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<DataRowProps[]>) {
      state.rows = action.payload;
    },
    addRow(state, action: PayloadAction<DataRowProps>) {
      state.rows.push(action.payload);
    },
    updateRow(state, action: PayloadAction<DataRowProps>) {
      const index = state.rows.findIndex((row) => row.id === action.payload.id);
      if (index !== -1) {
        state.rows[index] = action.payload;
      }
    },
    deleteRow(state, action: PayloadAction<number>) {
      state.rows = state.rows.filter((row) => row.id !== action.payload);
    },
  },
});

export const { setRows, addRow, updateRow, deleteRow } = rowsSlice.actions;
export default rowsSlice.reducer;
