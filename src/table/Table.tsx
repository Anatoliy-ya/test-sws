import styles from './Table.module.scss';
import {
  useGetRowsQuery,
  useCreateEntityMutation,
  useCreateRowMutation,
  useDeleteRowMutation,
} from '../api/api';
import { useEffect, useState } from 'react';
import { DataRowProps } from '../types/types';
import DataRow from './DataRow';

export default function Table() {
  const [eID, setEID] = useState<string>(() => {
    return localStorage.getItem('eID') || '';
  });

  const [createEntity] = useCreateEntityMutation();
  const { data, isLoading, error } = useGetRowsQuery(eID, { skip: !eID });
  const [createRow] = useCreateRowMutation();
  const [deleteRow] = useDeleteRowMutation();

  // Проверка eID и создание сущности
  useEffect(() => {
    const createEntityAndRow = async () => {
      try {
        const entityResult = await createEntity().unwrap();
        setEID(entityResult.id.toString());
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
          eID: eID,
          row: {
            idParent: null,
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
    if (eID && data && data.length === 0) {
      createInitialRow();
    }
  }, [createRow, eID, data]);

  useEffect(() => {
    if (data) {
      console.log('Fetched data:', data);
      console.log('Fetched eID:', eID);
    }
  }, [data]);

  const handleDeleteRow = async (rID: string) => {
    try {
      const result = await deleteRow({ eID: eID, rID: rID }).unwrap();
      console.log('Deleted row:', result);
    } catch (error) {
      console.log('Error deleting row:', error);
    }
  };

  const handleCreateRow = async () => {
    try {
      const rowResult = await createRow({
        eID: eID,
        row: {
          idParent: null,
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
              onHandleDeleteRow={() => {
                handleDeleteRow(row.id);
                console.log('Row clicked:', row);
              }}
              onHandleCreateRow={() => {
                handleCreateRow();
                console.log('Row clicked:', row);
              }}
              isActiveDelete={true}
              key={row.id}
              id={row.id}
              idParent={row.idParent}
              rowName={row.rowName}
              equipmentCosts={row.equipmentCosts}
              estimatedProfit={row.estimatedProfit}
              machineOperatorSalary={row.machineOperatorSalary}
              mainCosts={row.mainCosts}
              materials={row.materials}
              mimExploitation={row.mimExploitation}
              overheads={row.overheads}
              salary={row.salary}
              supportCosts={row.supportCosts}
              total={row.total}
              children={row.children}
            />
          ))}
      </div>
    </div>
  );
}
