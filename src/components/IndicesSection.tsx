import React, { useState } from 'react';
import { MarketCategory, MarketIndexItem } from '../types/market';
import { ChevronRight } from 'lucide-react';
import { formatCurrency, formatSignedPercent, formatSignedValue } from '../utils/chartUtils';

interface IndicesSectionProps {
  categories: MarketCategory[];
  activeCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
  indices: MarketIndexItem[];
  onSelectIndex: (item: MarketIndexItem) => void;
  darkMode: boolean;
  flashItemIds: Record<string, 'up' | 'down'>;
}

export const IndicesSection: React.FC<IndicesSectionProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  indices,
  onSelectIndex,
  darkMode,
  flashItemIds,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ id: string; x: number; price: number } | null>(null);

  const filteredIndices = indices.filter((item) => item.category === activeCategory);
  // fallback to all if empty or first 5
  const displayIndices = filteredIndices.length > 0 ? filteredIndices.slice(0, 5) : indices.slice(0, 5);

  return (
    <section className="max-w-[1440px] mx-auto px-4 lg:px-8 mt-4 mb-12" data-purpose="indices-cards-grid">
      {/* Category Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Category Title Header with arrow */}
        <button
          onClick={() => {}}
          className="group inline-flex items-center gap-1.5 text-2xl md:text-3xl font-bold tracking-tight text-left cursor-pointer focus:outline-none"
        >
          <span
            className={`transition-colors ${
              darkMode ? 'text-white group-hover:text-[#2962FF]' : 'text-[#131722] group-hover:text-[#2962FF]'
            }`}
          >
            Indices
          </span>
          <ChevronRight
            className={`w-5 h-5 transition-all group-hover:translate-x-1 ${
              darkMode ? 'text-gray-400 group-hover:text-[#2962FF]' : 'text-[#131722] group-hover:text-[#2962FF]'
            }`}
          />
        </button>

        {/* Filter Pill Tabs Bar */}
        <div
          className={`inline-flex items-center overflow-x-auto no-scrollbar rounded-full border p-1 gap-1 max-w-full ${
            darkMode ? 'bg-[#1E222D] border-[#2A2E39]' : 'bg-white border-[#E0E3EB]'
          }`}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? darkMode
                      ? 'bg-white text-[#131722] shadow-sm'
                      : 'bg-[#131722] text-white shadow-sm'
                    : darkMode
                    ? 'text-[#787B86] hover:text-white hover:bg-[#2A2E39]'
                    : 'text-[#787B86] hover:text-[#131722] hover:bg-[#F8F9FD]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Indices 5-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {displayIndices.map((item) => {
          const isPositive = item.changePercent >= 0;
          const flashClass = flashItemIds[item.id] === 'up' ? 'flash-up' : flashItemIds[item.id] === 'down' ? 'flash-down' : '';

          // SVG path generator for sparkline
          const points = item.sparkline;
          const minVal = Math.min(...points);
          const maxVal = Math.max(...points);
          const range = maxVal - minVal || 1;
          const svgWidth = 100;
          const svgHeight = 35;
          const paddingY = 4;

          const pathD = points
            .map((val, idx) => {
              const x = (idx / (points.length - 1)) * svgWidth;
              // Invert Y so higher value is towards top
              const normalized = (val - minVal) / range;
              const y = isPositive
                ? svgHeight - paddingY - normalized * (svgHeight - paddingY * 2)
                : paddingY + (1 - normalized) * (svgHeight - paddingY * 2);
              return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
            })
            .join(' ');

          return (
            <div
              key={item.id}
              onClick={() => onSelectIndex(item)}
              className={`rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between border ${flashClass} ${
                darkMode
                  ? 'bg-[#1E222D] hover:bg-[#242938] border-[#2A2E39] hover:border-[#363A45]'
                  : 'bg-[#F8F9FD] hover:bg-white border-[#E0E3EB]/80 hover:border-[#D1D4DC]'
              }`}
            >
              <div>
                {/* Header Icon + Name */}
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: item.badge.bg, color: item.badge.textColor || '#ffffff' }}
                  >
                    {item.badge.text}
                  </span>
                  <div className="min-w-0">
                    <h3
                      className={`font-bold text-base leading-tight truncate ${
                        darkMode ? 'text-white' : 'text-[#131722]'
                      }`}
                    >
                      {item.name}
                    </h3>
                    <span className="text-xs text-[#787B86] font-medium">{item.symbol}</span>
                  </div>
                </div>

                {/* Price and Percentage Pill */}
                <div className="flex items-baseline justify-between mb-1">
                  <span
                    className={`text-xl font-bold tracking-tight tabular-nums ${
                      darkMode ? 'text-white' : 'text-[#131722]'
                    }`}
                  >
                    {formatCurrency(item.price)}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded tabular-nums ${
                      isPositive
                        ? darkMode
                          ? 'text-[#089981] bg-[#089981]/15'
                          : 'text-[#089981] bg-[#E7F7F4]'
                        : darkMode
                        ? 'text-[#F23645] bg-[#F23645]/15'
                        : 'text-[#F23645] bg-[#FDF0F1]'
                    }`}
                  >
                    {formatSignedPercent(item.changePercent)}
                  </span>
                </div>

                {/* Absolute Change */}
                <span className="text-xs text-[#787B86] font-medium tabular-nums block">
                  {formatSignedValue(item.change)}
                </span>
              </div>

              {/* Sparkline Chart */}
              <div
                className="mt-3 h-10 w-full relative"
                onMouseLeave={() => setHoveredPoint(null)}
              >
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
                    strokeWidth="2.2"
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
