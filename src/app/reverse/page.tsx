'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import {
  calculateReverse,
  ReverseCalculationInputs,
} from '@/lib/reverseCalculations';
import { Calculator, TrendingUp, Scale } from 'lucide-react';

type ReverseFormInputs = {
  [K in keyof ReverseCalculationInputs]: string;
};

const defaultInputs: ReverseFormInputs = {
  monthlyRevenue: '5000000',
  grossMarginPercent: '40',
  fixedCosts: '2000000',
  loanPrincipal: '300000',
  avgUnitPrice: '5000',
  hybridRatio: '50',
};

function formatYen(n: number) {
  return `${new Intl.NumberFormat('ja-JP', { maximumFractionDigits: 0 }).format(Math.round(n))}円`;
}

function formatNum(n: number, fractionDigits = 1) {
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('ja-JP', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  }).format(n);
}

const Field = ({
  label,
  name,
  value,
  unit,
  hint,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  unit: string;
  hint?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex min-w-0 flex-col space-y-2">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <div className="relative min-w-0">
        <input
          type="text"
          inputMode="numeric"
          name={name}
          value={value}
          onChange={onChange}
          placeholder="0"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-12 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 md:text-sm"
        />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-600">
        {unit}
      </span>
    </div>
    {hint ? <p className="text-[11px] text-slate-500 font-medium">{hint}</p> : null}
  </div>
);

const SliderField = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex flex-col space-y-3">
    <div className="flex justify-between items-center">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <div className="flex gap-2 text-[10px] font-black uppercase tracking-tight">
        <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
          値上げ {100 - Number(value)}%
        </span>
        <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
          数量増 {value}%
        </span>
      </div>
    </div>
    <input
      type="range"
      name={name}
      value={value}
      onChange={onChange}
      min="0"
      max="100"
      step="1"
      className="w-full h-2 bg-slate-200 rounded-xl appearance-none cursor-pointer accent-blue-600 transition-all hover:bg-slate-300"
    />
    <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1">
      <span>値上げ 100%</span>
      <span>中央 (50/50)</span>
      <span>数量増 100%</span>
    </div>
  </div>
);

