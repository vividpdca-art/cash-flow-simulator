'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  data: Array<{ month: string; 現状: number; 値上げ後: number }>;
}

export default function SimulationChart({ data }: Props) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('ja-JP', { notation: 'compact' }).format(val);

  return (
    <div className="bg-white p-4 md:p-10 rounded-3xl border border-slate-200 shadow-sm mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-slate-800 rounded-full inline-block"></span>
          資金残高の推移予測
        </h2>
        <div className="flex items-center gap-4 md:gap-6 px-3 py-2 bg-slate-50 rounded-2xl border border-slate-100 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">現状維持</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">値上げ×改善後</span>
          </div>
        </div>
      </div>
      
      <div className="h-[300px] md:h-[450px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              stroke="#64748b"
              fontSize={10}
              fontWeight={700}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={10}
              fontWeight={700}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
              width={45}
            />
            <Tooltip 
              formatter={(value: number | string | readonly (number | string)[] | undefined) => {
                if (typeof value === 'number') {
                  return [new Intl.NumberFormat('ja-JP').format(value) + '円', ''];
                }
                if (typeof value === 'string') {
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue)) {
                    return [new Intl.NumberFormat('ja-JP').format(numValue) + '円', ''];
                  }
                  return [value, ''];
                }
                return ['-', ''];
              }}
              contentStyle={{ 
                borderRadius: '16px', 
                border: '1px solid #e2e8f0', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                padding: '12px 16px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
            />
            <Line
              name="現状"
              type="monotone"
              dataKey="現状"
              stroke="#cbd5e1"
              strokeWidth={3}
              dot={{ r: 0 }}
              activeDot={{ r: 6, fill: '#94a3b8', stroke: '#fff', strokeWidth: 2 }}
              strokeDasharray="5 5"
            />
            <Line
              name="値上げ後"
              type="monotone"
              dataKey="値上げ後"
              stroke="#2563eb"
              strokeWidth={5}
              dot={{ r: 0 }}
              activeDot={{ r: 8, fill: '#2563eb', stroke: '#fff', strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-600 leading-relaxed transition-all hover:bg-slate-100">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
             <span className="font-black text-slate-800 uppercase tracking-widest">現状維持のシナリオ</span>
          </div>
          現在の収支状況が継続した場合のシミュレーションです。資金ショート（残高0）に向かう時期を可視化しています。
        </div>
        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 text-sm text-blue-700 leading-relaxed transition-all hover:bg-blue-100">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
             <span className="font-black text-blue-900 uppercase tracking-widest text-blue-800">値上げ改善後のシナリオ</span>
          </div>
          価格改定と販促への再投資による収支改善後の予測です。資金の減少が抑制され、延命効果が生じている様子を示します。
        </div>
      </div>
    </div>
  );
}
