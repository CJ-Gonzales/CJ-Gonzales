import React from 'react';
import { Dish } from '../types/game';
import { Sparkles, Flame, ChefHat } from 'lucide-react';

interface ChalkboardDailySpecialProps {
  specialDish: Dish | null;
  onCookDish?: (dishId: string) => void;
  onShowToast?: (msg: string) => void;
  canAfford?: boolean;
}

export const ChalkboardDailySpecial: React.FC<ChalkboardDailySpecialProps> = ({
  specialDish,
  onCookDish,
  onShowToast,
  canAfford = true,
}) => {
  if (!specialDish) return null;

  const boostedPrice = Math.round(specialDish.price * 1.2);
  const isCooking = specialDish.cooking;
  const isLow = specialDish.portions <= 2;
  const isEmpty = specialDish.portions === 0;

  const handleClick = () => {
    if (onShowToast) {
      onShowToast(
        `⭐ Espesyal Ngayong Araw: ${specialDish.name}! Benta: ₱${boostedPrice} (+20% kita).`
      );
    }
  };

  const handleCook = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCookDish) {
      onCookDish(specialDish.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer select-none transition-all duration-300 hover:scale-[1.02]"
      title="Pisara ng Ulam: Pindutin para magluto ng Espesyal Ngayong Araw"
    >
      {/* Hanging Twine String at Top */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-amber-700 border border-amber-950 shadow-sm" />
        <div className="w-0.5 h-3 bg-amber-800/80 -mt-0.5" />
      </div>

      {/* Wooden Frame */}
      <div className="relative rounded-lg p-1.5 bg-gradient-to-br from-[#6b3e1f] via-[#4d2c14] to-[#3a1f0c] border-[3px] border-[#341b0b] shadow-[0_6px_20px_rgba(0,0,0,0.6)]">
        {/* Brass Corner Accents */}
        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-amber-400 rounded-tl-xs border border-amber-600/70" />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-tr-xs border border-amber-600/70" />
        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-amber-400 rounded-bl-xs border border-amber-600/70" />
        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-br-xs border border-amber-600/70" />

        {/* Chalkboard Slate Surface */}
        <div className="relative rounded bg-[#17201e] border border-white/20 px-3 py-2 text-stone-100 flex flex-col justify-between shadow-inner min-w-[200px] max-w-[240px]">
          {/* Subtle Chalk Dust Overlay */}
          <div className="absolute inset-0 bg-radial from-white/[0.04] to-transparent pointer-events-none rounded" />

          {/* Chalkboard Header */}
          <div className="relative text-center border-b border-white/20 pb-1 mb-1.5">
            <div className="flex items-center justify-center gap-1 text-[9px] font-extrabold tracking-widest uppercase text-amber-300 font-mono">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              <span>SPECIAL NGAYON</span>
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            </div>
            <div className="text-[7.5px] text-stone-300/80 italic font-serif tracking-tight">
              Pisara ng Karinderya · +20% Benta
            </div>
          </div>

          {/* Dish Feature Row */}
          <div className="relative flex items-center gap-2.5 my-0.5">
            {/* Dish Icon with Chalk Plate Ring */}
            <div className="relative w-10 h-10 rounded-full border-2 border-dashed border-amber-300/70 bg-stone-900/60 flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-6 transition-transform">
              <span className="text-2xl filter drop-shadow">{specialDish.icon}</span>
            </div>

            {/* Dish Information */}
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-xs text-white truncate leading-tight font-sans">
                {specialDish.name}
              </h4>
              <p className="text-[9px] text-stone-300/80 truncate italic">
                {specialDish.tagalogName}
              </p>

              {/* Price Row: Regular crossed out -> Boosted Yellow Chalk */}
              <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[11px]">
                <span className="line-through text-stone-400 text-[10px]">₱{specialDish.price}</span>
                <span className="font-extrabold text-amber-300 text-xs">₱{boostedPrice}</span>
                <span className="text-[8px] font-black bg-amber-400 text-stone-950 px-1 rounded">
                  +20%
                </span>
              </div>
            </div>
          </div>

          {/* Portions & Cook Shortcut */}
          <div className="relative mt-2 pt-1.5 border-t border-white/15 flex items-center justify-between gap-1 text-[10px]">
            {/* Portions Count */}
            <div className="flex items-center gap-1 font-mono">
              <span
                className={`font-bold ${
                  isEmpty
                    ? 'text-rose-400 animate-pulse'
                    : isLow
                    ? 'text-amber-300'
                    : 'text-emerald-300'
                }`}
              >
                {specialDish.portions} / {specialDish.maxPortions}
              </span>
              <span className="text-[9px] text-stone-400">hain</span>
            </div>

            {/* Quick Cook Button */}
            <button
              onClick={handleCook}
              disabled={isCooking || !canAfford}
              className={`px-2 py-0.5 rounded text-[9.5px] font-bold transition-all flex items-center gap-1 shadow ${
                isCooking
                  ? 'bg-amber-600 text-white animate-pulse'
                  : canAfford
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 active:scale-95 cursor-pointer font-black'
                  : 'bg-stone-800 text-stone-500 cursor-not-allowed'
              }`}
              title={`Magluto ng ${specialDish.name} (₱${specialDish.cost})`}
            >
              {isCooking ? (
                <>
                  <Flame className="w-2.5 h-2.5 animate-spin" />
                  <span>Luluto...</span>
                </>
              ) : (
                <>
                  <ChefHat className="w-2.5 h-2.5" />
                  <span>Luto ₱{specialDish.cost}</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom Chalk Tray & Chalk Stick */}
          <div className="relative mt-1.5 -mx-1.5 pt-1 border-t-2 border-[#3d200e] flex items-center justify-between px-1.5">
            <div className="w-5 h-1 bg-white/80 rounded-full shadow-xs" title="Chalk" />
            <div className="w-2 h-1 bg-yellow-200/90 rounded-full shadow-xs" title="Yellow Chalk" />
          </div>
        </div>
      </div>
    </div>
  );
};
