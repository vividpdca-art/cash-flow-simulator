'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SimulationForm from '@/components/SimulationForm';
import SimulationResultsView from '@/components/SimulationResults';
import SimulationChart from '@/components/SimulationChart';
import SensitivityAnalysis from '@/components/SensitivityAnalysis';
import Footer from '@/components/Footer';
import { calculateSimulation, generateChartData, SimulationInputs, SimulationResults } from '@/lib/calculations';

export default function Home() {
  const [inputs, setInputs] = useState<SimulationInputs>({
    priceIncrease: 500,
    customerCount: 300,
    churnRate: 10,
    annualVisits: 10,
    promotionRate: 10,
    cashBalance: 3000000,
    currentRevenue: 5000000,
    currentCost: 3000000,
    fixedCosts: 2000000,
    loanPrincipal: 300000,
  });

  const [results, setResults] = useState<SimulationResults>(calculateSimulation(inputs));
  const [chartData, setChartData] = useState<Array<{ month: string; 現状: number; 値上げ後: number }>>(generateChartData(inputs, results));

  useEffect(() => {
    const newResults = calculateSimulation(inputs);
    setResults(newResults);
    setChartData(generateChartData(inputs, newResults));
  }, [inputs]);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <div className="container mx-auto px-4 max-w-7xl">
        <SimulationForm 
          inputs={inputs} 
          onChange={setInputs} 
        />
        
        <SimulationResultsView 
          results={results} 
        />
        
        <SensitivityAnalysis 
          inputs={inputs} 
        />
        
        <SimulationChart 
          data={chartData} 
        />
        
        <Footer 
          results={results} 
        />
        
        <div className="mt-12 text-center text-slate-600 text-sm font-bold italic pb-10">
          ※本シミュレーターはあくまで概算であり、実際の経営判断にあたっては専門家にご相談ください。
        </div>
      </div>
    </main>
  );
}
