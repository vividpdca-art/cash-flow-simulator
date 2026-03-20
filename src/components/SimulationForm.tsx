import React from 'react';
import { SimulationInputs } from '@/lib/calculations';

interface Props {
  inputs: SimulationInputs;
  onChange: (newInputs: SimulationInputs) => void;
}

const Field = ({
  label,
  name,
  value,
  unit,
  min,
  max,
  onChange,
}: {
  label: string;
  name: string;
  value: number;
  unit: string;
  min?: number;
  max?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <div className="relative flex items-center">
      <input
        type="number"
        name={name}
        value={value === 0 ? '' : value}
        onChange={onChange}
        placeholder="0"
        min={min}
        max={max}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-12 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 md:text-sm"
      />
      <span className="absolute right-3 text-slate-600 text-sm">{unit}</span>
    </div>
  </div>
);

const SliderField = ({
  label,
  name,
  value,
  unit,
  min = 0,
  max = 100,
  onChange,
}: {
  label: string;
  name: string;
  value: number;
  unit: string;
  min?: number;
  max?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex flex-col space-y-4">
    <div className="flex justify-between items-center">
      <label className="text-sm font-bold text-slate-600 tracking-tight">
        {label}
      </label>
      <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
        {value}
        {unit}
      </span>
    </div>
    <input
      type="range"
      name={name}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={0.5}
      className="w-full h-2 bg-slate-200 rounded-xl appearance-none cursor-pointer accent-blue-600 transition-all hover:bg-slate-300"
    />
  </div>
);

export default function SimulationForm({ inputs, onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (
      value === '' &&
      (name === 'currentAnnualRevenue' || name === 'currentAnnualCost')
    ) {
      const next = { ...inputs };
      delete (next as Partial<SimulationInputs>)[name as keyof SimulationInputs];
      onChange(next);
      return;
    }
    if (value === '' && e.target.type === 'number') {
      onChange({
        ...inputs,
        [name]: 0,
      });
      return;
    }

    let numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    if (name === 'churnRate' || name === 'promotionRate') {
      numValue = Math.min(100, Math.max(0, numValue));
    } else {
      numValue = Math.max(0, numValue);
    }

    onChange({
      ...inputs,
      [name]: numValue,
    });
  };

  const currentMonthlyDeficit =
    inputs.currentCost + inputs.fixedCosts + inputs.loanPrincipal - inputs.currentRevenue;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-12">
      <div className="bg-white p-5 md:p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6 md:mb-8 border-b border-slate-50 pb-4">
          <div className="w-1.5 h-7 bg-blue-600 rounded-full" />
          <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">
            値上げ・販促条件
          </h2>
        </div>

        <div className="space-y-8 md:space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <Field
              label="値上げ額"
              name="priceIncrease"
              value={inputs.priceIncrease}
              unit="円"
              onChange={handleChange}
            />
            <Field
              label="顧客数"
              name="customerCount"
              value={inputs.customerCount}
              unit="人"
              onChange={handleChange}
            />
          </div>

          <div className="p-4 md:p-6 bg-slate-50 rounded-2xl space-y-6 md:space-y-8">
            <SliderField
              label="値上げによる離脱率"
              name="churnRate"
              value={inputs.churnRate}
              unit="%"
              min={0}
              max={50}
              onChange={handleChange}
            />
            <SliderField
              label="販促費率"
              name="promotionRate"
              value={inputs.promotionRate}
              unit="%"
              min={0}
              max={50}
              onChange={handleChange}
            />
          </div>

          <Field
            label="年間来店数"
            name="annualVisits"
            value={inputs.annualVisits}
            unit="回"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="bg-white p-5 md:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col">
        <div className="flex items-center gap-3 mb-6 md:mb-8 border-b border-slate-50 pb-4">
          <div className="w-1.5 h-7 bg-amber-600 rounded-full" />
          <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">
            現在の経営状況（資金繰り）
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 md:gap-y-8 flex-grow">
          <div className="col-span-1 sm:col-span-2">
            <Field
              label="現預金残高"
              name="cashBalance"
              value={inputs.cashBalance}
              unit="円"
              onChange={handleChange}
            />
          </div>

          <div className="col-span-1 sm:col-span-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">
              直近1年間の決算データ（粗利計算用・任意）
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="現在の年間売上"
                name="currentAnnualRevenue"
                value={inputs.currentAnnualRevenue ?? inputs.currentRevenue * 12}
                unit="円"
                onChange={handleChange}
              />
              <Field
                label="現在の年間仕入額"
                name="currentAnnualCost"
                value={inputs.currentAnnualCost ?? inputs.currentCost * 12}
                unit="円"
                onChange={handleChange}
              />
            </div>
            <p className="text-[10px] text-slate-600 font-medium">
              未入力の場合は「月間売上×12／月間仕入×12」を計算に使用します。
            </p>
          </div>

          <Field
            label="現在の月間売上"
            name="currentRevenue"
            value={inputs.currentRevenue}
            unit="円"
            onChange={handleChange}
          />
          <Field
            label="現在の月間仕入高"
            name="currentCost"
            value={inputs.currentCost}
            unit="円"
            onChange={handleChange}
          />
          <Field
            label="現在の月間固定費"
            name="fixedCosts"
            value={inputs.fixedCosts}
            unit="円"
            onChange={handleChange}
          />
          <Field
            label="月間の借入元本返済"
            name="loanPrincipal"
            value={inputs.loanPrincipal}
            unit="円"
            onChange={handleChange}
          />
        </div>

        <div className="mt-10 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">
              現在の月間資金不足額
            </span>
            <span className="text-2xl font-black text-amber-900 leading-none">
              {new Intl.NumberFormat('ja-JP').format(Math.max(0, currentMonthlyDeficit))}
              円
            </span>
          </div>
          <div className="text-right flex flex-col items-center sm:items-end">
            <span className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-[10px] font-black uppercase tracking-tighter mb-1">
              自動算出
            </span>
            <p className="text-[10px] text-amber-600 font-medium">
              (仕入 + 固定費 + 借入返済) - 売上
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
