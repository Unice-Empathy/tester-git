import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { StockItem, MarketIndexItem, CryptoItem } from '../types/market';
import { formatCurrency, formatSignedPercent } from '../utils/chartUtils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: StockItem[];
  indices: MarketIndexItem[];
  cryptos: CryptoItem[];
  onSelectAsset: (asset: StockItem | MarketIndexItem | CryptoItem) => void;
  darkMode: boolean;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stocks,
  indices,
  cryptos,
  onSelectAsset,
  darkMode,
}) => {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'All' | 'Stocks' | 'Crypto' | 'Indices'>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Flatten searchable assets
  const allItems: {
    type: 'Stock' | 'Crypto' | 'Index';
    data: StockItem | MarketIndexItem | CryptoItem;
    symbol: string;
    name: string;
    price: number;
    change: number;
  }[] = [
    ...stocks.map((s) => ({
      type: 'Stock' as const,
      data: s,
      symbol: s.symbol,
      name: s.companyName,
      price: s.lastPrice,
      change: s.changePercent,
    })),
    ...cryptos.map((c) => ({
      type: 'Crypto' as const,
      data: c,
      symbol: c.symbol,
      name: c.name,
      price: c.price,
      change: c.changePercent,
    })),
    ...indices.map((i) => ({
      type: 'Index' as const,
      data: i,
      symbol: i.symbol,
      name: i.name,
      price: i.price,
      change: i.changePercent,
    })),
  ];

  const filtered = allItems.filter((item) => {
    if (tab === 'Stocks' && item.type !== 'Stock') return false;
    if (tab === 'Crypto' && item.type !== 'Crypto') return false;
    if (tab === 'Indices' && item.type !== 'Index') return false;

    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return item.symbol.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col transition-colors ${
          darkMode ? 'bg-[#1E222D] border-[#2A2E39] text-white' : 'bg-white border-[#E0E3EB] text-[#131722]'
        }`}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-200 dark:border-gray-800">
          <Search className="w-5 h-5 text-[#787B86] mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search symbols, companies, or crypto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-base font-medium focus:outline-none placeholder-[#787B86]"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-gray-100 dark:border-gray-800 text-xs">
          {(['All', 'Stocks', 'Crypto', 'Indices'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
                tab === t
                  ? 'bg-[#2962FF] text-white'
                  : darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
          {filtered.slice(0, 10).map((item, idx) => {
            const isPos = item.change >= 0;
            return (
              <div
                key={idx}
                onClick={() => {
                  onSelectAsset(item.data);
                  onClose();
                }}
                className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                  darkMode ? 'hover:bg-[#252A37]' : 'hover:bg-[#F8F9FD]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {item.type}
                  </span>
                  <div>
                    <div className="font-bold text-sm">{item.symbol}</div>
                    <div className="text-xs text-[#787B86] truncate max-w-xs">{item.name}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-sm tabular-nums">${formatCurrency(item.price)}</div>
                  <div
                    className={`text-xs font-semibold tabular-nums flex items-center justify-end gap-0.5 ${
                      isPos ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {formatSignedPercent(item.change)}
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-[#787B86]">
              No market assets matching &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Keyboard shortcut hint */}
        <div className="px-4 py-2 bg-gray-50 dark:bg-[#131722] text-[11px] text-[#787B86] flex justify-between border-t border-gray-100 dark:border-gray-800">
          <span>Tip: Press ESC to close</span>
          <span>TradingView Global Search</span>
        </div>
      </div>
    </div>
  );
};
