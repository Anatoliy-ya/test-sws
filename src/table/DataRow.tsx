import { useEffect, useState } from 'react';
import styles from './DataRow.module.scss';
import Input from 'src/UI/Input';
import { DataRowProps } from '../types/types';
import { useUpdateRowMutation } from 'src/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setRows, updateRow as updateRowAction } from 'src/store/slices/rowsSlice';
import { RootState } from 'src/store/store';
import { buildTree } from 'src/utils/buildTree';
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
  level,
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
  const rows = useSelector((state: RootState) => state.rows.rows);
  const [updateRow] = useUpdateRowMutation();
  const classDataRowChildren = `${styles.dataRow} ${styles.dataRowChildren}`;
  const rowStyle = {
    marginLeft: `${level! * 10}px`,
  };
  const classDataRowIconChildren = `${styles.dataRowIcon} ${rowStyle}`;

  useEffect(() => {
    setUpdatedRow({
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
      console.log('eID', eID);
      if (!eID) return;
      const result = await updateRow({
        eID: eID,
        rID: id,
        row: updatedRow,
      }).unwrap();
      // @ts-ignore
      console.log('Updated row:', result.current);
      // @ts-ignore
      const resultUpdateRow = { ...result.current };
      dispatch(updateRowAction({ rID: id, updatedRow: { ...resultUpdateRow } }));
      const updatedRows = rows.map((row) => (row.id === id ? { ...row, ...resultUpdateRow } : row));
      console.log('updatedRows', updatedRows);
      const treeRows = buildTree(updatedRows);
      console.log('dispatch setRows', treeRows);
      dispatch(setRows(treeRows));
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
          <div className={classDataRowIconChildren} style={rowStyle}>
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
            <p>{salaryChange}</p>
            <p>{overheadsChange}</p>
            <p>{equipmentCostsChange}</p>
            <p>{estimatedProfitChange}</p>
          </div>
        )}
      </div>
      <div>
        {child &&
          child.map((childRow) => (
            <DataRow
              key={childRow.id}
              {...childRow}
              eID={eID}
              onHandleDeleteRow={() => onHandleDeleteRow(childRow.id)}
              onHandleCreateRow={() => onHandleCreateRow(childRow.id)}
              isActiveDelete={true}
            />
          ))}
      </div>
    </>
  );
}
