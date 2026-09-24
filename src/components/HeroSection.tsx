import React, { useState } from 'react';
import { ChevronDown, Check, Globe2, Activity } from 'lucide-react';

interface HeroSectionProps {
  darkMode: boolean;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  isSimulating: boolean;
  onToggleSimulating: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  darkMode,
  selectedRegion,
  onSelectRegion,
  isSimulating,
  onToggleSimulating,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const regions = [
    { id: 'everywhere', title: 'everywhere', description: 'Global multi-asset overview' },
    { id: 'us', title: 'in the US', description: 'NYSE, NASDAQ, AMEX Equities' },
    { id: 'europe', title: 'in Europe', description: 'FTSE, DAX, CAC, Euronext' },
    { id: 'asia', title: 'in Asia-Pacific', description: 'Nikkei, Hang Seng, Shanghai, ASX' },
    { id: 'crypto', title: 'in Crypto', description: '24/7 Decentralized digital assets' },
  ];

  const currentRegion = regions.find((r) => r.id === selectedRegion) || regions[0];

  return (
    <section className="pt-10 pb-6 px-4 text-center relative" data-purpose="hero-title">
      <div className="relative inline-block">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="inline-flex items-center justify-center cursor-pointer group focus:outline-none"
        >
          <h1
            className={`text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight flex items-center gap-2 transition-colors ${
              darkMode ? 'text-white' : 'text-[#131722]'
            }`}
          >
            <span>Markets, {currentRegion.title}</span>
            <ChevronDown
              className={`w-6 h-6 md:w-8 md:h-8 mt-1 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-[#2962FF]' : 'text-current group-hover:translate-y-0.5'
              }`}
            />
          </h1>
        </button>

        {dropdownOpen && (
          <div
            className={`absolute left-1/2 -translate-x-1/2 mt-3 w-72 md:w-80 rounded-2xl shadow-2xl border p-2 z-30 text-left backdrop-blur animate-in fade-in-50 zoom-in-95 duration-150 ${
              darkMode ? 'bg-[#1E222D]/95 border-[#2A2E39]' : 'bg-white/95 border-[#E0E3EB]'
            }`}
          >
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#787B86]">
              Select Market Focus
            </div>
            {regions.map((region) => {
              const isSelected = selectedRegion === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => {
                    onSelectRegion(region.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-start justify-between p-2.5 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-[#2962FF]/10 text-[#2962FF]'
                      : darkMode
                      ? 'hover:bg-[#2A2E39] text-gray-200'
                      : 'hover:bg-gray-100 text-[#131722]'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">Markets, {region.title}</div>
                    <div className="text-xs text-[#787B86] mt-0.5">{region.description}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#2962FF] mt-1 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Live Market Pulse status bar */}
      <div className="mt-3 flex items-center justify-center gap-3 text-xs font-semibold">
        <button
          onClick={onToggleSimulating}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors cursor-pointer ${
            isSimulating
              ? darkMode
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : darkMode
              ? 'bg-gray-800 text-gray-400 border-gray-700'
              : 'bg-gray-100 text-gray-600 border-gray-200'
          }`}
          title="Click to toggle real-time price updates"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isSimulating ? 'bg-[#089981] animate-pulse' : 'bg-gray-400'
            }`}
          />
          <span>{isSimulating ? 'Live Market Feed Active' : 'Live Feed Paused'}</span>
        </button>

        <span className="text-[#787B86] hidden sm:inline">·</span>
        <span className="text-[#787B86] hidden sm:inline">
          US Equities Session: 09:30 - 16:00 EST
        </span>
      </div>
    </section>
  );
};
