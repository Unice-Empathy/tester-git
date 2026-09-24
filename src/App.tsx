import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IndicesSection } from './components/IndicesSection';
import { ActiveStocksSection } from './components/ActiveStocksSection';
import { CryptoSpotlightSection } from './components/CryptoSpotlightSection';
import { Footer } from './components/Footer';
import { AssetDetailModal } from './components/AssetDetailModal';
import { SearchModal } from './components/SearchModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { GetStartedModal } from './components/GetStartedModal';
import { INITIAL_INDICES, INITIAL_STOCKS, INITIAL_CRYPTOS } from './data/mockMarketData';
import { MarketCategory, MarketIndexItem, StockItem, CryptoItem } from './types/market';

export default function App() {
  const [indices, setIndices] = useState<MarketIndexItem[]>(INITIAL_INDICES);
  const [stocks, setStocks] = useState<StockItem[]>(INITIAL_STOCKS);
  const [cryptos, setCryptos] = useState<CryptoItem[]>(INITIAL_CRYPTOS);

  const categories: MarketCategory[] = [
    'US stocks',
    'World stocks',
    'Crypto',
    'Futures',
    'Forex',
    'Government bonds',
    'Corporate bonds',
    'ETFs',
  ];

  const [activeCategory, setActiveCategory] = useState<MarketCategory>('US stocks');
  const [selectedRegion, setSelectedRegion] = useState('everywhere');
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState('Markets');
  const [watchlist, setWatchlist] = useState<string[]>(['NVDA', 'BTC']);

  // Modals & Drawers state
  const [searchOpen, setSearchOpen] = useState(false);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [getStartedOpen, setGetStartedOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<StockItem | MarketIndexItem | CryptoItem | null>(null);

  // Live simulation & price flash state
  const [isSimulating, setIsSimulating] = useState(true);
  const [flashItemIds, setFlashItemIds] = useState<Record<string, 'up' | 'down'>>({});

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time market feed simulation effect
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Pick random asset type: 0 = stock, 1 = crypto, 2 = index
      const choice = Math.floor(Math.random() * 3);
      const isPositive = Math.random() > 0.45;
      const pctDelta = (Math.random() * 0.35 + 0.05) * (isPositive ? 1 : -1);

      if (choice === 0) {
        // Fluctuate a random stock
        const randomIdx = Math.floor(Math.random() * stocks.length);
        const target = stocks[randomIdx];
        const newPrice = Math.max(0.1, target.lastPrice * (1 + pctDelta / 100));
        const newPct = target.changePercent + pctDelta;

        setStocks((prev) =>
          prev.map((s, idx) =>
            idx === randomIdx
              ? {
                  ...s,
                  lastPrice: Number(newPrice.toFixed(2)),
                  changePercent: Number(newPct.toFixed(2)),
                }
              : s
          )
        );

        setFlashItemIds((prev) => ({ ...prev, [target.id]: isPositive ? 'up' : 'down' }));
        setTimeout(() => {
          setFlashItemIds((prev) => {
            const next = { ...prev };
            delete next[target.id];
            return next;
          });
        }, 800);
      } else if (choice === 1) {
        // Fluctuate a random crypto
        const randomIdx = Math.floor(Math.random() * cryptos.length);
        const target = cryptos[randomIdx];
        const newPrice = Math.max(0.01, target.price * (1 + pctDelta / 100));
        const newPct = target.changePercent + pctDelta;

        setCryptos((prev) =>
          prev.map((c, idx) =>
            idx === randomIdx
              ? {
                  ...c,
                  price: Number(newPrice.toFixed(2)),
                  changePercent: Number(newPct.toFixed(2)),
                }
              : c
          )
        );

        setFlashItemIds((prev) => ({ ...prev, [target.id]: isPositive ? 'up' : 'down' }));
        setTimeout(() => {
          setFlashItemIds((prev) => {
            const next = { ...prev };
            delete next[target.id];
            return next;
          });
        }, 800);
      } else {
        // Fluctuate a random index
        const randomIdx = Math.floor(Math.random() * indices.length);
        const target = indices[randomIdx];
        const newPrice = Math.max(0.1, target.price * (1 + pctDelta / 100));
        const newPct = target.changePercent + pctDelta;
        const newChange = target.change + (newPrice - target.price);

        setIndices((prev) =>
          prev.map((i, idx) =>
            idx === randomIdx
              ? {
                  ...i,
                  price: Number(newPrice.toFixed(2)),
                  changePercent: Number(newPct.toFixed(2)),
                  change: Number(newChange.toFixed(2)),
                }
              : i
          )
        );

        setFlashItemIds((prev) => ({ ...prev, [target.id]: isPositive ? 'up' : 'down' }));
        setTimeout(() => {
          setFlashItemIds((prev) => {
            const next = { ...prev };
            delete next[target.id];
            return next;
          });
        }, 800);
      }
    }, 2400);

    return () => clearInterval(interval);
  }, [isSimulating, stocks, cryptos, indices]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors selection:bg-[#2962FF] selection:text-white ${
        darkMode ? 'bg-[#131722] text-white' : 'bg-white text-[#131722]'
      }`}
    >
      {/* Top Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWatchlist={() => setWatchlistOpen(true)}
        watchlistCount={watchlist.length}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onGetStarted={() => setGetStartedOpen(true)}
      />

      {/* Main Markets View */}
      <main className="flex-1 pb-16">
        {/* Hero Section with Regional Dropdown */}
        <HeroSection
          darkMode={darkMode}
          selectedRegion={selectedRegion}
          onSelectRegion={(reg) => {
            setSelectedRegion(reg);
            if (reg === 'crypto') setActiveCategory('Crypto');
            else if (reg === 'europe' || reg === 'asia') setActiveCategory('World stocks');
            else if (reg === 'us') setActiveCategory('US stocks');
          }}
          isSimulating={isSimulating}
          onToggleSimulating={() => setIsSimulating(!isSimulating)}
        />

        {/* Indices Section: Title + Filter Tabs + 5-Card Grid */}
        <IndicesSection
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          indices={indices}
          onSelectIndex={(item) => setSelectedAsset(item)}
          darkMode={darkMode}
          flashItemIds={flashItemIds}
        />

        {/* Most Active Stocks Table */}
        <ActiveStocksSection
          stocks={stocks}
          onSelectStock={(stock) => setSelectedAsset(stock)}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
          darkMode={darkMode}
          flashItemIds={flashItemIds}
        />

        {/* Crypto Spotlight Section */}
        <CryptoSpotlightSection
          cryptos={cryptos}
          onSelectCrypto={(crypto) => setSelectedAsset(crypto)}
          darkMode={darkMode}
          flashItemIds={flashItemIds}
        />
      </main>

      {/* Footer */}
      <Footer darkMode={darkMode} />

      {/* Asset Detail & Chart Modal */}
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
          darkMode={darkMode}
        />
      )}

      {/* Quick Search Palette (Ctrl+K) */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        stocks={stocks}
        indices={indices}
        cryptos={cryptos}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
        darkMode={darkMode}
      />

      {/* Watchlist Slide-out Drawer */}
      <WatchlistDrawer
        isOpen={watchlistOpen}
        onClose={() => setWatchlistOpen(false)}
        watchlist={watchlist}
        onRemoveFromWatchlist={toggleWatchlist}
        stocks={stocks}
        cryptos={cryptos}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
        darkMode={darkMode}
      />

      {/* Get Started 30-Day Trial Modal */}
      <GetStartedModal
        isOpen={getStartedOpen}
        onClose={() => setGetStartedOpen(false)}
        darkMode={darkMode}
      />
    </div>
  );
}
