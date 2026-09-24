export type MarketCategory =
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs';

export interface SparklinePoint {
  time: string;
  value: number;
}

export interface MarketIndexItem {
  id: string;
  name: string;
  symbol: string;
  badge: {
    text: string;
    bg: string;
    textColor?: string;
  };
  price: number;
  change: number;
  changePercent: number;
  sparkline: number[]; // relative points 0-100
  category: MarketCategory;
  currency?: string;
}

export type AnalystRating = 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';

export interface StockItem {
  id: string;
  symbol: string;
  companyName: string;
  avatar: {
    letter: string;
    bg: string;
  };
  lastPrice: number;
  changePercent: number;
  changeValue: number;
  volume: string;
  rawVolume: number;
  marketCap: string;
  rawMarketCap: number;
  analystRating: AnalystRating;
  peRatio?: number;
  eps?: number;
  high52w?: number;
  low52w?: number;
  openPrice?: number;
  prevClose?: number;
  dayHigh?: number;
  dayLow?: number;
  sector?: string;
  description?: string;
  sparkline: number[];
}

export interface CryptoItem {
  id: string;
  name: string;
  symbol: string; // e.g. BTC/USD
  rawSymbol: string; // BTC
  badgeIcon: string;
  badgeBg: string;
  badgeTextColor?: string;
  price: number;
  changePercent: number;
  sparkline: number[];
  marketCap?: string;
  volume24h?: string;
  high24h?: number;
  low24h?: number;
}

export interface ChartDataPoint {
  timestamp: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}
