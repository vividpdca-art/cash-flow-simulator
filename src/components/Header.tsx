'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/', label: 'シミュレーター' },
  { href: '/reverse', label: '値上げ必要額逆算' },
] as const;

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b py-6 mb-8">
      <div className="container mx-auto px-4 text-center max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          値上げ×資金繰りシミュレーター
        </h1>
        <p className="text-slate-600 mb-6">
          値上げ・販促・資金ショートの関係を3分で見える化
        </p>
        <nav
          className="flex flex-wrap justify-center gap-2 sm:gap-3"
          aria-label="メインナビゲーション"
        >
          {nav.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors border ${
                  active
                    ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-900'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
