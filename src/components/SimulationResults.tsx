import React from 'react';
import { SimulationResults } from '@/lib/calculations';
import { TrendingUp, Wallet, ShieldCheck, Calendar, Clock, ArrowUpRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  results: SimulationResults;
}

export default function SimulationResultsView({ results }: Props) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(val);
  
  const formatMonths = (val: number | 'no_short') => 
    val === 'no_short' ? '資金ショート回避' : `${val.toFixed(1)}ヶ月`;

  const isHighRisk = results.currentRunway !== 'no_short' && results.currentRunway <= 12;

  interface MetricCardProps {
    title: string;
    value: number | string;
    unit?: string;
    color?: string;
    icon?: React.ElementType;
  }

  const MetricCard = ({ title, value, unit = '', color = 'blue', icon: Icon }: MetricCardProps) => {
    const colorClasses: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-600',
      rose: 'bg-rose-50 text-rose-600',
      emerald: 'bg-emerald-50 text-emerald-600',
      amber: 'bg-amber-50 text-amber-600',
    };
    const iconColorClass = colorClasses[color] || colorClasses.blue;

    return (
      <div className={`p-6 rounded-2xl border bg-white shadow-sm flex flex-col justify-between transition-all hover:shadow-md border-slate-200`}>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-2 rounded-lg ${iconColorClass}`}>
              {Icon && <Icon className="w-5 h-5" />}
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-tight">{title}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {typeof value === 'number' ? formatCurrency(value).replace('￥', '') : value}
            </span>
            <span className="text-sm text-slate-500 font-bold">{unit}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-10 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black flex items-center gap-3 text-slate-800">
          <TrendingUp className="text-blue-600 w-7 h-7" />
          シミュレーション結果サマリー
        </h2>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100">
          <Clock className="w-4 h-4" />
          リアルタイム算出中
        </div>
      </div>
      
      {/* 資金繰り比較セクション（現状 vs 改善後） */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          
          {/* 現状のリスク */}
          <div className={`p-8 ${isHighRisk ? 'bg-amber-50/50' : 'bg-slate-50/30'}`}>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className={`w-5 h-5 ${isHighRisk ? 'text-amber-600' : 'text-slate-400'}`} />
              <span className="text-sm font-black text-slate-500 uppercase tracking-widest">現状維持のリスク</span>
            </div>
            <div className="mb-4">
              <span className={`text-4xl font-black ${isHighRisk ? 'text-amber-700' : 'text-slate-600'}`}>
                {formatMonths(results.currentRunway)}
              </span>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                {results.currentRunway === 'no_short' 
                  ? "現在の収支で資金ショートの心配はありません。" 
                  : `何もしない場合、このまま約${results.currentRunway.toFixed(1)}ヶ月で資金が尽きる見込みです。`}
              </p>
            </div>
            {isHighRisk && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-[10px] font-black uppercase tracking-tight border border-amber-200">
                早期の対策が必要です
              </div>
            )}
          </div>

          {/* 改善後の効果 */}
          <div className="p-8 bg-blue-600 text-white relative overflow-hidden">
            {/* 装飾用背景 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-blue-200" />
                <span className="text-sm font-black text-blue-100 uppercase tracking-widest">値上げ・改善後</span>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-black text-white">
                  {results.improvedRunway === 'no_short' ? '資金ショート回避' : formatMonths(results.improvedRunway)}
                </span>
                <p className="mt-2 text-sm text-blue-100 leading-relaxed">
                  {results.improvedRunway === 'no_short'
                    ? "今回の施策により、当面の資金ショートは完全に回避できる予測です。"
                    : `対策実施後は、約${results.improvedRunway.toFixed(1)}ヶ月まで資金が持つ見込みです。`}
                </p>
              </div>
            </div>
          </div>

          {/* 延命効果のまとめ */}
          <div className="p-8 bg-white flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-black text-slate-500 uppercase tracking-widest">対策による延命効果</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-emerald-600 tracking-tighter">
                {results.extensionMonths === 'avoided' ? (
                  "ショート回避"
                ) : (
                  <>+{results.extensionMonths.toFixed(1)}<span className="text-2xl ml-1 text-slate-400">ヶ月</span></>
                )}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500 font-medium">
              キャッシュフローの改善により、<br />
              <span className="text-slate-800 font-bold">経営の立て直しに必要な「時間」</span>を確保できます。
            </p>
          </div>
        </div>
      </div>
      
      {/* 財務指標の改善内訳 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="年間増収額" value={results.annualRevenueIncrease} unit="円" icon={ArrowUpRight} color="blue" />
        <MetricCard title="販促費" value={results.promotionCost} unit="円" icon={Wallet} color="rose" />
        <MetricCard title="年間実質改善額" value={results.annualNetImprovement} unit="円" icon={ShieldCheck} color="emerald" />
        <MetricCard title="月間改善額" value={results.monthlyImprovement} unit="円" icon={TrendingUp} color="emerald" />
      </div>
    </div>
  );
}
