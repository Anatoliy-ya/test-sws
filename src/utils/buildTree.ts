import { DataRowProps } from 'src/types/types';

const assignLevels = (rows: DataRowProps[], level: number): DataRowProps[] => {
  return rows.map((row) => ({
    ...row,
    level,
    child: assignLevels(row.child || [], level + 1),
  }));
};

export const buildTree = (rows: DataRowProps[]): DataRowProps[] => {
  return assignLevels(rows, 0);
};
