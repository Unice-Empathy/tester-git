import React, { useState } from 'react';
import { X, Check, Zap, Shield, TrendingUp } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({
  isOpen,
  onClose,
  darkMode,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'Essential' | 'Plus' | 'Premium'>('Plus');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border transition-colors ${
          darkMode ? 'bg-[#1E222D] border-[#2A2E39] text-white' : 'bg-white border-[#E0E3EB] text-[#131722]'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg badge-gradient-btn flex items-center justify-center text-white">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="text-xl font-black">Start Your 30-Day Free Trial</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#089981] flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <div className="text-xl font-bold text-[#089981]">Welcome to TradingView Pro!</div>
            <p className="text-sm text-[#787B86] max-w-sm mx-auto">
              We&apos;ve activated your 30-day unlimited trial for <span className="font-semibold text-current">{email}</span>. Enjoy real-time tick streaming and custom Pine Script alerts.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Essential', price: '$14.95/mo', badge: 'Standard' },
                { name: 'Plus', price: '$29.95/mo', badge: 'Most Popular' },
                { name: 'Premium', price: '$59.95/mo', badge: 'Maximum Power' },
              ].map((plan) => {
                const isSelected = selectedPlan === plan.name;
                return (
                  <div
                    key={plan.name}
                    onClick={() => setSelectedPlan(plan.name as any)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#2962FF] bg-[#2962FF]/10 shadow-sm ring-2 ring-[#2962FF]/30'
                        : darkMode
                        ? 'border-[#2A2E39] bg-[#131722] hover:border-gray-700'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-[#2962FF] uppercase">{plan.badge}</div>
                    <div className="font-bold text-sm mt-0.5">{plan.name}</div>
                    <div className="text-xs text-[#787B86] font-medium">{plan.price}</div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#089981]" />
                <span>Unlimited indicators per chart with custom timeframes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#089981]" />
                <span>Zero delayed quotes — true tick-by-tick US and global markets</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#089981]" />
                <span>Fast server-side SMS & Webhook price alerts</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#787B86] mb-1.5">
                Work or Trading Email
              </label>
              <input
                type="email"
                required
                placeholder="trader@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#2962FF] transition-colors ${
                  darkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-white border-gray-200'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full badge-gradient-btn text-white font-bold py-3 rounded-full text-sm shadow-md transition-all cursor-pointer"
            >
              Start 30-Day Free Trial
            </button>

            <p className="text-[11px] text-center text-[#787B86]">
              No credit card required. Cancel anytime during your 30-day trial period.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
