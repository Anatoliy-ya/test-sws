import { useEffect, useState } from 'react';
import styles from './Table.module.scss';
import {
  useGetRowsQuery,
  useCreateEntityMutation,
  useCreateRowMutation,
  useDeleteRowMutation,
} from '../api/api';
import { useSelector, useDispatch } from 'react-redux';
import { addRow, setRows, deleteRow as deleteRowAction } from 'src/store/slices/rowsSlice';
import { setEID } from 'src/store/slices/eidSlice';
import { buildTree } from '../utils/buildTree';
import { DataRowProps } from '../types/types';
import DataRow from './DataRow';
import { RootState } from 'src/store/store';

export default function Table() {
  const [deleteRowState, setDeleteRowState] = useState<number>();
  const dispatch = useDispatch();
  const rows = useSelector((state: RootState) => state.rows.rows);
  const eID = useSelector((state: RootState) => state.entity.eID);
  const [createEntity] = useCreateEntityMutation();
  const { data, isLoading, error } = useGetRowsQuery(eID ?? 0, { skip: !eID });
  const [createRow] = useCreateRowMutation();
  const [deleteRow] = useDeleteRowMutation();
  console.log('rows:', rows);

  // Проверка eID и создание
  useEffect(() => {
    const storedEID = localStorage.getItem('eID');
    if (storedEID) {
      dispatch(setEID(Number(storedEID)));
    } else {
      const createEntityAndSetEID = async () => {
        try {
          const entityResult = await createEntity().unwrap();
          localStorage.setItem('eID', entityResult.id.toString());
          dispatch(setEID(entityResult.id));
          console.log('Created eID:', entityResult.id);
        } catch (error) {
          console.error('Error creating entity:', error);
        }
      };
      createEntityAndSetEID();
    }
  }, [dispatch, createEntity]);

  useEffect(() => {
    const storedEID = localStorage.getItem('eID');
    if (storedEID) {
      dispatch(setEID(Number(storedEID)));
    }
  }, [dispatch]);

  // Проверка и создаём первую строки, если массив пуст
  useEffect(() => {
    const createInitialRow = async () => {
      try {
        const rowResult = await createRow({
          eID: eID!,
          row: {
            parentId: null,
            rowName: '',
            equipmentCosts: 0,
            estimatedProfit: 0,
            machineOperatorSalary: 0,
            mainCosts: 0,
            materials: 0,
            mimExploitation: 0,
            overheads: 0,
            salary: 0,
            supportCosts: 0,
          },
        }).unwrap();
        console.log('Created row:', rowResult);
        // @ts-ignore
        dispatch(addRow({ parentId: null, row: rowResult.current }));
      } catch (error) {
        console.error('Error creating row:', error);
      }
    };
    if (eID && data && data.length === 0) {
      createInitialRow();
    }
  }, [createRow, eID, data]);

  useEffect(() => {
    if (data) {
      console.log('Fetched data:', data);
      console.log('Fetched eID:', eID);
      // const treeRows = buildTree(data);
      // console.log('Tree rows:', treeRows);
      dispatch(setRows(data));
    }
  }, [data, dispatch]);

  const handleCreateRow = async (parentId: number | null) => {
    try {
      console.log('Creating row with parentId:', parentId);
      const rowResult = await createRow({
        eID: eID!,
        row: {
          parentId: parentId,
          rowName: '',
          equipmentCosts: 0,
          estimatedProfit: 0,
          machineOperatorSalary: 0,
          mainCosts: 0,
          materials: 0,
          mimExploitation: 0,
          overheads: 0,
          salary: 0,
          supportCosts: 0,
        },
      }).unwrap();
      // @ts-ignore
      console.log('rowResult:', rowResult.current);
      if (rowResult) {
        // @ts-ignore
        dispatch(addRow({ parentId: parentId, row: rowResult.current }));
      }
    } catch (error) {
      console.error('Error creating row:', error);
    }
  };

  const handleDeleteRow = async (rID: number) => {
    if (eID !== null) {
      try {
        const result = await deleteRow({ eID: eID, rID: rID }).unwrap();
        console.log('Deleted row:', rID);
        setDeleteRowState(rID);
        console.log('Deleted row:', result);
      } catch (error) {
        console.log('Error deleting row:', error);
      }
      console.log('deleteRowAction:', rID);
      dispatch(deleteRowAction(rID));
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.table}>
      <div className={styles.nameColumn}>
        <div className={styles.nameColumnTitle}>
          <p>Уровень</p>
          <p>Наименование работ</p>
        </div>
        <div className={styles.nameColumnData}>
          <p>Основная з/п</p>
          <p>Оборудование</p>
          <p>Накладные расходы</p>
          <p>Сметная прибыль</p>
        </div>
      </div>
      <div className={styles.dataRows}>
        {rows &&
          rows.map((row: DataRowProps) => (
            <DataRow
              key={row.id}
              {...row}
              eID={eID!}
              isActiveDelete={row.child?.length === 0 && rows.length > 1 ? true : false}
              onHandleCreateRow={handleCreateRow}
              onHandleDeleteRow={handleDeleteRow}
            />
          ))}
      </div>
    </div>
  );
}
