import styles from './DataRow.module.scss';
import TextSnippetRoundedIcon from '@mui/icons-material/TextSnippetRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { DataRowProps } from '../types/types';
import { useState } from 'react';

interface RowProps extends DataRowProps {
  onHandleDeleteRow: () => void;
  onHandleCreateRow: () => void;
  isActiveDelete: boolean;
}
export default function DataRow({
  id,
  idParent,
  children,
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
  return (
    <div className={styles.dataRow}>
      <div className={styles.dataRowName}>
        <div className={styles.dataRowIcon}>
          <TextSnippetRoundedIcon
            className={styles.textSnippetRoundedIcon}
            onClick={onHandleCreateRow}
          />
          {isActiveDelete && (
            <DeleteRoundedIcon className={styles.deleteRoundedIcon} onClick={onHandleDeleteRow} />
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
  );
}
