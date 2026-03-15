import React from 'react';

export default function Header() {
  return (
    <header className="bg-white border-b py-6 mb-8">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          値上げ×資金繰りシミュレーター
        </h1>
        <p className="text-slate-600">
          値上げ・販促・資金ショートの関係を3分で見える化
        </p>
      </div>
    </header>
  );
}
