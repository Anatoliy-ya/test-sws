import { useEffect, useState } from 'react';
import styles from './DataRow.module.scss';
import Input from 'src/UI/Input';
import { DataRowProps } from '../types/types';
import { useUpdateRowMutation } from 'src/api/api';
import { useDispatch } from 'react-redux';
import { updateRow as updateRowAction } from 'src/store/slices/rowsSlice';
import TextSnippetRoundedIcon from '@mui/icons-material/TextSnippetRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

interface RowProps extends DataRowProps {
  onHandleCreateRow: (idParent: number | null) => void;
  onHandleDeleteRow: (id: number) => void;
  isActiveDelete: boolean;
  eID?: number;
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
  eID,
}: RowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [rowNameChange, setRowNameChange] = useState<string>(rowName);
  const [salaryChange, setSalaryChange] = useState<number>(salary);
  const [overheadsChange, setOverheadsChange] = useState<number>(overheads);
  const [equipmentCostsChange, setEquipmentCostsChange] = useState<number>(equipmentCosts);
  const [estimatedProfitChange, setEstimatedProfitChange] = useState<number>(estimatedProfit);
  const [updatedRow, setUpdatedRow] = useState<Omit<DataRowProps, 'id' | 'child' | 'total'>>({
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
  });
  const dispatch = useDispatch();
  const [updateRow] = useUpdateRowMutation();
  const classDataRowChildren = `${styles.dataRow} ${styles.dataRowChildren}`;
  const classDataRowIconChildren = `${
    child && child.length > 0
      ? styles.dataRowIcon
      : `${styles.dataRowIcon} ${styles.dataRowIconChildren}`
  }`;

  useEffect(() => {
    setUpdatedRow({
      parentId: parentId,
      rowName: rowNameChange,
      equipmentCosts: equipmentCosts + equipmentCostsChange,
      estimatedProfit: estimatedProfit + estimatedProfitChange,
      machineOperatorSalary,
      mainCosts,
      materials,
      mimExploitation,
      overheads: overheads + overheadsChange,
      salary: salary + salaryChange,
      supportCosts,
    });
  }, [rowNameChange, salaryChange, overheadsChange, equipmentCostsChange, estimatedProfitChange]);

  const handleUpdateRow = async () => {
    try {
      if (!eID) return;
      const result = await updateRow({
        eID,
        rID: id,
        row: { ...updatedRow },
      }).unwrap();
      console.log('Updated row:', result);
      dispatch(updateRowAction({ rID: id, updatedRow: { ...updatedRow } }));
    } catch (error) {
      console.error('Error updating row:', error);
    }
  };

  const handleCreateRowWrapper = (parentId: number | null) => () => {
    onHandleCreateRow(parentId);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      handleUpdateRow();
    }
  };
  return (
    <>
      <div className={styles.dataRow} onDoubleClick={handleDoubleClick}>
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
          {isEditing ? (
            <Input
              type="text"
              value={rowNameChange}
              onChange={(e) => setRowNameChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.nameRowInput}
            />
          ) : (
            <p>{rowName}</p>
          )}
        </div>
        {isEditing ? (
          <div className={styles.dataRowInput}>
            <Input
              type="number"
              value={salaryChange}
              onChange={(e) => setSalaryChange(Number(e.target.value))}
              onKeyDown={handleKeyDown}
            />
            <Input
              type="number"
              value={overheadsChange}
              onChange={(e) => setOverheadsChange(Number(e.target.value))}
              onKeyDown={handleKeyDown}
            />
            <Input
              type="number"
              value={equipmentCostsChange}
              onChange={(e) => setEquipmentCostsChange(Number(e.target.value))}
              onKeyDown={handleKeyDown}
            />
            <Input
              type="number"
              value={estimatedProfitChange}
              onChange={(e) => setEstimatedProfitChange(Number(e.target.value))}
              onKeyDown={handleKeyDown}
            />
          </div>
        ) : (
          <div className={styles.dataRowData} onDoubleClick={handleDoubleClick}>
            <p>{salary === 0 && ''}</p>
            <p>{overheads === 0 && ''}</p>
            <p>{equipmentCosts === 0 && ''}</p>
            <p>{estimatedProfit === 0 && ''}</p>
          </div>
        )}
      </div>
      <div>
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
