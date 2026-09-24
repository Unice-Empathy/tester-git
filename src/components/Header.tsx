import React, { useState } from 'react';
import { Search, Globe, User, Moon, Sun, Bookmark, Menu, X, ChevronDown, Check } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  darkMode: boolean;
  onToggleTheme: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onGetStarted: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenWatchlist,
  watchlistCount,
  darkMode,
  onToggleTheme,
  activeNav,
  setActiveNav,
  onGetStarted,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'ES', name: 'Español' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'FR', name: 'Français' },
    { code: 'JA', name: '日本語' },
    { code: 'ZH', name: '简体中文' },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-colors backdrop-blur border-b ${
      darkMode ? 'bg-[#131722]/95 border-[#2A2E39]' : 'bg-white/95 border-[#F0F3FA]'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Global Search */}
        <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
          {/* TradingView Geometric Logo */}
          <button
            onClick={() => setActiveNav('Markets')}
            aria-label="TradingView Home"
            className="flex items-center gap-1.5 focus:outline-none group cursor-pointer"
          >
            <svg
              className={`w-9 h-7 transition-colors ${darkMode ? 'text-white' : 'text-[#131722]'}`}
              fill="currentColor"
              viewBox="0 0 36 28"
            >
              <path d="M4 18h6v10H4zM14 6h6v22h-6zM24 0h6v28h-6zM0 24h36v4H0z" />
            </svg>
          </button>

          {/* Search Input Pill */}
          <div
            onClick={onOpenSearch}
            className={`relative hidden sm:flex items-center w-52 md:w-64 cursor-pointer rounded-full px-3.5 py-2 text-sm transition-all border ${
              darkMode
                ? 'bg-[#1E222D] border-[#2A2E39] text-[#787B86] hover:border-[#2962FF]'
                : 'bg-[#F0F3FA] border-transparent text-[#787B86] hover:bg-[#E0E3EB]'
            }`}
          >
            <Search className="w-4 h-4 mr-2.5 text-[#787B86] flex-shrink-0" />
            <span className="font-medium text-sm select-none">Search (Ctrl+K)</span>
            <kbd className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
              darkMode ? 'bg-[#2A2E39] border-[#363A45] text-gray-300' : 'bg-white border-gray-200 text-gray-500'
            }`}>
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-[15px] font-semibold">
          {['Products', 'Community', 'Markets', 'Brokers', 'More'].map((item) => {
            const isActive = activeNav === item;
            return (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`transition-colors relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-[#2962FF]'
                    : darkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-[#131722] hover:text-[#2962FF]'
                }`}
              >
                {item}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2962FF] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Utility Controls & CTA */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            aria-label="Search"
            className={`sm:hidden p-2 rounded-lg transition-colors ${
              darkMode ? 'text-gray-300 hover:bg-[#1E222D]' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Watchlist Toggle Button */}
          <button
            onClick={onOpenWatchlist}
            aria-label="Watchlist"
            className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              darkMode
                ? 'text-gray-300 hover:bg-[#1E222D] hover:text-white'
                : 'text-[#131722] hover:bg-[#F0F3FA] hover:text-[#2962FF]'
            }`}
            title="Open Watchlist"
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden md:inline">Watchlist</span>
            {watchlistCount > 0 && (
              <span className="bg-[#2962FF] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'text-amber-400 hover:bg-[#1E222D]'
                : 'text-gray-600 hover:bg-[#F0F3FA] hover:text-[#131722]'
            }`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              aria-label="Select language"
              className={`hidden sm:flex items-center gap-1.5 font-semibold text-sm px-2 py-1.5 rounded-lg transition-colors ${
                darkMode
                  ? 'text-gray-300 hover:text-white hover:bg-[#1E222D]'
                  : 'text-[#131722] hover:text-[#2962FF] hover:bg-[#F0F3FA]'
              }`}
            >
              <Globe className="w-4 h-4 text-[#787B86]" />
              <span>{selectedLang}</span>
              <ChevronDown className="w-3 h-3 text-[#787B86]" />
            </button>

            {langMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-44 rounded-xl shadow-xl border py-1.5 z-50 animate-in fade-in-50 duration-150 ${
                  darkMode ? 'bg-[#1E222D] border-[#2A2E39]' : 'bg-white border-[#E0E3EB]'
                }`}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors ${
                      selectedLang === lang.code
                        ? 'text-[#2962FF] bg-[#2962FF]/10'
                        : darkMode
                        ? 'text-gray-200 hover:bg-[#2A2E39]'
                        : 'text-[#131722] hover:bg-gray-50'
                    }`}
                  >
                    <span>{lang.name}</span>
                    {selectedLang === lang.code && <Check className="w-3.5 h-3.5 text-[#2962FF]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Avatar / Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-label="User Account"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                darkMode
                  ? 'text-gray-300 hover:bg-[#1E222D]'
                  : 'text-[#131722] hover:bg-[#F0F3FA]'
              }`}
            >
              <User className="w-5 h-5" />
            </button>

            {userMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border p-2 z-50 ${
                  darkMode ? 'bg-[#1E222D] border-[#2A2E39]' : 'bg-white border-[#E0E3EB]'
                }`}
              >
                <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                  <div className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Trader Account
                  </div>
                  <div className="text-xs text-gray-500">Free Pro Trial Active</div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      onOpenWatchlist();
                      setUserMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium ${
                      darkMode ? 'text-gray-300 hover:bg-[#2A2E39]' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    My Watchlist ({watchlistCount})
                  </button>
                  <button
                    onClick={() => {
                      onToggleTheme();
                      setUserMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium ${
                      darkMode ? 'text-gray-300 hover:bg-[#2A2E39]' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Theme: {darkMode ? 'Dark' : 'Light'}
                  </button>
                  <button
                    onClick={() => {
                      onGetStarted();
                      setUserMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg font-semibold text-[#2962FF] ${
                      darkMode ? 'hover:bg-[#2A2E39]' : 'hover:bg-blue-50'
                    }`}
                  >
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Get Started Primary Action Button */}
          <button
            onClick={onGetStarted}
            className="badge-gradient-btn text-white text-sm font-semibold px-4 sm:px-5 py-2 rounded-full transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            Get started
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              darkMode ? 'text-gray-300 hover:bg-[#1E222D]' : 'text-[#131722] hover:bg-gray-100'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-t px-4 py-3 space-y-2 ${
          darkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-white border-[#F0F3FA]'
        }`}>
          {['Products', 'Community', 'Markets', 'Brokers', 'More'].map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveNav(item);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 px-3 rounded-lg text-sm font-semibold ${
                activeNav === item
                  ? 'text-[#2962FF] bg-[#2962FF]/10'
                  : darkMode
                  ? 'text-gray-300 hover:bg-[#1E222D]'
                  : 'text-[#131722] hover:bg-gray-100'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
