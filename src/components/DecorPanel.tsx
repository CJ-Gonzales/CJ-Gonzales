import React, { useState } from 'react';
import { GameState, DecorItem } from '../types/game';
import { Check, Plus, Sparkles, Wind, Droplets, Music, Flame, Wrench, ShieldCheck, Tag } from 'lucide-react';

interface DecorPanelProps {
  gameState: GameState;
  onBuyDecor: (decorId: string) => void;
  onUnlockTable: (tableIndex: number) => void;
}

type DecorCategoryFilter = 'all' | 'comfort' | 'facility' | 'ambiance' | 'marketing' | 'entertainment';

export const DecorPanel: React.FC<DecorPanelProps> = ({
  gameState,
  onBuyDecor,
  onUnlockTable,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DecorCategoryFilter>('all');
  const lockedTables = gameState.tables.filter((t) => t.locked);

  const decorItems = Object.values(gameState.decor);
  const filteredItems = selectedCategory === 'all'
    ? decorItems
    : decorItems.filter((item) => item.category === selectedCategory);

  const boughtCount = decorItems.filter((i) => i.bought).length;
  const totalCount = decorItems.length;

  const categories: Array<{ id: DecorCategoryFilter; label: string; icon: string }> = [
    { id: 'all', label: 'Lahat ng Kagamitan', icon: '🏗️' },
    { id: 'facility', label: 'Kusina & Sanitaries', icon: '🌪️' },
    { id: 'comfort', label: 'Tiles, Silya & Silong', icon: '🧱' },
    { id: 'ambiance', label: 'Tugtog & Halaman', icon: '🪴' },
    { id: 'marketing', label: 'Ilaw & Tarpulin', icon: '💡' },
    { id: 'entertainment', label: 'Videoke Machine', icon: '🎤' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Wilcon Depot Iconic Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-orange-500/70 bg-gradient-to-r from-[#2a1306] via-[#3a1b0b] to-[#1c0c04] p-5 sm:p-6 shadow-2xl">
        {/* Decorative background accents */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-orange-600/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            {/* Wilcon Depot Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-black px-3 py-1 rounded-md shadow-md uppercase tracking-wider">
                <Wrench className="w-3.5 h-3.5" />
                <span>WILCON DEPOT</span>
              </span>
              <span className="text-[11px] font-bold text-orange-300 bg-orange-950/80 border border-orange-700/60 px-2 py-0.5 rounded">
                Building Big Ideas para sa Karinderya
              </span>
              <span className="text-[11px] font-semibold text-stone-400">
                Pasilidad & Finishings
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-amber-100 tracking-tight">
              Kagamitan, Tiles, Exhaust & Dekorasyon ng Kusina
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Mula sa makintab na Spanish floor tiles, heavy-duty stainless exhaust hood, acrylic sneeze guard, trapal awning hanggang sa Orocan tubig dispenser at videoke. Gawing primera-klase ang iyong kainan!
            </p>
          </div>

          {/* Wilcon Depot Loyalty & Status Card */}
          <div className="shrink-0 bg-[#1e0f06]/90 border border-orange-500/40 rounded-xl p-3 sm:p-3.5 flex flex-col gap-1.5 shadow-lg min-w-[210px]">
            <div className="flex items-center justify-between text-xs text-orange-300 font-bold">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>Wilcon Depot Suki</span>
              </span>
              <span className="font-mono text-white text-xs font-black">{boughtCount}/{totalCount} Nabili</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden border border-orange-900/60">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                style={{ width: `${(boughtCount / Math.max(1, totalCount)) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-stone-400 pt-0.5">
              <span>Badyet: <span className="font-mono font-bold text-emerald-400">₱{gameState.money.toLocaleString()}</span></span>
              <span>Reputasyon: <span className="font-mono font-bold text-amber-300">⭐ {gameState.reputation}</span></span>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="relative z-10 mt-5 pt-4 border-t border-orange-900/40 flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-950 scale-102 border border-orange-400'
                  : 'bg-[#221006] text-stone-300 hover:bg-[#2c1508] border border-orange-950 hover:text-amber-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Wilcon Monobloc Tables Expansion Section */}
      {lockedTables.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 uppercase tracking-wide">
              <span>🪑 Wilcon Monobloc Tables & Upuan Expansion</span>
              <span className="text-xs text-orange-400 font-semibold bg-orange-950/60 border border-orange-800/60 px-2 py-0.5 rounded">
                {6 - lockedTables.length}/6 Mesa Bukas
              </span>
            </h3>
            <span className="text-xs text-stone-400">
              Mula sa Wilcon Outdoor & Dining Section
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {lockedTables.map((table) => (
              <div
                key={table.id}
                className="bg-gradient-to-b from-[#26150d] to-[#1c0f08] border border-orange-900/60 hover:border-orange-600/80 rounded-xl p-3.5 flex flex-col justify-between shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🪑</span>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-700/60 px-2 py-0.5 rounded">
                      ₱{table.unlockCost}
                    </span>
                  </div>
                  <h4 className="font-bold text-amber-200 text-sm">{table.label}</h4>
                  <p className="text-xs text-stone-300 mt-1">
                    Matibay na Uratex/Orocan green monobloc mesa at 2 silya mula sa Wilcon para makaupo agad ang dumarating na suki.
                  </p>
                </div>

                <button
                  onClick={() => onUnlockTable(table.id)}
                  disabled={gameState.money < table.unlockCost}
                  className={`mt-3 w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow ${
                    gameState.money >= table.unlockCost
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white cursor-pointer active:scale-98'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Buksan ang Mesa (₱{table.unlockCost})</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wilcon Depot Fixtures, Appliances & Decor Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 uppercase tracking-wide">
            <span>✨ Mga Kagamitan at Pasilidad mula sa Wilcon Depot ({filteredItems.length})</span>
          </h3>
          <span className="text-xs text-stone-400">
            Pindutin ang bilihin para i-install sa karinderya
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isWilconItem = item.name.toLowerCase().includes('wilcon');

            return (
              <div
                key={item.id}
                className={`relative rounded-xl border p-4 flex flex-col justify-between shadow-lg transition-all ${
                  item.bought
                    ? 'bg-gradient-to-b from-[#1e1109] to-[#150a04] border-emerald-700/60 shadow-emerald-950/20'
                    : 'bg-gradient-to-b from-[#27140b] to-[#1d0e06] border-orange-900/60 hover:border-orange-500/80 hover:shadow-orange-950/30'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#190d07] border border-orange-900/60 flex items-center justify-center text-3xl filter drop-shadow">
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-amber-200 text-sm leading-snug">{item.name}</h4>
                        </div>
                        <div className="text-[11px] text-orange-300/80 italic mt-0.5">{item.tagline}</div>
                      </div>
                    </div>

                    {item.bought ? (
                      <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-600 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        <Check className="w-3 h-3" />
                        <span>Nabili Na</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-600/80 px-2.5 py-0.5 rounded-full shrink-0">
                        ₱{item.cost}
                      </span>
                    )}
                  </div>

                  {/* Benefit / Effect description box */}
                  <div className="my-2.5 p-2.5 bg-[#170c06] rounded-lg border border-orange-950/80 text-xs text-amber-300/90 font-medium leading-relaxed flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                    <span>{item.effect}</span>
                  </div>

                  {/* Category Tag */}
                  <div className="flex items-center gap-2 text-[10px] text-stone-400">
                    <span className="bg-[#1f1007] border border-stone-800 px-2 py-0.5 rounded text-stone-300 font-semibold capitalize">
                      {item.category === 'facility' && '🔧 Sanitaries & Kitchen'}
                      {item.category === 'comfort' && '🧱 Finishings & Comfort'}
                      {item.category === 'ambiance' && '🎵 Ambiance & Greenery'}
                      {item.category === 'marketing' && '💡 Lighting & Signage'}
                      {item.category === 'entertainment' && '🎤 Sound & Entertainment'}
                    </span>
                    {isWilconItem && (
                      <span className="text-orange-400 font-bold flex items-center gap-0.5">
                        <Tag className="w-3 h-3" />
                        <span>Wilcon Brand</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-orange-900/40">
                  {item.bought ? (
                    <div className="text-xs text-center font-semibold text-emerald-400 py-1 flex items-center justify-center gap-1.5 bg-emerald-950/30 rounded border border-emerald-900/50">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Naka-install at Aktibo sa Kusina</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onBuyDecor(item.id)}
                      disabled={gameState.money < item.cost}
                      className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow ${
                        gameState.money >= item.cost
                          ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-stone-950 cursor-pointer active:scale-98 font-black'
                          : 'bg-stone-800/80 text-stone-500 cursor-not-allowed border border-stone-700/50'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Bilihin sa Wilcon (₱{item.cost})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wilcon Depot Construction & Store Perks Advisory */}
      <div className="rounded-xl border border-orange-800/40 bg-[#1e0e06]/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-300">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-lg shrink-0">
            🏗️
          </div>
          <div>
            <div className="font-bold text-orange-300">Tip ng Wilcon Depot Contractor:</div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              Ang pagbili ng <strong className="text-amber-200">Ceramic Tiles</strong> at <strong className="text-amber-200">Stainless Exhaust Hood</strong> ay nagpapalinis ng sahig at nagpapanatili ng sariwang hangin upang hindi agad mainip ang iyong mga suki sa lunch rush!
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 text-[11px] text-orange-400 font-bold bg-orange-950/60 border border-orange-800/80 px-3 py-1.5 rounded-lg">
          <span>🔨 "Building Big Ideas"</span>
        </div>
      </div>
    </div>
  );
};
