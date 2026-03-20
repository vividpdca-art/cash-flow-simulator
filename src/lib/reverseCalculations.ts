/**
 * 返済分岐点ベースの粗利逆算（月次）。
 * 既存シミュレーターの「固定費＋元本返済を粗利で賄う」考え方と整合させる。
 */

export interface ReverseCalculationInputs {
  /** 月間売上高 */
  monthlyRevenue: number;
  /** 粗利率（%）例: 40 → 40% */
  grossMarginPercent: number;
  /** 月間固定費 */
  fixedCosts: number;
  /** 月間の借入元本返済 */
  loanPrincipal: number;
  /** 平均単価（1単位あたり） */
  avgUnitPrice: number;
  /** ハイブリッド比率（0-100, 100=全部数量増, 0=全部値上げ） */
  hybridRatio: number;
}

export interface ReverseCalculationResults {
  /** 現在粗利額 = 売上 × 粗利率 */
  currentGrossProfit: number;
  /** 返済分岐点粗利益額 = 固定費 + 元本返済 */
  breakEvenGrossProfit: number;
  /** 不足粗利（0未満にはしない） */
  grossProfitShortfall: number;
  /** 返済分岐点売上高 = 返済分岐点粗利益 ÷ 粗利率 */
  breakEvenRevenue: number;
  /** 現状数量 = 売上 ÷ 平均単価 */
  quantity: number;
  /** ハイブリッド比率の数値（表示用） */
  hybridRatio: number;
  /** A: 単価据え置きで埋める必要数量増（不足粗利を全額数量で賄う場合） */
  optionA_quantityIncrease: number;
  /** B: 数量据え置きで埋める必要値上げ額（1単位あたり、不足粗利を全額値上げで賄う場合） */
  optionB_priceIncrease: number;
  /** B: 必要値上げ率（不足粗利 / 売上） */
  optionB_priceIncreaseRate: number;
  /** C: 不足粗利を指定比率で数量増・値上げで賄う場合 */
  optionC_hybrid: {
    quantityIncrease: number;
    priceIncreasePerUnit: number;
    quantityPercent: number;
    pricePercent: number;
  };
}

export type ReverseCalculationOutcome =
  | { ok: true; data: ReverseCalculationResults }
  | { ok: false; error: string };

function clampNonNegative(n: number): number {
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

/**
 * 粗利率を売上に比例する粗利額として扱い、
 * 増分売上に対する粗利増は「増分売上 × 粗利率」とする（単価・数量の小さな変化でも同一次近似と一致）。
 */
export function calculateReverse(
  raw: ReverseCalculationInputs
): ReverseCalculationOutcome {
  const monthlyRevenue = clampNonNegative(raw.monthlyRevenue);
  const fixedCosts = clampNonNegative(raw.fixedCosts);
  const loanPrincipal = clampNonNegative(raw.loanPrincipal);
  const avgUnitPrice = raw.avgUnitPrice;

  if (!Number.isFinite(raw.grossMarginPercent) || raw.grossMarginPercent <= 0) {
    return { ok: false, error: '粗利率は 0 より大きい値を入力してください。' };
  }
  if (raw.grossMarginPercent >= 100) {
    return { ok: false, error: '粗利率は 100 未満を入力してください。' };
  }

  const m = raw.grossMarginPercent / 100;
  const breakEvenGrossProfit = fixedCosts + loanPrincipal;
  const currentGrossProfit = monthlyRevenue * m;
  const grossProfitShortfall = Math.max(0, breakEvenGrossProfit - currentGrossProfit);
  const breakEvenRevenue = breakEvenGrossProfit / m;

  if (!(avgUnitPrice > 0) || !Number.isFinite(avgUnitPrice)) {
    return { ok: false, error: '平均単価は 0 より大きい値を入力してください。' };
  }

  const quantity = monthlyRevenue / avgUnitPrice;
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return {
      ok: false,
      error: '現状数量を算出できません。月間売上と平均単価を確認してください。',
    };
  }

  const denomQty = avgUnitPrice * m;
  const optionA_quantityIncrease =
    grossProfitShortfall > 0 && denomQty > 0 ? grossProfitShortfall / denomQty : 0;

  const optionB_priceIncrease =
    grossProfitShortfall > 0 && quantity > 0 ? grossProfitShortfall / quantity : 0;
  const optionB_priceIncreaseRate =
    grossProfitShortfall > 0 && monthlyRevenue > 0 ? grossProfitShortfall / monthlyRevenue : 0;

  const hybridRatio = raw.hybridRatio;
  const quantityRatio = hybridRatio / 100;
  const priceRatio = (100 - hybridRatio) / 100;

  const shortfallForQuantity = grossProfitShortfall * quantityRatio;
  const shortfallForPrice = grossProfitShortfall * priceRatio;

  const optionC_hybrid = {
    quantityIncrease: shortfallForQuantity > 0 && denomQty > 0 ? shortfallForQuantity / denomQty : 0,
    priceIncreasePerUnit: shortfallForPrice > 0 && quantity > 0 ? shortfallForPrice / quantity : 0,
    quantityPercent: hybridRatio,
    pricePercent: 100 - hybridRatio,
  };

  return {
    ok: true,
    data: {
      currentGrossProfit,
      breakEvenGrossProfit,
      grossProfitShortfall,
      breakEvenRevenue,
      quantity,
      hybridRatio,
      optionA_quantityIncrease,
      optionB_priceIncrease,
      optionB_priceIncreaseRate,
      optionC_hybrid,
    },
  };
}
