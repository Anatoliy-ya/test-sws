import { DataRowProps } from 'src/types/types';

export const buildTree = (rows: DataRowProps[]): DataRowProps[] => {
  const map: { [key: number]: DataRowProps } = {};
  const tree: DataRowProps[] = [];

  rows.forEach((row) => {
    map[row.id] = { ...row, child: [] };
  });

  rows.forEach((row) => {
    if (row.parentId) {
      map[row.parentId].child?.push(map[row.id]);
    } else {
      tree.push(map[row.id]);
    }
  });

  return tree;
};
