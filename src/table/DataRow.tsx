import styles from './DataRow.module.scss';
import TextSnippetRoundedIcon from '@mui/icons-material/TextSnippetRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { DataRowProps } from '../types/types';
import { useState } from 'react';

interface RowProps extends DataRowProps {
  onHandleCreateRow: (idParent: number | null) => void;
  onHandleDeleteRow: (id: number) => void;
  isActiveDelete: boolean;
}
export default function DataRow({
  id,
  parentId,
  child,
  rowName,
  equipmentCosts,
  estimatedProfit,
  machineOperatorSalary,
  mainCosts,
  materials,
  mimExploitation,
  overheads,
  salary,
  supportCosts,
  onHandleDeleteRow,
  onHandleCreateRow,
  isActiveDelete,
}: RowProps) {
  const classDataRowChildren = `${styles.dataRow} ${styles.dataRowChildren}`;
  const classDataRowIconChildren = `${
    child && child.length > 0
      ? styles.dataRowIcon
      : `${styles.dataRowIcon} ${styles.dataRowIconChildren}`
  }`;

  const handleCreateRowWrapper = (parentId: number | null) => () => {
    onHandleCreateRow(parentId);
  };

  return (
    <>
      <div className={styles.dataRow}>
        <div className={styles.dataRowName}>
          <div className={classDataRowIconChildren}>
            <TextSnippetRoundedIcon
              className={styles.textSnippetRoundedIcon}
              onClick={handleCreateRowWrapper(id)}
            />
            {isActiveDelete && (
              <DeleteRoundedIcon
                className={styles.deleteRoundedIcon}
                onClick={() => onHandleDeleteRow(id)}
              />
            )}
          </div>
          <p>{rowName}</p>
        </div>
        <div className={styles.dataRowData}>
          <p>{salary}</p>
          <p>{overheads}</p>
          <p>{equipmentCosts}</p>
          <p>{estimatedProfit}</p>
        </div>
      </div>
      <div className={classDataRowChildren}>
        {child &&
          child.map((childRow) => (
            <DataRow
              key={childRow.id}
              {...childRow}
              onHandleDeleteRow={() => onHandleDeleteRow(childRow.id)}
              onHandleCreateRow={() => onHandleCreateRow(childRow.id)}
              isActiveDelete={true}
            />
          ))}
      </div>
    </>
  );
}
