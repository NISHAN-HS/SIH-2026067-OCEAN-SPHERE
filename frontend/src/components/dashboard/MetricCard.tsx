import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'ocean' | 'emerald' | 'amber' | 'rose' | 'navy';
  badge?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'ocean',
  badge
}) => {
  const colorStyles = {
    ocean: 'from-ocean-50 to-white text-ocean-600 border-ocean-100',
    emerald: 'from-emerald-50 to-white text-emerald-600 border-emerald-100',
    amber: 'from-amber-50 to-white text-amber-600 border-amber-100',
    rose: 'from-rose-50 to-white text-rose-600 border-rose-100',
    navy: 'from-slate-100 to-white text-navy-500 border-slate-200'
  };

  const iconBgStyles = {
    ocean: 'bg-ocean-100 text-ocean-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    rose: 'bg-rose-100 text-rose-600',
    navy: 'bg-slate-200 text-navy-500'
  };

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-b ${colorStyles[color]} border shadow-xs hover:shadow-md transition-shadow relative overflow-hidden`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`w-9 h-9 rounded-xl ${iconBgStyles[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
        {badge && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
            {badge}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1 text-xs text-slate-500 font-medium">{subtitle}</p>}
    </div>
  );
};
