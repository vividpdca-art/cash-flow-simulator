import React from 'react';
import { SimulationResults } from '@/lib/calculations';
import { Info, ShieldCheck, Clock } from 'lucide-react';

interface Props {
  results: SimulationResults;
}

export default function Footer({ results }: Props) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('ja-JP').format(Math.round(val));

  return (
    <div className="bg-white p-10 rounded-3xl border border-blue-100 shadow-sm mb-12 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 z-0"></div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-3">
          <Info className="w-6 h-6 text-blue-600" />
          経営改善のアドバイス
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ul className="space-y-5">
            <li className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black mt-1">1</div>
              <p className="text-slate-700 leading-relaxed font-medium">
                今回の価格改定により、年間で <span className="font-black text-blue-700 text-xl border-b-2 border-blue-200 px-1">{formatCurrency(results.annualRevenueIncrease)}円</span> のキャッシュフロー改善が期待できます。これは月換算で約 <span className="font-bold text-slate-800">{formatCurrency(results.monthlyImprovement)}円</span> のインパクトです。
              </p>
            </li>
            <li className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black mt-1">2</div>
              <p className="text-slate-700 leading-relaxed font-medium">
                増収分のうち <span className="font-black text-blue-700 text-xl border-b-2 border-blue-200 px-1">{formatCurrency(results.promotionCost)}円</span> を戦略的に販促や顧客維持に再投資することで、値上げに伴う離脱リスクを最小限に抑える設計となっています。
              </p>
            </li>
          </ul>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg">
            {results.improvedRunway === 'no_short' ? (
              <div className="flex flex-col h-full justify-center">
                 <div className="flex items-center gap-3 mb-4">
                   <ShieldCheck className="w-8 h-8 text-blue-200" />
                   <span className="text-lg font-black tracking-tight">資金繰りの健全化予測</span>
                 </div>
                 <p className="text-blue-50 leading-relaxed font-bold text-lg">
                   シミュレーションの結果、この改善により1年以内の資金ショートを完全に回避できる見込みです。安定した経営基盤を築くための第一歩となります。
                 </p>
              </div>
            ) : (
              <div className="flex flex-col h-full justify-center">
                 <div className="flex items-center gap-3 mb-4">
                   <Clock className="w-8 h-8 text-blue-200" />
                   <span className="text-lg font-black tracking-tight">資金ショートの延命予測</span>
                 </div>
                 <p className="text-blue-50 leading-relaxed font-bold text-lg">
                   現在の予測では、資金ショートの時期を約 <span className="text-3xl font-black text-white px-1 underline decoration-blue-300 decoration-4 underline-offset-4">{results.extensionMonths === 'avoided' ? '回避' : results.extensionMonths.toFixed(1)}ヶ月</span> 先送りできる見込みです。この「稼いだ時間」を使って、さらなる収支改善や資金調達を検討しましょう。
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
