export interface DataRowProps {
  id: number;
  parentId: number | null;
  rowName: string;
  equipmentCosts: number;
  estimatedProfit: number;
  machineOperatorSalary: number;
  mainCosts: number;
  materials: number;
  mimExploitation: number;
  overheads: number;
  salary: number;
  supportCosts: number;
  total: number;
  child?: DataRowProps[];
}
