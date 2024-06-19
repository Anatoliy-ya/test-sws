export interface DataRowProps {
  id: string;
  idParent: string | null;
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
  children?: DataRowProps[];
}
