import React, { useState } from 'react';
import { CryptoItem } from '../types/market';
import { ChevronRight } from 'lucide-react';
import { formatCurrency, formatSignedPercent } from '../utils/chartUtils';

interface CryptoSpotlightSectionProps {
  cryptos: CryptoItem[];
  onSelectCrypto: (crypto: CryptoItem) => void;
  darkMode: boolean;
  flashItemIds: Record<string, 'up' | 'down'>;
}

export const CryptoSpotlightSection: React.FC<CryptoSpotlightSectionProps> = ({
  cryptos,
  onSelectCrypto,
  darkMode,
  flashItemIds,
}) => {
  const [showExtended, setShowExtended] = useState(false);

  const displayedCryptos = showExtended ? cryptos : cryptos.slice(0, 3);

  return (
    <section className="max-w-[1440px] mx-auto px-4 lg:px-8 mt-14" data-purpose="crypto-market-spotlight">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors ${
              darkMode ? 'text-white' : 'text-[#131722]'
            }`}
          >
            Crypto Spotlight
          </h2>
          <p className="text-sm text-[#787B86] mt-1">Real-time cryptocurrency valuation and 24h trends</p>
        </div>

        <button
          onClick={() => setShowExtended(!showExtended)}
          className="text-sm font-semibold text-[#2962FF] hover:text-[#1E53E5] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>{showExtended ? 'Show spotlight top 3' : 'Explore all crypto'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Crypto Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {displayedCryptos.map((crypto) => {
          const isPositive = crypto.changePercent >= 0;
          const flashClass = flashItemIds[crypto.id] === 'up' ? 'flash-up' : flashItemIds[crypto.id] === 'down' ? 'flash-down' : '';

          // Generate sparkline path
          const points = crypto.sparkline;
          const minVal = Math.min(...points);
          const maxVal = Math.max(...points);
          const range = maxVal - minVal || 1;
          const svgWidth = 120;
          const svgHeight = 40;
          const paddingY = 4;

          const pathD = points
            .map((val, idx) => {
              const x = (idx / (points.length - 1)) * svgWidth;
              const normalized = (val - minVal) / range;
              const y = isPositive
                ? svgHeight - paddingY - normalized * (svgHeight - paddingY * 2)
                : paddingY + (1 - normalized) * (svgHeight - paddingY * 2);
              return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
            })
            .join(' ');

          return (
            <div
              key={crypto.id}
              onClick={() => onSelectCrypto(crypto)}
              className={`rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border ${flashClass} ${
                darkMode
                  ? 'bg-[#1E222D] hover:bg-[#252A37] border-[#2A2E39] hover:border-[#363A45]'
                  : 'bg-white hover:bg-[#FAFAFA] border-[#E0E3EB]'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0"
                    style={{
                      background: crypto.badgeBg,
                      color: crypto.badgeTextColor || '#FFFFFF',
                    }}
                  >
                    {crypto.badgeIcon}
                  </span>
                  <div>
                    <h4
                      className={`font-bold text-lg leading-tight transition-colors ${
                        darkMode ? 'text-white' : 'text-[#131722]'
                      }`}
                    >
                      {crypto.name}
                    </h4>
                    <span className="text-xs font-semibold text-[#787B86]">{crypto.symbol}</span>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md tabular-nums ${
                    isPositive
                      ? darkMode
                        ? 'text-[#089981] bg-[#089981]/15'
                        : 'text-[#089981] bg-[#E7F7F4]'
                      : darkMode
                      ? 'text-[#F23645] bg-[#F23645]/15'
                      : 'text-[#F23645] bg-[#FDF0F1]'
                  }`}
                >
                  {formatSignedPercent(crypto.changePercent)}
                </span>
              </div>

              {/* Price */}
              <div
                className={`text-2xl font-black tracking-tight mb-3 tabular-nums ${
                  darkMode ? 'text-white' : 'text-[#131722]'
                }`}
              >
                ${formatCurrency(crypto.price)}
              </div>

              {/* SVG Sparkline */}
              <div className="h-12 w-full">
                <svg
                  className={`w-full h-full overflow-visible transition-colors ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                  preserveAspectRatio="none"
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                >
                  <path
                    d={pathD}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
