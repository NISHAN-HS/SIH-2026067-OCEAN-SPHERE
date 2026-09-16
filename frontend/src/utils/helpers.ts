export const getReliabilityColor = (score: number) => {
  if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-rose-600 bg-rose-50 border-rose-200';
};

export const getReliabilityBadge = (score: number) => {
  if (score >= 80) return { label: 'High Reliability', bg: 'bg-emerald-500', text: 'text-white' };
  if (score >= 60) return { label: 'Moderate Reliability', bg: 'bg-amber-500', text: 'text-white' };
  return { label: 'Low Reliability', bg: 'bg-rose-500', text: 'text-white' };
};

export const formatNumber = (num: number, decimals: number = 2) => {
  if (num === undefined || num === null) return 'N/A';
  return num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};
