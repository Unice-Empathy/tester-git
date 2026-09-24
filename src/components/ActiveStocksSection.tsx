import React, { useState, useMemo } from 'react';
import { StockItem } from '../types/market';
import { Search, ArrowUpDown, Star, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { formatCurrency, formatSignedPercent } from '../utils/chartUtils';

interface ActiveStocksSectionProps {
  stocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  darkMode: boolean;
  flashItemIds: Record<string, 'up' | 'down'>;
}

type SortField = 'symbol' | 'companyName' | 'lastPrice' | 'changePercent' | 'rawVolume' | 'rawMarketCap';
type FilterTab = 'all' | 'gainers' | 'losers' | 'mega';

export const ActiveStocksSection: React.FC<ActiveStocksSectionProps> = ({
  stocks,
  onSelectStock,
  watchlist,
  onToggleWatchlist,
  darkMode,
  flashItemIds,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [sortField, setSortField] = useState<SortField>('rawVolume');
  const [sortAsc, setSortAsc] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const processedStocks = useMemo(() => {
    let result = [...stocks];

    // Filter by tab
    if (filterTab === 'gainers') {
      result = result.filter((s) => s.changePercent > 0);
    } else if (filterTab === 'losers') {
      result = result.filter((s) => s.changePercent < 0);
    } else if (filterTab === 'mega') {
      result = result.filter((s) => s.rawMarketCap >= 1000000000000); // 1T+
    }

    // Filter by search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (s) => s.symbol.toLowerCase().includes(q) || s.companyName.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];
      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });

    return result;
  }, [stocks, filterTab, searchTerm, sortField, sortAsc]);

  // Show top 5 by default matching screenshot, or all if expanded
  const displayedStocks = showAll ? processedStocks : processedStocks.slice(0, 5);

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'Strong Buy':
        return (
          <span className="text-xs font-bold text-[#089981] bg-[#E7F7F4] dark:bg-[#089981]/15 px-2.5 py-1 rounded-full whitespace-nowrap">
            Strong Buy
          </span>
        );
      case 'Buy':
        return (
          <span className="text-xs font-bold text-[#2962FF] bg-blue-50 dark:bg-[#2962FF]/15 px-2.5 py-1 rounded-full whitespace-nowrap">
            Buy
          </span>
        );
      case 'Hold':
        return (
          <span className="text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full whitespace-nowrap">
            Hold
          </span>
        );
      case 'Sell':
      case 'Strong Sell':
        return (
          <span className="text-xs font-bold text-[#F23645] bg-[#FDF0F1] dark:bg-[#F23645]/15 px-2.5 py-1 rounded-full whitespace-nowrap">
            {rating}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 lg:px-8 mt-12" data-purpose="trending-market-table">
      {/* Section Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2
            className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors ${
              darkMode ? 'text-white' : 'text-[#131722]'
            }`}
          >
            Most Active Stocks
          </h2>
          <p className="text-sm text-[#787B86] mt-1">Highest trading volume in the US equities market today</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Market Open Status Pill from screenshot */}
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${
              darkMode ? 'bg-[#1E222D] text-gray-300 border border-[#2A2E39]' : 'bg-[#F0F3FA] text-[#787B86]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse" />
            Market Open
          </span>
        </div>
      </div>

      {/* Filter and Search Sub-Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Category segment buttons */}
        <div
          className={`inline-flex items-center p-1 rounded-xl border text-xs font-semibold ${
            darkMode ? 'bg-[#1E222D] border-[#2A2E39]' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterTab === 'all'
                ? darkMode
                  ? 'bg-[#2A2E39] text-white shadow-sm'
                  : 'bg-white text-[#131722] shadow-sm'
                : 'text-[#787B86] hover:text-current'
            }`}
          >
            Most Active
          </button>
          <button
            onClick={() => setFilterTab('gainers')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              filterTab === 'gainers'
                ? darkMode
                  ? 'bg-[#2A2E39] text-white shadow-sm'
                  : 'bg-white text-[#131722] shadow-sm'
                : 'text-[#787B86] hover:text-current'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#089981]" />
            Top Gainers
          </button>
          <button
            onClick={() => setFilterTab('losers')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              filterTab === 'losers'
                ? darkMode
                  ? 'bg-[#2A2E39] text-white shadow-sm'
                  : 'bg-white text-[#131722] shadow-sm'
                : 'text-[#787B86] hover:text-current'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-[#F23645]" />
            Top Losers
          </button>
          <button
            onClick={() => setFilterTab('mega')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterTab === 'mega'
                ? darkMode
                  ? 'bg-[#2A2E39] text-white shadow-sm'
                  : 'bg-white text-[#131722] shadow-sm'
                : 'text-[#787B86] hover:text-current'
            }`}
          >
            $1T+ Mega Cap
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#787B86]" />
          <input
            type="text"
            placeholder="Filter stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none transition-colors ${
              darkMode
                ? 'bg-[#1E222D] border-[#2A2E39] text-white focus:border-[#2962FF]'
                : 'bg-white border-gray-200 text-[#131722] focus:border-[#2962FF]'
            }`}
          />
        </div>
      </div>

      {/* Financial Data Table Container */}
      <div
        className={`overflow-x-auto border rounded-2xl shadow-sm transition-colors ${
          darkMode ? 'bg-[#1E222D] border-[#2A2E39]' : 'bg-white border-[#E0E3EB]'
        }`}
      >
        <table className="w-full text-left border-collapse" id="active-stocks-table">
          <thead>
            <tr
              className={`border-b text-xs font-bold uppercase tracking-wider transition-colors ${
                darkMode ? 'border-[#2A2E39] bg-[#131722]/50 text-[#787B86]' : 'border-[#E0E3EB] bg-[#F8F9FD] text-[#787B86]'
              }`}
            >
              <th scope="col" className="py-3.5 pl-4 pr-2 w-10 text-center">
                <span className="sr-only">Watch</span>
              </th>
              <th
                scope="col"
                onClick={() => handleSort('symbol')}
                className="py-3.5 px-4 cursor-pointer hover:text-current select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Symbol</span>
                  <ArrowUpDown className="w-3 h-3 text-[#787B86]" />
                </div>
              </th>
              <th
                scope="col"
                onClick={() => handleSort('companyName')}
                className="py-3.5 px-4 cursor-pointer hover:text-current select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Company Name</span>
                  <ArrowUpDown className="w-3 h-3 text-[#787B86]" />
                </div>
              </th>
              <th
                scope="col"
                onClick={() => handleSort('lastPrice')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-current select-none"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Last Price</span>
                  <ArrowUpDown className="w-3 h-3 text-[#787B86]" />
                </div>
              </th>
              <th
                scope="col"
                onClick={() => handleSort('changePercent')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-current select-none"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Change %</span>
                  <ArrowUpDown className="w-3 h-3 text-[#787B86]" />
                </div>
              </th>
              <th
                scope="col"
                onClick={() => handleSort('rawVolume')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-current select-none"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Volume</span>
                  <ArrowUpDown className="w-3 h-3 text-[#787B86]" />
                </div>
              </th>
              <th
                scope="col"
                onClick={() => handleSort('rawMarketCap')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-current select-none"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Market Cap</span>
                  <ArrowUpDown className="w-3 h-3 text-[#787B86]" />
                </div>
              </th>
              <th scope="col" className="py-3.5 px-6 text-center select-none">
                Analyst Rating
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y text-sm font-medium transition-colors ${
              darkMode ? 'divide-[#2A2E39]' : 'divide-[#F0F3FA]'
            }`}
          >
            {displayedStocks.map((stock) => {
              const isPositive = stock.changePercent >= 0;
              const isWatched = watchlist.includes(stock.symbol);
              const flashClass = flashItemIds[stock.id] === 'up' ? 'flash-up' : flashItemIds[stock.id] === 'down' ? 'flash-down' : '';

              return (
                <tr
                  key={stock.id}
                  onClick={() => onSelectStock(stock)}
                  className={`transition-colors cursor-pointer group ${flashClass} ${
                    darkMode
                      ? 'hover:bg-[#252A37]'
                      : 'hover:bg-[#F8F9FD]'
                  }`}
                >
                  {/* Watchlist Star */}
                  <td
                    className="py-4 pl-4 pr-2 text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(stock.symbol);
                    }}
                  >
                    <button
                      type="button"
                      aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
                      className="p-1 rounded hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors focus:outline-none"
                    >
                      <Star
                        className={`w-4 h-4 transition-colors ${
                          isWatched
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300 dark:text-gray-600 hover:text-amber-400'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Symbol with Letter Avatar */}
                  <td className="py-4 px-4 font-bold">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-full text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0 shadow-xs ${stock.avatar.bg}`}
                      >
                        {stock.avatar.letter}
                      </span>
                      <span
                        className={`font-bold transition-colors group-hover:text-[#2962FF] ${
                          darkMode ? 'text-white' : 'text-[#131722]'
                        }`}
                      >
                        {stock.symbol}
                      </span>
                    </div>
                  </td>

                  {/* Company Name */}
                  <td className="py-4 px-4 text-[#787B86] font-normal truncate max-w-[220px]">
                    {stock.companyName}
                  </td>

                  {/* Last Price */}
                  <td
                    className={`py-4 px-4 text-right font-bold tabular-nums ${
                      darkMode ? 'text-white' : 'text-[#131722]'
                    }`}
                  >
                    ${formatCurrency(stock.lastPrice)}
                  </td>

                  {/* Change % Badge */}
                  <td className="py-4 px-4 text-right">
                    <span
                      className={`inline-flex items-center font-bold text-xs px-2 py-0.5 rounded tabular-nums ${
                        isPositive
                          ? darkMode
                            ? 'text-[#089981] bg-[#089981]/15'
                            : 'text-[#089981] bg-[#E7F7F4]'
                          : darkMode
                          ? 'text-[#F23645] bg-[#F23645]/15'
                          : 'text-[#F23645] bg-[#FDF0F1]'
                      }`}
                    >
                      {formatSignedPercent(stock.changePercent)}
                    </span>
                  </td>

                  {/* Volume */}
                  <td className="py-4 px-4 text-right text-[#787B86] font-normal tabular-nums">
                    {stock.volume}
                  </td>

                  {/* Market Cap */}
                  <td className="py-4 px-4 text-right text-[#787B86] font-normal tabular-nums">
                    {stock.marketCap}
                  </td>

                  {/* Analyst Rating */}
                  <td className="py-4 px-6 text-center">
                    {getRatingBadge(stock.analystRating)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {displayedStocks.length === 0 && (
          <div className="py-12 text-center text-[#787B86]">
            No stocks found matching &quot;{searchTerm}&quot;
          </div>
        )}
      </div>

      {/* View More / View Less Toggle Button */}
      {processedStocks.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
              darkMode
                ? 'bg-[#1E222D] border-[#2A2E39] text-gray-300 hover:text-white hover:border-[#363A45]'
                : 'bg-white border-[#E0E3EB] text-[#131722] hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {showAll ? 'Show less (5 stocks)' : `Show all active stocks (${processedStocks.length})`}
          </button>
        </div>
      )}
    </section>
  );
};
