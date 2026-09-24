import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FooterProps {
  darkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ darkMode }) => {
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  const openDoc = (title: string, body: string) => {
    setModalContent({ title, body });
  };

  return (
    <>
      <footer
        className={`border-t py-10 text-xs transition-colors ${
          darkMode ? 'border-[#2A2E39] bg-[#131722] text-[#787B86]' : 'border-[#E0E3EB] bg-[#F8F9FD] text-[#787B86]'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Disclaimer */}
          <div className="flex items-center gap-4">
            <svg
              className={`w-7 h-5 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-[#B2B5BE]'}`}
              fill="currentColor"
              viewBox="0 0 36 28"
            >
              <path d="M4 18h6v10H4zM14 6h6v22h-6zM24 0h6v28h-6zM0 24h36v4H0z" />
            </svg>
            <p className="leading-relaxed">
              © 2024 TradingView. Quotes and market indicators delayed by minimum 15 mins unless specified.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div
            className={`flex flex-wrap items-center gap-6 font-medium transition-colors ${
              darkMode ? 'text-gray-400' : 'text-[#50535E]'
            }`}
          >
            <button
              onClick={() =>
                openDoc(
                  'Privacy Policy',
                  'TradingView prioritizes your confidentiality and data privacy. We employ end-to-end encryption protocols for analytical telemetry and protect your personal identification details in accordance with GDPR and CCPA standards.'
                )
              }
              className="hover:text-[#2962FF] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() =>
                openDoc(
                  'Terms of Service',
                  'By accessing market data feeds, charts, and analytics on this platform, you agree to individual investor terms. Redistribution of raw ticker feeds and algorithmic scraping without express licensing is prohibited.'
                )
              }
              className="hover:text-[#2962FF] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() =>
                openDoc(
                  'Market Data Disclaimer',
                  'All financial information, market quotes, technical indicators, and analytics are provided for informational and educational purposes only and do not constitute financial, investment, or trading advice.'
                )
              }
              className="hover:text-[#2962FF] transition-colors cursor-pointer"
            >
              Disclaimer
            </button>
            <button
              onClick={() =>
                openDoc(
                  'Help Center & Support',
                  'Need assistance? Our 24/7 market desk and technical support team are here to help. Explore our interactive charting guides, Pine Script documentation, keyboard shortcuts, and broker integration tutorials.'
                )
              }
              className="hover:text-[#2962FF] transition-colors cursor-pointer"
            >
              Help Center
            </button>
          </div>
        </div>
      </footer>

      {/* Info Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border transition-colors ${
              darkMode ? 'bg-[#1E222D] border-[#2A2E39] text-white' : 'bg-white border-gray-200 text-[#131722]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-lg">{modalContent.title}</h3>
              <button
                onClick={() => setModalContent(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-4 text-sm text-[#787B86] leading-relaxed">{modalContent.body}</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2962FF] rounded-lg hover:bg-[#1E53E5] transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
