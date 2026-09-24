import React, { useState, useMemo } from 'react';
import { StockItem, MarketIndexItem, CryptoItem, ChartDataPoint } from '../types/market';
import { X, Star, TrendingUp, TrendingDown, Clock, ShieldCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, formatSignedPercent, generateChartHistory } from '../utils/chartUtils';

interface AssetDetailModalProps {
  asset: StockItem | MarketIndexItem | CryptoItem | null;
  onClose: () => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  darkMode: boolean;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  watchlist,
  onToggleWatchlist,
  darkMode,
}) => {
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | '1Y' | '5Y'>('1D');
  const [hoveredData, setHoveredData] = useState<ChartDataPoint | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [orderQty, setOrderQty] = useState(10);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!asset) return null;

  const symbol = asset.symbol;
  const name = 'companyName' in asset ? asset.companyName : asset.name;
  const currentPrice = 'lastPrice' in asset ? asset.lastPrice : asset.price;
  const changePercent = asset.changePercent;
  const isPositive = changePercent >= 0;
  const isWatched = watchlist.includes(symbol);

  // Generate chart data based on price and selected timeframe
  const chartPoints = useMemo(() => {
    return generateChartHistory(currentPrice, timeframe);
  }, [currentPrice, timeframe]);

  const activePoint = hoveredData || chartPoints[chartPoints.length - 1];

  // SVG Chart sizing and path calculations
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 20;
  const paddingY = 20;

  const prices = chartPoints.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const pathD = chartPoints
    .map((p, idx) => {
      const x = paddingX + (idx / (chartPoints.length - 1)) * (svgWidth - paddingX * 2);
      const normalized = (p.price - minPrice) / priceRange;
      const y = svgHeight - paddingY - normalized * (svgHeight - paddingY * 2);
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const areaD = `${pathD} L ${svgWidth - paddingX} ${svgHeight} L ${paddingX} ${svgHeight} Z`;

  // Day range calculation
  const dayLow = 'dayLow' in asset && asset.dayLow ? asset.dayLow : currentPrice * 0.985;
  const dayHigh = 'dayHigh' in asset && asset.dayHigh ? asset.dayHigh : currentPrice * 1.018;
  const dayRangeProgress = Math.min(100, Math.max(0, ((currentPrice - dayLow) / (dayHigh - dayLow)) * 100));

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setOrderModalOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border flex flex-col transition-colors ${
          darkMode ? 'bg-[#1E222D] border-[#2A2E39] text-white' : 'bg-white border-[#E0E3EB] text-[#131722]'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-5 sm:p-6 border-b flex items-start justify-between gap-4 sticky top-0 backdrop-blur z-20 transition-colors ${
            darkMode ? 'bg-[#1E222D]/95 border-[#2A2E39]' : 'bg-white/95 border-[#F0F3FA]'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {'avatar' in asset && (
                <span
                  className={`w-10 h-10 rounded-full text-white font-bold text-sm flex items-center justify-center shadow-xs ${asset.avatar.bg}`}
                >
                  {asset.avatar.letter}
                </span>
              )}
              {'badge' in asset && (
                <span
                  className="w-10 h-10 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: asset.badge.bg }}
                >
                  {asset.badge.text}
                </span>
              )}
              {'badgeIcon' in asset && (
                <span
                  className="w-10 h-10 rounded-full text-white font-bold text-base flex items-center justify-center shadow-xs"
                  style={{ background: asset.badgeBg }}
                >
                  {asset.badgeIcon}
                </span>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">{symbol}</h2>
                  <span className="text-xs px-2 py-0.5 rounded font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500">
                    {'sector' in asset ? asset.sector : 'Market Asset'}
                  </span>
                </div>
                <div className="text-sm text-[#787B86] font-medium">{name}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(symbol)}
              className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                isWatched
                  ? 'border-amber-400/50 bg-amber-400/10 text-amber-500'
                  : darkMode
                  ? 'border-[#2A2E39] bg-[#131722] text-gray-300 hover:text-white'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:text-black'
              }`}
            >
              <Star className={`w-4 h-4 ${isWatched ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden sm:inline">{isWatched ? 'Saved' : 'Watchlist'}</span>
            </button>

            <button
              onClick={() => setOrderModalOpen(true)}
              className="badge-gradient-btn text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              Trade {symbol}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Real-time Price and Day Range */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black tracking-tight tabular-nums">
                  ${formatCurrency(activePoint ? activePoint.price : currentPrice)}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-sm font-bold px-2.5 py-1 rounded-md tabular-nums ${
                    isPositive
                      ? darkMode
                        ? 'text-[#089981] bg-[#089981]/15'
                        : 'text-[#089981] bg-[#E7F7F4]'
                      : darkMode
                      ? 'text-[#F23645] bg-[#F23645]/15'
                      : 'text-[#F23645] bg-[#FDF0F1]'
                  }`}
                >
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {formatSignedPercent(changePercent)}
                </span>
              </div>
              <div className="text-xs text-[#787B86] mt-1 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {activePoint ? `Timestamp: ${activePoint.timestamp}` : 'Real-time Consolidated Quote'}
                </span>
              </div>
            </div>

            {/* Day Range Slider Indicator */}
            <div className="w-full sm:w-64">
              <div className="flex justify-between text-[11px] font-semibold text-[#787B86] mb-1">
                <span>Day Low: ${formatCurrency(dayLow)}</span>
                <span>Day High: ${formatCurrency(dayHigh)}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2962FF] to-[#089981]"
                  style={{ width: `${dayRangeProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Timeframe Controls Bar */}
          <div className="flex items-center justify-between border-b pb-3 border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1">
              {(['1D', '5D', '1M', '6M', '1Y', '5Y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    timeframe === tf
                      ? 'bg-[#2962FF] text-white shadow-xs'
                      : darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <div className="text-xs font-semibold text-[#787B86]">
              {timeframe} Interactive Chart
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div
            className={`w-full rounded-2xl p-4 border relative overflow-hidden transition-colors ${
              darkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-[#F8F9FD] border-[#E0E3EB]'
            }`}
          >
            <div className="h-56 w-full relative">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={isPositive ? '#089981' : '#F23645'}
                      stopOpacity="0.3"
                    />
                    <stop
                      offset="100%"
                      stopColor={isPositive ? '#089981' : '#F23645'}
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line
                  x1={paddingX}
                  y1={svgHeight * 0.25}
                  x2={svgWidth - paddingX}
                  y2={svgHeight * 0.25}
                  stroke={darkMode ? '#2A2E39' : '#E0E3EB'}
                  strokeDasharray="4 4"
                />
                <line
                  x1={paddingX}
                  y1={svgHeight * 0.5}
                  x2={svgWidth - paddingX}
                  y2={svgHeight * 0.5}
                  stroke={darkMode ? '#2A2E39' : '#E0E3EB'}
                  strokeDasharray="4 4"
                />
                <line
                  x1={paddingX}
                  y1={svgHeight * 0.75}
                  x2={svgWidth - paddingX}
                  y2={svgHeight * 0.75}
                  stroke={darkMode ? '#2A2E39' : '#E0E3EB'}
                  strokeDasharray="4 4"
                />

                {/* Shaded Area */}
                <path d={areaD} fill="url(#chartGradient)" />

                {/* Main line path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isPositive ? '#089981' : '#F23645'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Invisible interactive overlay to track hover */}
              <div
                className="absolute inset-0 flex"
                onMouseLeave={() => setHoveredData(null)}
              >
                {chartPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex-1 h-full cursor-crosshair group relative"
                    onMouseEnter={() => setHoveredData(point)}
                  >
                    <div className="hidden group-hover:block absolute inset-y-0 left-1/2 w-[1px] bg-blue-500/60 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>

            {/* Chart footer labels */}
            <div className="flex justify-between items-center text-[11px] text-[#787B86] pt-2 border-t border-gray-200 dark:border-gray-800">
              <span>{chartPoints[0]?.timestamp}</span>
              <span>{chartPoints[Math.floor(chartPoints.length / 2)]?.timestamp}</span>
              <span>{chartPoints[chartPoints.length - 1]?.timestamp}</span>
            </div>
          </div>

          {/* Key Fundamentals & Statistics Grid */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#787B86] mb-3">
              Key Statistics & Fundamentals
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div
                className={`p-3 rounded-xl border ${
                  darkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-[#F8F9FD] border-[#E0E3EB]'
                }`}
              >
                <div className="text-[#787B86]">Open Price</div>
                <div className="font-bold text-sm mt-0.5 tabular-nums">
                  ${formatCurrency('openPrice' in asset && asset.openPrice ? asset.openPrice : currentPrice * 0.995)}
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  darkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-[#F8F9FD] border-[#E0E3EB]'
                }`}
              >
                <div className="text-[#787B86]">52-Week Range</div>
                <div className="font-bold text-sm mt-0.5 tabular-nums">
                  {'high52w' in asset && asset.high52w ? `$${asset.low52w} - $${asset.high52w}` : '$120 - $340'}
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  darkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-[#F8F9FD] border-[#E0E3EB]'
                }`}
              >
                <div className="text-[#787B86]">P/E Ratio</div>
                <div className="font-bold text-sm mt-0.5 tabular-nums">
                  {'peRatio' in asset && asset.peRatio ? `${asset.peRatio}x` : '32.4x'}
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  darkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-[#F8F9FD] border-[#E0E3EB]'
                }`}
              >
                <div className="text-[#787B86]">Market Cap</div>
                <div className="font-bold text-sm mt-0.5 tabular-nums">
                  {'marketCap' in asset && asset.marketCap ? asset.marketCap : '$2.4T'}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {'description' in asset && asset.description && (
            <div className="text-xs text-[#787B86] leading-relaxed pt-2">
              <span className="font-semibold text-gray-800 dark:text-gray-200">About {symbol}: </span>
              {asset.description}
            </div>
          )}
        </div>

        {/* Order Placement Mini Modal */}
        {orderModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div
              className={`w-full max-w-sm rounded-2xl p-5 shadow-2xl border ${
                darkMode ? 'bg-[#1E222D] border-[#2A2E39]' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                <h4 className="font-bold text-base">Trade {symbol}</h4>
                <button
                  onClick={() => setOrderModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {orderSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#089981] flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-base text-[#089981]">Order Executed!</div>
                  <p className="text-xs text-[#787B86]">
                    Filled {orderQty} shares of {symbol} at ${formatCurrency(currentPrice)}
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePlaceOrder} className="py-4 space-y-4">
                  {/* Buy / Sell Tab */}
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-gray-100 dark:bg-[#131722]">
                    <button
                      type="button"
                      onClick={() => setOrderType('buy')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                        orderType === 'buy' ? 'bg-[#089981] text-white shadow-xs' : 'text-gray-500'
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('sell')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                        orderType === 'sell' ? 'bg-[#F23645] text-white shadow-xs' : 'text-gray-500'
                      }`}
                    >
                      Sell
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#787B86] block mb-1">
                      Quantity (Units)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10000}
                      value={orderQty}
                      onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className={`w-full px-3 py-2 text-sm font-bold rounded-xl border ${
                        darkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>

                  <div className="flex justify-between text-xs py-2 border-t border-b border-gray-100 dark:border-gray-800">
                    <span className="text-[#787B86]">Estimated Total:</span>
                    <span className="font-bold tabular-nums">
                      ${formatCurrency(orderQty * currentPrice)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all ${
                      orderType === 'buy'
                        ? 'bg-[#089981] hover:bg-[#078570]'
                        : 'bg-[#F23645] hover:bg-[#d62837]'
                    }`}
                  >
                    Confirm {orderType.toUpperCase()} Order
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
