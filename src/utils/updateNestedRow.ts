import { DataRowProps } from 'src/types/types';

export const updateNestedRow = (
  rows: DataRowProps[],
  rID: number,
  updatedRow: Partial<DataRowProps>,
): DataRowProps[] => {
  return rows.map((row) => {
    if (row.id === rID) {
      return { ...row, ...updatedRow };
    }
    if (row.child) {
      return { ...row, child: updateNestedRow(row.child, rID, updatedRow) };
    }
    return row;
  });
};
