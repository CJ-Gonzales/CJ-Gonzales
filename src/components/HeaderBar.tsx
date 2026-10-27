import React from 'react';
import { ShiftTime, Dish } from '../types/game';
import { Volume2, VolumeX, Play, Pause, FastForward, HelpCircle, Trophy, Sparkles } from 'lucide-react';

interface HeaderBarProps {
  carinderiaName: string;
  money: number;
  reputation: number;
  day: number;
  shift: ShiftTime;
  shiftProgress: number;
  isPaused: boolean;
  gameSpeed: number;
  soundEnabled: boolean;
  activeTab: string;
  dailySpecialDish?: Dish | null;
  onSelectTab: (tab: string) => void;
  onTogglePause: () => void;
  onToggleSpeed: () => void;
  onToggleSound: () => void;
  onOpenTutorial: () => void;
  onOpenAchievements: () => void;
  onRenameCarinderia: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  carinderiaName,
  money,
  reputation,
  day,
  shift,
  shiftProgress,
  isPaused,
  gameSpeed,
  soundEnabled,
  activeTab,
  dailySpecialDish,
  onSelectTab,
  onTogglePause,
  onToggleSpeed,
  onToggleSound,
  onOpenTutorial,
  onOpenAchievements,
  onRenameCarinderia,
}) => {
  const shiftLabels: Record<ShiftTime, { name: string; hours: string; color: string }> = {
    ALMUSAL: { name: 'Almusal (Breakfast)', hours: '7:00 AM - 11:00 AM', color: 'text-amber-300' },
    TANGHALIAN: { name: 'Tanghalian (Lunch Rush!)', hours: '11:00 AM - 2:00 PM', color: 'text-emerald-400 font-bold' },
    MERIENDA: { name: 'Merienda (Snacks)', hours: '2:00 PM - 5:00 PM', color: 'text-orange-300' },
    HAPUNAN: { name: 'Hapunan (Dinner Rush!)', hours: '5:00 PM - 9:00 PM', color: 'text-rose-400 font-bold' },
  };

  const navItems = [
    { id: 'scene', label: 'Kusina & Mesa' },
    { id: 'dishes', label: 'Menu ng Ulam' },
    { id: 'puregold', label: '🛒 Puregold Grocery' },
    { id: 'staff', label: 'Mga Tauhan' },
    { id: 'decor', label: '🏗️ Wilcon Depot' },
    { id: 'report', label: 'Ulat & Benta' },
  ];

  return (
    <header className="w-full bg-[#27170e] text-amber-50 border-b border-amber-900/60 shadow-lg sticky top-0 z-40">
      {/* Zone 1, 2, 3 Main Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-6 md:gap-8">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRenameCarinderia}
            className="text-left text-lg md:text-xl font-bold tracking-tight text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap flex items-center gap-2 group cursor-pointer"
            title="Pindutin para palitan ang pangalan ng Karinderya"
          >
            <span>🍛 {carinderiaName}</span>
            <span className="text-xs text-amber-500/70 group-hover:text-amber-400 transition-opacity">✎</span>
          </button>
        </div>

        {/* Zone 2: 4-5 Clean single-line nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 border-b-2 ${
                  isActive
                    ? 'border-amber-400 text-amber-300 font-semibold'
                    : 'border-transparent text-amber-100/70 hover:text-amber-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary action & quick controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleSpeed}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-800/80 text-amber-200 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
            title="Bilis ng laro (1x o 2x)"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span className="font-mono">{gameSpeed}x</span>
          </button>

          <button
            onClick={onTogglePause}
            className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              isPaused
                ? 'bg-amber-500 text-stone-950 border-amber-400 animate-pulse'
                : 'bg-amber-950/80 hover:bg-amber-900 border-amber-800/80 text-amber-200'
            }`}
            title={isPaused ? 'Ipagpatuloy ang laro' : 'I-pause ang laro'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Ituloy' : 'Pause'}</span>
          </button>

          <button
            onClick={onToggleSound}
            className="p-1.5 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-800/80 text-amber-200 transition-colors cursor-pointer"
            title={soundEnabled ? 'I-mute ang tunog' : 'Buhayin ang tunog'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>

          <button
            onClick={onOpenAchievements}
            className="p-1.5 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-800/80 text-amber-300 transition-colors cursor-pointer"
            title="Mga Nakamit at Parangal"
          >
            <Trophy className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenTutorial}
            className="p-1.5 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-800/80 text-amber-300 transition-colors cursor-pointer"
            title="Gabay sa Paglalaro"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav bar for smaller screens */}
      <div className="lg:hidden flex items-center justify-between px-3 py-1.5 bg-[#1f120a] border-t border-amber-950 overflow-x-auto gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`text-xs px-2.5 py-1 rounded whitespace-nowrap shrink-0 transition-colors ${
              activeTab === item.id
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'text-amber-200/80 hover:bg-amber-950'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Secondary Status & Ledger Bar */}
      <div className="bg-[#190d07] border-t border-amber-950/80 px-4 sm:px-6 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-medium">
          {/* Pera & Suki Star Rating */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-700/60 px-3 py-1 rounded text-emerald-300">
              <span className="text-emerald-400 font-bold">Pera:</span>
              <span className="font-mono tabular-nums text-sm font-bold text-white">₱{money.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-950/60 border border-amber-700/60 px-3 py-1 rounded text-amber-300">
              <span>Suki Rep:</span>
              <span className="font-mono tabular-nums text-sm font-bold text-amber-200">⭐ {reputation}</span>
              <span className="text-[10px] text-amber-400/80">/100</span>
            </div>

            {/* Daily Special Highlight in Header */}
            {dailySpecialDish && (
              <button
                onClick={() => onSelectTab('scene')}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/50 hover:border-amber-400 px-2.5 py-1 rounded text-amber-200 transition-colors cursor-pointer group"
                title={`Espesyal Ngayong Araw: ${dailySpecialDish.name} - May dagdag +20% na kita kapag naibenta sa suki!`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span className="text-amber-300 font-bold text-[11px]">Daily Special:</span>
                <span className="font-semibold text-white flex items-center gap-1 text-[11px]">
                  <span>{dailySpecialDish.icon}</span>
                  <span className="truncate max-w-[110px]">{dailySpecialDish.name}</span>
                </span>
                <span className="bg-amber-500 text-stone-950 font-black text-[9px] px-1 py-0.2 rounded font-mono">
                  +20% Presyo
                </span>
              </button>
            )}
          </div>

          {/* Day & Shift with Progress */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-stone-300">
              <span className="font-bold text-amber-400">Araw {day}</span>
              <span className="text-stone-500">·</span>
              <span className={shiftLabels[shift].color}>{shiftLabels[shift].name}</span>
            </div>

            <div className="w-24 sm:w-32 bg-stone-900 border border-amber-900/50 rounded-full h-2 overflow-hidden" title={`Oras: ${Math.round(shiftProgress)}%`}>
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, shiftProgress))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
