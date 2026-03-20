export interface SimulationInputs {
  priceIncrease: number;
  customerCount: number;
  churnRate: number;
  annualVisits: number;
  promotionRate: number;
  cashBalance: number;
  currentRevenue: number;
  currentCost: number;
  fixedCosts: number;
  loanPrincipal: number;
  /** 未入力時は currentRevenue × 12 を使用 */
  currentAnnualRevenue?: number;
  /** 未入力時は currentCost × 12 を使用 */
  currentAnnualCost?: number;
  monthlyDeficit?: number;
}

export interface SimulationResults {
  priceIncreaseEffect: number;
  costRate: number;
  grossProfitRate: number;
  newPotentialRevenue: number;
  revenueLossDueToChurn: number;
  gpLossDueToChurn: number;
  finalAnnualImprovement: number;
  promotionCost: number;
  annualNetImprovement: number;
  monthlyImprovement: number;
  currentMonthlyDeficit: number;
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

  const currentAnnualRevenue =
    inputs.currentAnnualRevenue ?? currentRevenue * 12;
  const currentAnnualCostInput =
    inputs.currentAnnualCost ?? currentCost * 12;

  const currentMonthlyDeficit =
    currentCost + fixedCosts + loanPrincipal - currentRevenue;

  const priceIncreaseEffect = priceIncrease * customerCount * annualVisits;

  const costRate =
    currentAnnualRevenue > 0
      ? Math.min(1, currentAnnualCostInput / currentAnnualRevenue)
      : 0;
  const grossProfitRate = 1 - costRate;

  const newPotentialRevenue = currentAnnualRevenue + priceIncreaseEffect;
  const revenueLossDueToChurn = newPotentialRevenue * (churnRate / 100);

  // 離脱による粗利影響：原価率・粗利率は「既存の年間売上」にのみ対応する前提。
  // 値上げによる増収分には追加仕入を乗せない → その分の離脱売上減に対する影響は100%（=コストなしの増分利益が失われる）。
  let gpLossDueToChurn = 0;
  if (newPotentialRevenue > 0 && revenueLossDueToChurn > 0) {
    const shareExisting = Math.max(0, currentAnnualRevenue) / newPotentialRevenue;
    const shareIncrease = Math.max(0, priceIncreaseEffect) / newPotentialRevenue;
    const churnLossExisting = revenueLossDueToChurn * shareExisting;
    const churnLossIncrease = revenueLossDueToChurn * shareIncrease;
    gpLossDueToChurn =
      churnLossExisting * grossProfitRate + churnLossIncrease * 1;
  }

  const finalAnnualImprovement = priceIncreaseEffect - gpLossDueToChurn;

  const promotionCost =
    Math.max(0, finalAnnualImprovement) * (promotionRate / 100);
  const annualNetImprovement = finalAnnualImprovement - promotionCost;
  const monthlyImprovement = annualNetImprovement / 12;

  const currentRunway =
    currentMonthlyDeficit > 0 ? cashBalance / currentMonthlyDeficit : 'no_short';

  const improvedMonthlyDeficit = currentMonthlyDeficit - monthlyImprovement;
  const improvedRunway =
    improvedMonthlyDeficit > 0 ? cashBalance / improvedMonthlyDeficit : 'no_short';

  let extensionMonths: number | 'avoided';
  if (improvedRunway === 'no_short') {
    extensionMonths = 'avoided';
  } else if (currentRunway === 'no_short') {
    extensionMonths = 0;
  } else {
    extensionMonths = improvedRunway - currentRunway;
  }

  return {
    priceIncreaseEffect,
    costRate,
    grossProfitRate,
    newPotentialRevenue,
    revenueLossDueToChurn,
    gpLossDueToChurn,
    finalAnnualImprovement,
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

export function generateChartData(
  inputs: SimulationInputs,
  results: SimulationResults
) {
  const data: Array<{ month: string; 現状: number; 値上げ後: number }> = [];
  const { cashBalance } = inputs;
  const { currentMonthlyDeficit, improvedMonthlyDeficit } = results;

  for (let month = 0; month <= 12; month++) {
    const currentBalance = Math.max(0, cashBalance - month * currentMonthlyDeficit);
    const improvedBalance =
      improvedMonthlyDeficit > 0
        ? Math.max(0, cashBalance - month * improvedMonthlyDeficit)
        : cashBalance;

    data.push({
      month: `${month}ヶ月`,
      現状: Math.round(currentBalance),
      値上げ後: Math.round(improvedBalance),
    });
  }
  return data;
}
