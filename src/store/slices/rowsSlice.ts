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
    addRow(state, action: PayloadAction<{ parentId: number | null; row: DataRowProps }>) {
      if (action.payload.parentId === null) {
        console.log('Added row:', action.payload.row);
        state.rows.push(action.payload.row);
      } else {
        const addRowToParent = (rows: DataRowProps[]): boolean => {
          for (let row of rows) {
            if (row.id === action.payload.parentId) {
              console.log(!row.child);
              if (!row.child) row.child = [];
              row.child.push(action.payload.row);
              return true;
            }
            if (row.child && addRowToParent(row.child)) {
              return true;
            }
          }
          return false;
        };
        addRowToParent(state.rows);
      }
    },
    deleteRow(state, action: PayloadAction<number>) {
      const deleteRowFromParent = (rows: DataRowProps[]): boolean => {
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].id === action.payload) {
            rows.splice(i, 1);
            return true;
          }
          // @ts-ignore
          if (rows[i].child && deleteRowFromParent(rows[i].child)) {
            return true;
          }
        }
        return false;
      };
      deleteRowFromParent(state.rows);
    },
    updateRow(state, action: PayloadAction<{ rID: number; updatedRow: Partial<DataRowProps> }>) {
      const updateRowInParent = (rows: DataRowProps[]): DataRowProps[] => {
        return rows.map((row) => {
          if (row.id === action.payload.rID) {
            return { ...row, ...action.payload.updatedRow };
          }
          if (row.child) {
            return { ...row, child: updateRowInParent(row.child) };
          }
          return row;
        });
      };
      state.rows = updateRowInParent(state.rows);
    },
  },
});

export const { setRows, addRow, deleteRow, updateRow } = rowsSlice.actions;

export default rowsSlice.reducer;
