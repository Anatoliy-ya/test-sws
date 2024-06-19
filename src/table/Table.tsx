import styles from './Table.module.scss';
import {
  useGetRowsQuery,
  useCreateEntityMutation,
  useCreateRowMutation,
  useDeleteRowMutation,
} from '../api/api';
import { useSelector, useDispatch } from 'react-redux';
import { addRow, setRows } from 'src/store/slices/rowsSlice';
import { useEffect, useState } from 'react';
import { DataRowProps } from '../types/types';
import DataRow from './DataRow';

export default function Table() {
  const [eID, setEID] = useState<number | null>(() => {
    const savedEID = localStorage.getItem('eID');
    return savedEID ? parseInt(savedEID, 10) : null;
  });
  const dispatch = useDispatch();
  const rows = useSelector((state: { rows: { rows: DataRowProps[] } }) => state.rows.rows);
  console.log('Rows:', rows);
  const [createEntity] = useCreateEntityMutation();
  const { data, isLoading, error } = useGetRowsQuery(eID ?? 0, { skip: !eID });
  const [createRow] = useCreateRowMutation();
  const [deleteRow] = useDeleteRowMutation();

  // Проверка eID и создание сущности
  useEffect(() => {
    const createEntityAndRow = async () => {
      try {
        const entityResult = await createEntity().unwrap();
        setEID(entityResult.id);
        localStorage.setItem('eID', entityResult.id.toString());
        console.log('Created eID:', entityResult.id);
      } catch (error) {
        console.error('Error creating entity:', error);
      }
    };
    if (!eID) {
      createEntityAndRow();
    }
  }, [createEntity, eID]);

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
        dispatch(addRow(rowResult));
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
      dispatch(setRows(data));
    }
  }, [data, dispatch]);

  const handleDeleteRow = async (rID: number) => {
    if (eID !== null) {
      try {
        const result = await deleteRow({ eID: eID, rID: rID }).unwrap();
        console.log('Deleted row:', result);
      } catch (error) {
        console.log('Error deleting row:', error);
      }
    }
  };

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
      console.log('Created row:', rowResult);
    } catch (error) {
      console.error('Error creating row:', error);
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
        {data &&
          data.map((row: DataRowProps) => (
            <DataRow
              key={row.id}
              {...row}
              isActiveDelete={true}
              onHandleCreateRow={(idParent: number | null) => {
                handleCreateRow(idParent);
                console.log('Row clicked:', row);
              }}
              onHandleDeleteRow={(id: number) => {
                handleDeleteRow(id);
                console.log('Row clicked:', row);
              }}
            />
          ))}
      </div>
    </div>
  );
}
