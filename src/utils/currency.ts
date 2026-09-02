// Rupee formatting helpers: full amounts, short axis/tile labels, and the
// lakh/crore words that make a nine-digit number readable at a glance.

const inrFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** `₹1,23,45,678` — Indian digit grouping, rounded to whole rupees. */
export const formatINR = (value: number): string =>
  `₹${inrFormatter.format(Math.round(value || 0))}`;

/**
 * `₹2.00 Cr` / `₹45.5 L` / `₹85,000` — for stat tiles and chart axes, where the
 * exact paise matter less than the magnitude.
 */
export const formatCompactINR = (value: number): string => {
  const n = Math.round(value || 0);
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)} L`;
  return `${sign}₹${inrFormatter.format(abs)}`;
};

/** `26 years 4 months`, `7 months`, `—`. */
export const formatDuration = (months: number): string => {
  if (!months || months <= 0) return '—';
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts: string[] = [];
  if (y) parts.push(`${y} ${y === 1 ? 'year' : 'years'}`);
  if (m) parts.push(`${m} ${m === 1 ? 'month' : 'months'}`);
  return parts.join(' ');
};

const UNITS = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
  'Eighteen', 'Nineteen',
];

const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

// Recursive so it stays correct past 100 crore, where a fixed crore/lakh/thousand
// decomposition would run off the end of the TENS table.
const inWords = (n: number): string => {
  if (n < 20) return UNITS[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ` ${UNITS[n % 10]}` : '');
  if (n < 1000) return `${UNITS[Math.floor(n / 100)]} Hundred${n % 100 ? ` ${inWords(n % 100)}` : ''}`;
  if (n < 100000) return `${inWords(Math.floor(n / 1000))} Thousand${n % 1000 ? ` ${inWords(n % 1000)}` : ''}`;
  if (n < 10000000) return `${inWords(Math.floor(n / 100000))} Lakh${n % 100000 ? ` ${inWords(n % 100000)}` : ''}`;
  return `${inWords(Math.floor(n / 10000000))} Crore${n % 10000000 ? ` ${inWords(n % 10000000)}` : ''}`;
};

/** `Twenty Lakh Rupees` — spelled out so a mistyped zero is obvious. */
export const toIndianWords = (value: number): string => {
  const n = Math.floor(Math.abs(value || 0));
  if (!Number.isFinite(n)) return '';
  if (n === 0) return 'Zero Rupees';
  if (n > 1e15) return ''; // beyond anything a loan form needs to spell out
  return `${value < 0 ? 'Minus ' : ''}${inWords(n)} Rupees`;
};
