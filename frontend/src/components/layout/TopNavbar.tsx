import React, { useState } from 'react';
import { Waves, Search, Layers, Clock, Sun, Moon, Settings, Database, Cpu, Activity, Compass, CheckCircle2 } from 'lucide-react';

interface TopNavbarProps {
  onSearch: (query: string) => void;
  onToggleLayers?: () => void;
  onToggleTime?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  apiOnline?: boolean;
  dbOnline?: boolean;
  modelActive?: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onSearch,
  onToggleLayers,
  onToggleTime,
  isDarkMode = false,
  onToggleTheme,
  apiOnline = true,
  dbOnline = true,
  modelActive = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleQuickPresetSearch = (preset: string) => {
    setSearchQuery(preset);
    onSearch(preset);
  };

  return (
    <header className="h-[70px] bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-xs sticky top-0 z-50 flex items-center px-4 sm:px-6">
      <div className="w-full flex items-center justify-between gap-4">
        
        {/* Left Side: Brand Logo & Title & Tagline */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-ocean-600 via-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-ocean-500/20 ring-1 ring-ocean-400/30">
            <Waves className="w-5 h-5 text-white animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">
                Ocean<span className="text-ocean-600">Sphere</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-ocean-50 border border-ocean-200 text-[10px] font-bold text-ocean-700 uppercase tracking-wider">
                v2.0 Operational
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 tracking-tight mt-0.5">
              Transforming Ocean Forecasts into Reliable Decisions
            </p>
          </div>
        </div>

        {/* Center: Global Search Box */}
        <div className="flex-1 max-w-xl mx-2 hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-ocean-600 transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search region, ocean, coordinates (e.g. 15.42° N, 68.21° E), country..."
              className="w-full pl-10 pr-24 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200/90 focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 outline-none transition-all shadow-inner"
            />
            <div className="absolute inset-y-0 right-1.5 flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleQuickPresetSearch('Arabian Sea')}
                className="px-2 py-0.5 text-[10px] font-semibold text-slate-500 hover:text-ocean-600 bg-slate-200/60 hover:bg-ocean-100 rounded-md transition-colors"
              >
                Arabian Sea
              </button>
              <button
                type="submit"
                className="px-2.5 py-1 text-[11px] font-bold text-white bg-ocean-600 hover:bg-ocean-700 rounded-lg shadow-xs transition-colors"
              >
                Go
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Operational Controls & Status Badges */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Quick Control Buttons */}
          <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200">
            <button
              onClick={onToggleLayers}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs font-semibold transition-all hover:scale-102"
              title="Toggle Layer Controls"
            >
              <Layers className="w-3.5 h-3.5 text-ocean-600" />
              <span className="hidden lg:inline">Layers</span>
            </button>

            <button
              onClick={onToggleTime}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs font-semibold transition-all hover:scale-102"
              title="Timeline Controls"
            >
              <Clock className="w-3.5 h-3.5 text-ocean-600" />
              <span className="hidden lg:inline">Time</span>
            </button>

            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 transition-colors"
              title="Theme Toggle"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
            </button>

            <button
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 transition-colors"
              title="System Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Telemetry Status Badges */}
          <div className="hidden xl:flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                apiOnline
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>API: Live</span>
            </div>

            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                dbOnline
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}
            >
              <Database className="w-3 h-3 text-blue-500" />
              <span>PostgreSQL</span>
            </div>

            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                modelActive
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Cpu className="w-3 h-3 text-indigo-500" />
              <span>GBR ML</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
