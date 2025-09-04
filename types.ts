
export interface DCFInputs {
  companyName: string;
  currentFCF: number;
  growthRate: number;
  projectionYears: number;
  wacc: number;
  terminalGrowthRate: number;
  debt: number;
  cash: number;
  sharesOutstanding: number;
}

export interface ProjectedCashFlow {
  year: number;
  projectedFCF: number;
  presentValue: number;
}

export interface DCFResults {
  enterpriseValue: number;
  equityValue: number;
  intrinsicValuePerShare: number;
  projectedCashFlows: ProjectedCashFlow[];
  pvTerminalValue: number;
  sumPvCashFlows: number;
}
