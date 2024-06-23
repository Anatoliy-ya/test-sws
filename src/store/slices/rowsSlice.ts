import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createRowThunk } from './thunks';
import { DataRowProps } from 'src/types/types';

const rowsSlice = createSlice({
  name: 'rows',
  initialState: {
    rows: [] as DataRowProps[],
    loading: false,
    error: null as string | null,
  },
  reducers: {
    setRows(state, action: PayloadAction<DataRowProps[]>) {
      state.rows = action.payload;
    },
    addRow(state, action: PayloadAction<{ parentId: number | null; row: DataRowProps }>) {
      const addRowToParent = (
        rows: DataRowProps[],
        parentId: number | null,
        newRow: DataRowProps,
      ): DataRowProps[] => {
        return rows.map((row) => {
          if (row.id === parentId) {
            return { ...row, child: [...(row.child || []), newRow] };
          }
          if (row.child) {
            return { ...row, child: addRowToParent(row.child, parentId, newRow) };
          }
          return row;
        });
      };

      if (action.payload.parentId === null) {
        state.rows.push(action.payload.row);
      } else {
        state.rows = addRowToParent(state.rows, action.payload.parentId, action.payload.row);
      }
    },
    deleteRow(state, action: PayloadAction<number>) {
      const deleteRowFromParent = (rows: DataRowProps[], rowId: number): DataRowProps[] => {
        return rows.filter((row) => {
          if (row.id === rowId) {
            return false;
          }
          if (row.child) {
            row.child = deleteRowFromParent(row.child, rowId);
          }
          return true;
        });
      };
      state.rows = deleteRowFromParent(state.rows, action.payload);
    },
    updateRow(state, action: PayloadAction<{ rID: number; updatedRow: Partial<DataRowProps> }>) {
      const updateRowInParent = (
        rows: DataRowProps[],
        rowId: number,
        updatedRow: Partial<DataRowProps>,
      ): DataRowProps[] => {
        return rows.map((row) => {
          if (row.id === rowId) {
            return { ...row, ...updatedRow };
          }
          if (row.child) {
            return { ...row, child: updateRowInParent(row.child, rowId, updatedRow) };
          }
          return row;
        });
      };
      state.rows = updateRowInParent(state.rows, action.payload.rID, action.payload.updatedRow);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createRowThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createRowThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.rows.push(action.payload);
    });
    builder.addCase(createRowThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to create row';
    });
  },
});

export const { setRows, addRow, deleteRow, updateRow } = rowsSlice.actions;
export default rowsSlice.reducer;
