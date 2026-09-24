import React from 'react';
import { X, Trash2, ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';
import { StockItem, CryptoItem } from '../types/market';
import { formatCurrency, formatSignedPercent } from '../utils/chartUtils';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: string[];
  onRemoveFromWatchlist: (symbol: string) => void;
  stocks: StockItem[];
  cryptos: CryptoItem[];
  onSelectAsset: (asset: StockItem | CryptoItem) => void;
  darkMode: boolean;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlist,
  onRemoveFromWatchlist,
  stocks,
  cryptos,
  onSelectAsset,
  darkMode,
}) => {
  if (!isOpen) return null;

  // Find all watched items
  const watchedItems = watchlist.map((symbol) => {
    const stock = stocks.find((s) => s.symbol === symbol);
    if (stock) return { type: 'stock' as const, data: stock };
    const crypto = cryptos.find((c) => c.symbol === symbol || c.rawSymbol === symbol);
    if (crypto) return { type: 'crypto' as const, data: crypto };
    return null;
  }).filter(Boolean) as ({ type: 'stock'; data: StockItem } | { type: 'crypto'; data: CryptoItem })[];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div
        className={`w-full max-w-md h-full shadow-2xl flex flex-col transition-colors animate-in slide-in-from-right duration-200 border-l ${
          darkMode ? 'bg-[#1E222D] border-[#2A2E39] text-white' : 'bg-white border-[#E0E3EB] text-[#131722]'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="font-bold text-lg">My Watchlist</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2962FF] font-bold">
              {watchedItems.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
          {watchedItems.map(({ type, data }) => {
            const symbol = data.symbol;
            const name = 'companyName' in data ? data.companyName : data.name;
            const price = 'lastPrice' in data ? data.lastPrice : data.price;
            const change = data.changePercent;
            const isPos = change >= 0;

            return (
              <div
                key={symbol}
                onClick={() => {
                  onSelectAsset(data);
                  onClose();
                }}
                className={`p-4 flex items-center justify-between cursor-pointer transition-colors group ${
                  darkMode ? 'hover:bg-[#252A37]' : 'hover:bg-[#F8F9FD]'
                }`}
              >
                <div>
                  <div className="font-bold text-sm flex items-center gap-2">
                    <span>{symbol}</span>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase">
                      {type}
                    </span>
                  </div>
                  <div className="text-xs text-[#787B86] truncate max-w-[180px]">{name}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold text-sm tabular-nums">${formatCurrency(price)}</div>
                    <div
                      className={`text-xs font-semibold tabular-nums flex items-center justify-end ${
                        isPos ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {formatSignedPercent(change)}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromWatchlist(symbol);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 opacity-60 group-hover:opacity-100 transition-opacity"
                    title="Remove from watchlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {watchedItems.length === 0 && (
            <div className="py-20 text-center px-6">
              <Star className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <div className="font-bold text-base">Your Watchlist is Empty</div>
              <p className="text-xs text-[#787B86] mt-1 max-w-xs mx-auto">
                Click the star icon next to any stock or cryptocurrency to track real-time price updates here.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#131722] text-xs flex justify-between items-center">
          <span className="text-[#787B86]">Real-time live prices active</span>
          <button
            onClick={onClose}
            className="font-semibold text-[#2962FF] hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
