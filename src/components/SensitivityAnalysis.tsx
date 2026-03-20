import React from 'react';
import { SimulationInputs, calculateSimulation, SimulationResults } from '@/lib/calculations';
import { Layers, TrendingUp } from 'lucide-react';

interface Props {
  inputs: SimulationInputs;
}

export default function SensitivityAnalysis({ inputs }: Props) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('ja-JP').format(Math.round(val));
  
  const formatMonths = (val: number | 'no_short') => 
    val === 'no_short' ? '資金ショート回避' : `${val.toFixed(1)}ヶ月`;

  // 現在の入力値をベースに動的に比較ポイントを生成
  // 離脱率: 現在値 ±5% (0-100の範囲に制限)
  const churnRates = [
    Math.max(0, inputs.churnRate - 5),
    inputs.churnRate,
    Math.min(100, inputs.churnRate + 5)
  ].filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b);

  // 値上げ額: 現在値 ±50%
  const priceIncreases = [
    Math.round(inputs.priceIncrease * 0.5),
    inputs.priceIncrease,
    Math.round(inputs.priceIncrease * 1.5)
  ].filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b);

  const ComparisonTable = ({ title, resultsList, labels, currentVal }: { title: string, resultsList: SimulationResults[], labels: number[], currentVal: number }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
        <Layers className="w-5 h-5 text-blue-600" />
        {title}
      </h3>
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-4 font-black text-slate-600 uppercase tracking-widest text-[10px]">設定値</th>
              <th className="pb-4 font-black text-slate-600 uppercase tracking-widest text-[10px]">年間実質改善額</th>
              <th className="pb-4 font-black text-slate-600 uppercase tracking-widest text-[10px]">月間改善額</th>
              <th className="pb-4 font-black text-slate-600 uppercase tracking-widest text-[10px]">改善後持ち月数</th>
              <th className="pb-4 font-black text-slate-600 uppercase tracking-widest text-[10px]">延命効果</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {resultsList.map((res, idx) => {
              const isCurrent = labels[idx] === currentVal;
              return (
                <tr key={idx} className={`${isCurrent ? 'bg-blue-50/50' : ''} transition-colors`}>
                  <td className="py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {labels[idx]}{title.includes('離脱率') ? '%' : '円'}
                      {isCurrent && <span className="ml-1 text-[10px] opacity-80">(現在)</span>}
                    </span>
                  </td>
                  <td className="py-4 font-bold text-slate-800">{formatCurrency(res.annualNetImprovement)}円</td>
                  <td className="py-4 font-bold text-slate-800">{formatCurrency(res.monthlyImprovement)}円</td>
                  <td className="py-4 font-bold text-blue-800">{formatMonths(res.improvedRunway)}</td>
                  <td className="py-4">
                    <span className={`font-black ${res.extensionMonths === 'avoided' ? 'text-emerald-700' : 'text-blue-700'}`}>
                      {res.extensionMonths === 'avoided' ? 'ショート回避' : `+${res.extensionMonths.toFixed(1)}ヶ月`}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4">
        {resultsList.map((res, idx) => {
          const isCurrent = labels[idx] === currentVal;
          return (
            <div key={idx} className={`p-4 rounded-2xl border ${isCurrent ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex justify-between items-center mb-3">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${isCurrent ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border'}`}>
                  {labels[idx]}{title.includes('離脱率') ? '%' : '円'}
                  {isCurrent && <span className="ml-1 text-[10px] opacity-80">(現在値)</span>}
                </span>
                <span className={`text-sm font-black ${res.extensionMonths === 'avoided' ? 'text-emerald-700' : 'text-blue-700'}`}>
                  {res.extensionMonths === 'avoided' ? 'ショート回避' : `+${res.extensionMonths.toFixed(1)}ヶ月`}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                <span className="text-slate-500 font-bold">年間実質改善:</span>
                <span className="text-slate-800 font-black text-right">{formatCurrency(res.annualNetImprovement)}円</span>
                <span className="text-slate-500 font-bold">月間改善額:</span>
                <span className="text-slate-800 font-black text-right">{formatCurrency(res.monthlyImprovement)}円</span>
                <span className="text-slate-500 font-bold">改善後持ち月数:</span>
                <span className="text-blue-800 font-black text-right">{formatMonths(res.improvedRunway)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const churnResults = churnRates.map(rate => 
    calculateSimulation({ ...inputs, churnRate: rate })
  );

  const priceResults = priceIncreases.map(price => 
    calculateSimulation({ ...inputs, priceIncrease: price })
  );

  return (
    <div className="mt-12 mb-12 space-y-8">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-6 h-6 text-slate-800" />
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">感度分析（シミュレーション比較）</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <ComparisonTable 
          title="離脱率の変化による影響" 
          resultsList={churnResults} 
          labels={churnRates}
          currentVal={inputs.churnRate}
        />
        
        <ComparisonTable 
          title="値上げ額の変化による影響" 
          resultsList={priceResults} 
          labels={priceIncreases}
          currentVal={inputs.priceIncrease}
        />
      </div>
      
      <p className="text-xs text-slate-600 font-bold italic">
        ※他の設定値は現在の入力フォームの値を使用しています。離脱率は ±5%、値上げ額は ±50% の範囲で比較しています。現在の設定値と一致する行はハイライトされています。
      </p>
    </div>
  );
}
