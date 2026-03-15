export interface SimulationInputs {
  priceIncrease: number;
  customerCount: number;
  churnRate: number;
  annualVisits: number;
  promotionRate: number;
  cashBalance: number;
  // New deficit components
  currentRevenue: number;
  currentCost: number;
  fixedCosts: number;
  loanPrincipal: number;
  // monthlyDeficit is now calculated
  monthlyDeficit?: number; 
}

export interface SimulationResults {
  annualRevenueIncrease: number;
  promotionCost: number;
  annualNetImprovement: number;
  monthlyImprovement: number;
  currentMonthlyDeficit: number; // Calculated from inputs
  currentRunway: number | 'no_short';
  improvedMonthlyDeficit: number;
  improvedRunway: number | 'no_short';
  extensionMonths: number | 'avoided';
}

export function calculateSimulation(inputs: SimulationInputs): SimulationResults {
  const {
    priceIncrease,
    customerCount,
    churnRate,
    annualVisits,
    promotionRate,
    cashBalance,
    currentRevenue,
    currentCost,
    fixedCosts,
    loanPrincipal,
  } = inputs;

  // Calculate current monthly deficit based on the user request
  // 月間資金不足額 = 仕入 + 固定費 + 借入元本 - 現在の売上
  // Note: user said "売上 - 仕入 - 固定費 - 借入元本" but called it "不足額".
  // If Revenue - Costs is positive, it's Surplus. If negative, the absolute value is Deficit.
  // We want currentMonthlyDeficit as a positive number for calculation if it is a shortfall.
  const currentMonthlyDeficit = (currentCost + fixedCosts + loanPrincipal) - currentRevenue;

  const annualRevenueIncrease = priceIncrease * customerCount * (1 - churnRate / 100) * annualVisits;
  const promotionCost = annualRevenueIncrease * (promotionRate / 100);
  const annualNetImprovement = annualRevenueIncrease - promotionCost;
  const monthlyImprovement = annualNetImprovement / 12;

  const currentRunway = currentMonthlyDeficit > 0 ? cashBalance / currentMonthlyDeficit : 'no_short';
  
  const improvedMonthlyDeficit = currentMonthlyDeficit - monthlyImprovement;
  const improvedRunway = improvedMonthlyDeficit > 0 ? cashBalance / improvedMonthlyDeficit : 'no_short';

  let extensionMonths: number | 'avoided';
  if (improvedRunway === 'no_short') {
    extensionMonths = 'avoided';
  } else if (currentRunway === 'no_short') {
    extensionMonths = 0;
  } else {
    extensionMonths = improvedRunway - currentRunway;
  }

  return {
    annualRevenueIncrease,
    promotionCost,
    annualNetImprovement,
    monthlyImprovement,
    currentMonthlyDeficit,
    currentRunway,
    improvedMonthlyDeficit,
    improvedRunway,
    extensionMonths,
  };
}

export function generateChartData(inputs: SimulationInputs, results: SimulationResults) {
  const data = [];
  const { cashBalance } = inputs;
  const { currentMonthlyDeficit, improvedMonthlyDeficit } = results;

  for (let month = 0; month <= 12; month++) {
    const currentBalance = Math.max(0, cashBalance - (month * currentMonthlyDeficit));
    const improvedBalance = improvedMonthlyDeficit > 0 
      ? Math.max(0, cashBalance - (month * improvedMonthlyDeficit))
      : cashBalance;

    data.push({
      month: `${month}ヶ月`,
      現状: Math.round(currentBalance),
      値上げ後: Math.round(improvedBalance),
    });
  }
  return data;
}
