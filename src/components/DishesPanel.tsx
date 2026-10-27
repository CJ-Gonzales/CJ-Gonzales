import React from 'react';
import { GameState, Dish } from '../types/game';
import { Flame, Lock, CheckCircle2, TrendingUp, Sparkles, PlusCircle, ShoppingCart } from 'lucide-react';
import { PUREGOLD_INGREDIENTS } from '../data/initialGameData';
import { GAME_ASSETS } from '../assets/images';

interface DishesPanelProps {
  gameState: GameState;
  onCookDish: (dishId: string) => void;
  onUnlockDish: (dishId: string) => void;
  onUpgradeDish: (dishId: string) => void;
  onGoToPuregold: () => void;
}

export const DishesPanel: React.FC<DishesPanelProps> = ({
  gameState,
  onCookDish,
  onUnlockDish,
  onUpgradeDish,
  onGoToPuregold,
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Featured Banner with authentic culinary art */}
      <div className="relative rounded-xl overflow-hidden border-2 border-amber-900/60 shadow-xl bg-gradient-to-r from-[#2a170c] via-[#3a2012] to-[#201007] p-4 sm:p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/3 max-w-[280px] shrink-0 rounded-lg overflow-hidden border-2 border-amber-700/60 shadow-lg">
          <img
            src={GAME_ASSETS.karinderyaFoodSpread}
            alt="Lutong Bahay Pinoy Dishes"
            className="w-full h-44 object-cover filter brightness-105"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== window.location.origin + GAME_ASSETS.karinderyaFoodSpreadFallback) {
                target.src = GAME_ASSETS.karinderyaFoodSpreadFallback;
              }
            }}
          />
        </div>

        <div className="flex-1 space-y-2 text-stone-200">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Kusina ni Bossing Resipe & Menu</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-amber-200">
            Lutong Bahay: Mga Paboritong Ulam ng Sambayanang Pilipino
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            I-unlock ang mga kilalang putahe mula sa Classic Pork Adobo at Crispy Lechon Kawali hanggang sa Pansit Habhab ng Lucban, Mais Con Yelo, at Espesyal na Halo-Halo. I-upgrade ang iyong resipe upang mapataas ang benta at madagdagan ang kapasidad ng bawat kawali!
          </p>
        </div>
      </div>

      {/* Dishes Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(gameState.dishes).map((dish) => {
          const upgradeCost = Math.round(dish.cost * 12 * dish.level);
          const isMaxLevel = dish.level >= 5;
          const isSpecial = dish.id === gameState.dailySpecialDishId;
          const effectivePrice = isSpecial ? Math.round(dish.price * 1.2) : dish.price;

          return (
            <div
              key={dish.id}
              className={`rounded-xl p-4 flex flex-col justify-between shadow-lg transition-all relative ${
                isSpecial
                  ? 'border-[2.5px] border-amber-400 ring-4 ring-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.35)] bg-gradient-to-b from-[#3a2012] via-[#2c170d] to-[#1f0f08] transform hover:-translate-y-1'
                  : dish.unlocked
                  ? 'border border-amber-800/60 bg-[#25150d] hover:border-amber-600'
                  : 'border border-stone-800 bg-stone-950/70 opacity-80'
              }`}
            >
              {/* Unique Golden Ornate Corner Accents for Daily Special */}
              {isSpecial && (
                <>
                  <div className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-yellow-300 rounded-tl-xs pointer-events-none" />
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-yellow-300 rounded-tr-xs pointer-events-none" />
                  <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-yellow-300 rounded-bl-xs pointer-events-none" />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-yellow-300 rounded-br-xs pointer-events-none" />
                </>
              )}

              {/* Daily Special Golden Ribbon */}
              {isSpecial && (
                <div className="mb-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-stone-950 font-black text-[10.5px] px-2.5 py-1 rounded-md shadow-[0_2px_10px_rgba(245,158,11,0.4)] flex items-center justify-between border border-yellow-200">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-stone-950 animate-spin" style={{ animationDuration: '3s' }} />
                    <span className="tracking-wide">⭐ DAILY SPECIAL NGAYON</span>
                  </span>
                  <span className="font-mono font-black text-stone-950 bg-yellow-200/90 px-1.5 py-0.2 rounded shadow-xs">
                    +20% BENTA
                  </span>
                </div>
              )}

              {/* Card Top: Icon, Name & Level */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl filter drop-shadow">{dish.icon}</span>
                    <div>
                      <h3 className="font-bold text-amber-200 text-sm flex items-center gap-1">
                        <span>{dish.name}</span>
                        {isSpecial && <span className="text-amber-400 text-xs">⭐</span>}
                      </h3>
                      <div className="text-[11px] text-stone-400 italic">{dish.tagalogName}</div>
                    </div>
                  </div>

                  {dish.unlocked && (
                    <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700/60 px-2 py-0.5 rounded shrink-0">
                      Antas {dish.level}
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-300 mb-3 min-h-[34px] leading-relaxed">
                  {dish.description}
                </p>

                {/* Economics Specs */}
                <div className="bg-[#1b0e08] rounded-lg p-2.5 border border-amber-950 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between items-center text-stone-300">
                    <span className="text-stone-400">Puhunan (Cost):</span>
                    <span className="font-bold text-rose-400">₱{dish.cost}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-300">
                    <span className="text-stone-400">Presyo (Price):</span>
                    {isSpecial ? (
                      <span className="flex items-center gap-1">
                        <span className="line-through text-stone-500 text-[11px]">₱{dish.price}</span>
                        <span className="font-bold text-amber-300">₱{effectivePrice}</span>
                        <span className="text-[9px] text-emerald-400 font-bold">(+20%)</span>
                      </span>
                    ) : (
                      <span className="font-bold text-emerald-400">₱{dish.price}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-stone-300">
                    <span className="text-stone-400">Kita kada hain:</span>
                    <span className="font-bold text-amber-300">₱{effectivePrice - dish.cost}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-300 pt-1 border-t border-stone-800">
                    <span className="text-stone-400">Kasalukuyang Luto:</span>
                    <span className="font-bold text-white">
                      {dish.portions} / {dish.maxPortions} portions
                    </span>
                  </div>
                </div>

                {/* Puregold Ingredients Required Checklist */}
                {dish.unlocked && dish.requiredIngredients && dish.requiredIngredients.length > 0 && (
                  <div className="mt-2.5 bg-[#170c06] rounded-lg p-2 border border-emerald-900/60 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 mb-1">
                      <span>Kailangang Sangkap:</span>
                      <button
                        onClick={onGoToPuregold}
                        className="text-[10px] text-yellow-300 hover:text-yellow-200 underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <ShoppingCart className="w-2.5 h-2.5" />
                        <span>Bumili sa Puregold</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      {dish.requiredIngredients.map((req) => {
                        const ingInfo = PUREGOLD_INGREDIENTS[req.ingredientId];
                        const stock = gameState.inventory?.[req.ingredientId] || 0;
                        const hasEnough = stock >= req.quantity;

                        return (
                          <div
                            key={req.ingredientId}
                            className="flex items-center justify-between text-[11px] text-stone-300 font-mono"
                          >
                            <span className="flex items-center gap-1 truncate">
                              <span>{ingInfo?.icon || '📦'}</span>
                              <span className="truncate">{req.name}</span>
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                                hasEnough
                                  ? 'bg-emerald-950 text-emerald-300'
                                  : 'bg-rose-950 text-rose-300 animate-pulse'
                              }`}
                            >
                              {stock} mayroon
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-amber-900/40 space-y-2">
                {dish.unlocked ? (
                  <>
                    <button
                      onClick={() => onCookDish(dish.id)}
                      disabled={dish.cooking || gameState.money < dish.cost}
                      className={`w-full py-2 px-3 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                        dish.cooking
                          ? 'bg-amber-600 text-white animate-pulse'
                          : gameState.money >= dish.cost
                          ? 'bg-emerald-700 hover:bg-emerald-600 text-white shadow cursor-pointer'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>
                        {dish.cooking ? 'Kasalukuyang Niluluto...' : `Lutuin (₱${dish.cost})`}
                      </span>
                    </button>

                    <button
                      onClick={() => onUpgradeDish(dish.id)}
                      disabled={isMaxLevel || gameState.money < upgradeCost}
                      className={`w-full py-1.5 px-3 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                        isMaxLevel
                          ? 'bg-stone-900 text-stone-500 cursor-not-allowed'
                          : gameState.money >= upgradeCost
                          ? 'bg-amber-900/80 hover:bg-amber-800 border border-amber-600 text-amber-200 cursor-pointer'
                          : 'bg-stone-900 text-stone-500 border border-stone-800 cursor-not-allowed'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>
                        {isMaxLevel ? 'Pinaka-Masarap Na' : `Upgrade Resipe (₱${upgradeCost})`}
                      </span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onUnlockDish(dish.id)}
                    disabled={gameState.money < dish.unlockCost}
                    className={`w-full py-2 px-3 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                      gameState.money >= dish.unlockCost
                        ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow cursor-pointer font-bold'
                        : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>I-unlock sa Menu (₱{dish.unlockCost})</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
