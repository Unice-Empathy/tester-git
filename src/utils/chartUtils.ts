import { ChartDataPoint } from '../types/market';

export function formatCurrency(value: number, decimals = 2): string {
  if (value >= 1000) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }
  return value.toFixed(decimals);
}

export function formatSignedPercent(value: number): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

export function formatSignedValue(value: number, decimals = 2): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value >= 1000 ? formatCurrency(value, decimals) : value.toFixed(decimals)}`;
}

// Generate realistic chart history points based on baseline price and timeframe
export function generateChartHistory(basePrice: number, timeframe: string): ChartDataPoint[] {
  const points: ChartDataPoint[] = [];
  let count = 30;
  let intervalMs = 60 * 1000; // 1 min for 1D
  let volatility = 0.003;

  switch (timeframe) {
    case '1D':
      count = 40;
      intervalMs = 10 * 60 * 1000; // 10 min
      volatility = 0.002;
      break;
    case '5D':
      count = 50;
      intervalMs = 2 * 60 * 60 * 1000; // 2 hours
      volatility = 0.005;
      break;
    case '1M':
      count = 30;
      intervalMs = 24 * 60 * 60 * 1000; // 1 day
      volatility = 0.009;
      break;
    case '6M':
      count = 45;
      intervalMs = 4 * 24 * 60 * 60 * 1000;
      volatility = 0.015;
      break;
    case '1Y':
      count = 52;
      intervalMs = 7 * 24 * 60 * 60 * 1000; // 1 week
      volatility = 0.02;
      break;
    case '5Y':
      count = 60;
      intervalMs = 30 * 24 * 60 * 60 * 1000; // 1 month
      volatility = 0.035;
      break;
    default:
      count = 35;
  }

  const now = Date.now();
  let current = basePrice * (1 - volatility * (count / 3));

  for (let i = 0; i < count; i++) {
    const t = new Date(now - (count - 1 - i) * intervalMs);
    // Brownian walk trending towards basePrice at end
    const randomDelta = (Math.random() - 0.48) * volatility * basePrice;
    current += randomDelta;
    if (i === count - 1) {
      current = basePrice;
    }

    const open = current - (Math.random() - 0.5) * (basePrice * volatility * 0.5);
    const high = Math.max(open, current) + Math.random() * (basePrice * volatility * 0.4);
    const low = Math.min(open, current) - Math.random() * (basePrice * volatility * 0.4);

    points.push({
      timestamp: timeframe === '1D'
        ? t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : t.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      price: Math.max(0.01, Number(current.toFixed(2))),
      open: Math.max(0.01, Number(open.toFixed(2))),
      high: Math.max(0.01, Number(high.toFixed(2))),
      low: Math.max(0.01, Number(low.toFixed(2))),
      close: Math.max(0.01, Number(current.toFixed(2))),
      volume: Math.floor(Math.random() * 500000 + 100000),
    });
  }

  return points;
}
