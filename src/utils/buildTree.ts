import { DataRowProps } from 'src/types/types';

const assignLevelsAndAddRow = (
  rows: DataRowProps[],
  level: number,
  parentId: number | null,
  newRow?: DataRowProps,
): DataRowProps[] => {
  return rows.map((row) => {
    let updatedRow = {
      ...row,
      level,
      child: row.child ? assignLevelsAndAddRow(row.child, level + 1, parentId, newRow) : [],
    };
    const sortedRows = updatedRow.child.sort((a, b) => a.level! - b.level!);
    updatedRow.child = sortedRows;
    console.log('updatedRow', updatedRow);
    if (newRow && row.id === parentId) {
      updatedRow.child = [...updatedRow.child, { ...newRow, level: level + 1 }];
    }

    return updatedRow;
  });
};

export const buildTree = (
  rows: DataRowProps[],
  parentId: number | null = null,
  newRow?: DataRowProps,
): DataRowProps[] => {
  return assignLevelsAndAddRow(rows, 0, parentId, newRow);
};