export default function ReversePage() {
  const [inputs, setInputs] = useState<ReverseFormInputs>(defaultInputs);

  const numericInputs = useMemo<ReverseCalculationInputs>(
    () => ({
      monthlyRevenue: Number(inputs.monthlyRevenue || 0),
      grossMarginPercent: Number(inputs.grossMarginPercent || 0),
      fixedCosts: Number(inputs.fixedCosts || 0),
      loanPrincipal: Number(inputs.loanPrincipal || 0),
      avgUnitPrice: Number(inputs.avgUnitPrice || 0),
      hybridRatio: Number(inputs.hybridRatio || 50),
    }),
    [inputs]
  );

  const outcome = useMemo(() => calculateReverse(numericInputs), [numericInputs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const Metric = ({
    label,
    value,
    emphasize,
  }: {
    label: string;
    value: string;
    emphasize?: boolean;
  }) => (
    <div
      className={`rounded-2xl border p-4 ${
        emphasize
          ? 'border-blue-200 bg-blue-50/80'
          : 'border-slate-100 bg-slate-50/80'
      }`}
    >
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p
        className={`text-lg font-black tracking-tight ${
          emphasize ? 'text-blue-900' : 'text-slate-900'
        }`}
      >
        {value}
      </p>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Header />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 text-center">
          <p className="text-slate-600 text-sm font-medium max-w-4xl mx-auto">
            月次の固定費と元本返済を粗利で賄うために、必要な売上・数量・値上げを整理します。
            <Link
              href="/"
              className="mx-1 text-blue-700 font-bold underline decoration-blue-200 underline-offset-2 hover:text-blue-900"
            >
              値上げ×資金繰りシミュレーター
            </Link>
            とは独立した簡易モデルです。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10 mb-10">
          <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
            <div className="flex items-center gap-3 mb-6 md:mb-8 border-b border-slate-50 pb-4">
              <div className="w-1.5 h-7 bg-blue-600 rounded-full" />
              <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                入力（月次）
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="月間売上"
                name="monthlyRevenue"
                value={inputs.monthlyRevenue}
                unit="円"
                onChange={handleChange}
              />
              <Field
                label="粗利率"
                name="grossMarginPercent"
                value={inputs.grossMarginPercent}
                unit="%"
                hint="売上に対する粗利の割合（シミュレーターの粗利率と同じ考え方）"
                onChange={handleChange}
              />
              <Field
                label="月間固定費"
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
              <div className="min-w-0 md:col-span-2">
                <Field
                  label="平均単価（1単位）"
                  name="avgUnitPrice"
                  value={inputs.avgUnitPrice}
                  unit="円"
                  hint="顧客1人あたり・1注文あたりなど、事業に合う単位で統一してください"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
            <div className="flex items-center gap-3 mb-6 md:mb-8 border-b border-slate-50 pb-4">
              <div className="w-1.5 h-7 bg-indigo-600 rounded-full" />
              <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                計算結果
              </h2>
            </div>

            {!outcome.ok ? (
              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 text-amber-900 font-bold text-sm">
                {outcome.error}
              </div>
            ) : (
              <div className="space-y-6">
                {outcome.data.grossProfitShortfall === 0 ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-900 text-sm font-bold">
                    返済分岐点粗利をすでに満たしています。不足粗利は 0 です。
                  </div>
                ) : null}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Metric
                    label="現在粗利額（月次）"
                    value={formatYen(outcome.data.currentGrossProfit)}
                  />
                  <Metric
                    label="返済分岐点粗利益額"
                    value={formatYen(outcome.data.breakEvenGrossProfit)}
                    emphasize
                  />
                  <Metric
                    label="不足粗利（月次）"
                    value={formatYen(outcome.data.grossProfitShortfall)}
                    emphasize
                  />
                  <Metric
                    label="返済分岐点売上高（月次）"
                    value={formatYen(outcome.data.breakEvenRevenue)}
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 font-medium leading-relaxed">
                  現状数量（参考）:{' '}
                  <span className="font-black text-slate-900">
                    {formatNum(outcome.data.quantity, 2)} 単位
                  </span>
                  <span className="text-slate-400 mx-2">|</span>
                  返済分岐点粗利益額: 固定費 {formatYen(numericInputs.fixedCosts)} ＋ 元本返済{' '}
                  {formatYen(numericInputs.loanPrincipal)}
                </div>
              </div>
            )}
          </div>
        </div>

        {outcome.ok ? (
          <div className="bg-white p-5 md:p-10 rounded-3xl border border-blue-100 shadow-sm mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="w-6 h-6 text-blue-700" />
              <h3 className="text-xl font-black text-blue-900 tracking-tight">
                不足粗利を埋める代表シナリオ（A / B / C）
              </h3>
            </div>
            <p className="text-sm text-slate-600 font-medium mb-8 max-w-3xl">
              増分の粗利を「増分売上 × 粗利率」で見積もっています。C
              は不足粗利を数量増と値上げで分担するイメージです。
            </p>

            <div className="mb-10 max-w-md mx-auto lg:mx-0 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <SliderField
                label="ハイブリッド案の比率調整"
                name="hybridRatio"
                value={inputs.hybridRatio}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50/50">
                <span className="text-xs font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  A
                </span>
                <h4 className="mt-3 text-lg font-black text-slate-900">数量増</h4>
                <p className="text-xs text-slate-500 font-bold mt-1 mb-4">
                  単価は据え置き
                </p>
                <p className="text-2xl font-black text-blue-800">
                  ＋{formatNum(outcome.data.optionA_quantityIncrease, 2)}
                  <span className="text-sm font-bold text-slate-600 ml-1">単位</span>
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50/50">
                <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                  B
                </span>
                <h4 className="mt-3 text-lg font-black text-slate-900">値上げ</h4>
                <p className="text-xs text-slate-500 font-bold mt-1 mb-4">
                  数量は据え置き（1単位あたり）
                </p>
                <p className="text-2xl font-black text-indigo-800">
                  ＋{formatYen(outcome.data.optionB_priceIncrease)}
                </p>
                <p className="text-[11px] text-indigo-600 font-bold mt-2">
                  必要値上げ率 ＋{formatNum(outcome.data.optionB_priceIncreaseRate * 100, 1)}%
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg">
                <span className="text-xs font-black text-blue-100 bg-white/15 px-2 py-0.5 rounded">
                  C
                </span>
                <h4 className="mt-3 text-lg font-black">ハイブリッド</h4>
                <p className="text-xs text-blue-100 font-bold mt-1 mb-2">
                  不足粗利の分担: 数量増 {outcome.data.optionC_hybrid.quantityPercent}% / 値上げ {outcome.data.optionC_hybrid.pricePercent}%
                </p>
                <p className="text-[10px] text-blue-100/80 font-medium mb-4 leading-relaxed">
                  数量増と値上げを少しずつ分担する、現実的な折衷案です。
                </p>
                <div className="space-y-3 text-sm font-bold text-blue-50">
                  <p>
                    数量{' '}
                    <span className="text-white text-xl font-black">
                      ＋{formatNum(outcome.data.optionC_hybrid.quantityIncrease, 2)}
                    </span>{' '}
                    単位
                  </p>
                  <p>
                    値上げ{' '}
                    <span className="text-white text-xl font-black">
                      ＋{formatYen(outcome.data.optionC_hybrid.priceIncreasePerUnit)}
                    </span>{' '}
                    / 単位
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="text-center text-slate-600 text-sm font-bold italic pb-6">
          ※本ツールは教育・概算用です。実際の経営判断は専門家への相談をご検討ください。
        </div>
      </div>
    </main>
  );
}
