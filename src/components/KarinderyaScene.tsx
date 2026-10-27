import React, { useState } from 'react';
import { GameState, TableSpot, Dish, Customer } from '../types/game';
import { sound } from '../utils/audio';
import { Flame, Sparkles, AlertCircle, Droplets, Utensils, Music, Wind } from 'lucide-react';
import { ChalkboardDailySpecial } from './ChalkboardDailySpecial';
import { GAME_ASSETS } from '../assets/images';

export const getCustomerMood = (customer: Customer) => {
  if (customer.state === 'eating') {
    return {
      icon: '😋',
      label: 'Masarap!',
      badgeColor: 'bg-amber-950/90 border-amber-400 text-amber-300 shadow-amber-950/60',
      textColor: 'text-amber-300',
      pulse: false,
    };
  }

  const pct = (customer.patience / (customer.maxPatience || 100)) * 100;

  if (pct > 60) {
    return {
      icon: '😊',
      label: 'Masaya',
      badgeColor: 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-emerald-950/60',
      textColor: 'text-emerald-400',
      pulse: false,
    };
  }

  if (pct > 25) {
    return {
      icon: '🤤',
      label: 'Gutom na',
      badgeColor: 'bg-amber-950/90 border-amber-500 text-amber-300 shadow-amber-950/60',
      textColor: 'text-amber-400',
      pulse: false,
    };
  }

  return {
    icon: '😤',
    label: 'Naiinip!',
    badgeColor: 'bg-rose-950 border-rose-500 text-rose-200 shadow-rose-950/80',
    textColor: 'text-rose-400 font-bold',
    pulse: true,
  };
};

interface KarinderyaSceneProps {
  gameState: GameState;
  onCookDish: (dishId: string) => void;
  onServeCustomer: (tableIndex: number, event?: React.MouseEvent) => void;
  onCleanTable: (tableIndex: number, event?: React.MouseEvent) => void;
  onGiveWater: (tableIndex: number) => void;
  onUnlockTable: (tableIndex: number) => void;
  onPetCat: (event: React.MouseEvent) => void;
  onToggleRadio: () => void;
  onChangeFanSpeed: () => void;
  onShowToast: (msg: string) => void;
  floatingTexts: Array<{ id: number; text: string; x: number; y: number; color?: string }>;
  onGoToPuregold: () => void;
}

export const KarinderyaScene: React.FC<KarinderyaSceneProps> = ({
  gameState,
  onCookDish,
  onServeCustomer,
  onCleanTable,
  onGiveWater,
  onUnlockTable,
  onPetCat,
  onToggleRadio,
  onChangeFanSpeed,
  onShowToast,
  floatingTexts,
  onGoToPuregold,
}) => {
  const [catHeart, setCatHeart] = useState(false);

  const handlePet = (e: React.MouseEvent) => {
    setCatHeart(true);
    setTimeout(() => setCatHeart(false), 800);
    onPetCat(e);
  };

  const hasFan = Boolean(gameState.decor?.standFan?.bought);
  const hasRadio = Boolean(gameState.decor?.radio?.bought);
  const hasWaterJug = Boolean(gameState.decor?.orocanJug?.bought);
  const hasBawalUmutang = Boolean(gameState.decor?.bawalUmutang?.bought);
  const hasVideoke = Boolean(gameState.decor?.videokeBox?.bought);
  const hasAwning = Boolean(gameState.decor?.bambooAwning?.bought);
  const hasExhaust = Boolean(gameState.decor?.exhaustHood?.bought);
  const hasTiles = Boolean(gameState.decor?.graniteTiles?.bought);
  const hasSneezeGuard = Boolean(gameState.decor?.acrylicSneezeGuard?.bought);
  const hasPlants = Boolean(gameState.decor?.pottedSanFrancisco?.bought);
  const hasEmergencyLight = Boolean(gameState.decor?.emergencyLight?.bought);
  const hasFlyTrap = Boolean(gameState.decor?.flyTrapZapper?.bought);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border-4 border-[#3e2723] bg-[#22150e] shadow-2xl select-none">
      {/* 2D Scenic Background Layer */}
      <div className="relative w-full h-[440px] md:h-[480px] overflow-hidden">
        {/* Backdrop Image - Bundled permanently for all shared links & deployments */}
        <img
          src={GAME_ASSETS.karinderyaStreetBackdrop}
          alt="Karinderya Exterior with Jeepney"
          className="w-full h-full object-cover object-center filter brightness-95"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== window.location.origin + GAME_ASSETS.karinderyaStreetBackdropFallback) {
              target.src = GAME_ASSETS.karinderyaStreetBackdropFallback;
            }
          }}
        />

        {/* Semi-transparent warm awning scrim & interior shading for restaurant floor */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#20130c] via-[#20130c]/70 to-transparent pointer-events-none" />

        {/* Wilcon Heavy-Duty Trapal & Awning Canopy at the top edge */}
        {hasAwning && (
          <div
            onClick={() => onShowToast('🎪 Wilcon Heavy-Duty Awning: Protektado ang mga suki laban sa ulan at init ng araw!')}
            className="absolute top-0 left-0 right-0 z-30 flex flex-col cursor-pointer group"
            title="Wilcon Heavy-Duty Trapal & Awning Canopy (Pindutin para sa detalye)"
          >
            {/* Striped Canopy Roof */}
            <div
              className="h-6 sm:h-7 w-full shadow-lg border-b-2 border-orange-950 flex items-center justify-between px-3"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, #dc2626 0px, #dc2626 22px, #fef3c7 22px, #fef3c7 44px, #ea580c 44px, #ea580c 66px, #fef3c7 66px, #fef3c7 88px)',
              }}
            >
              <div className="bg-orange-950/85 text-amber-200 border border-orange-500/80 px-2 py-0.5 rounded text-[9px] font-black tracking-wider flex items-center gap-1 shadow">
                <span>🎪</span>
                <span>WILCON CANOPY</span>
              </div>
              <span className="text-[9px] font-bold text-stone-900 bg-amber-100/90 px-1.5 py-0.2 rounded font-mono shadow-xs hidden sm:inline">
                Silong ng Suki
              </span>
            </div>
            {/* Scalloped Valence Bottom Edge */}
            <div
              className="h-2.5 w-full -mt-0.5"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 10px 0px, transparent 8px, #dc2626 9px)',
                backgroundSize: '20px 10px',
              }}
            />
          </div>
        )}

        {/* Ambient Top Ceiling & Wall Props */}
        <div className={`absolute left-4 z-20 flex items-start gap-2.5 flex-wrap ${hasAwning ? 'top-9' : 'top-3'}`}>
          {/* Barangay Fiesta Calendar */}
          <div
            onClick={() => onShowToast(`Araw ${gameState.day} ng Karinderya Fiesta! Maraming gutom na suki.`)}
            className="w-13 sm:w-14 bg-amber-50 border-2 border-red-700 rounded shadow-md text-center cursor-pointer hover:scale-105 transition-transform shrink-0"
            title="Barangay Fiesta Calendar - Pindutin para sa impormasyon"
          >
            <div className="bg-red-700 text-white text-[8px] sm:text-[9px] font-bold py-0.5 tracking-wider">MAYO 2026</div>
            <div className="text-lg sm:text-xl font-extrabold text-stone-900 py-0.5 font-mono">{gameState.day}</div>
            <div className="text-[8px] bg-red-100 text-red-800 font-semibold uppercase">Fiesta</div>
          </div>

          {/* Hanging Chichirya / Snacks Rack */}
          <div
            onClick={() => {
              sound.playClean();
              onShowToast('Nakatambay na Chichirya: Chicharon, Nagaraya, at Mani!');
            }}
            className="hidden sm:flex gap-1.5 p-1 bg-stone-900/60 rounded border border-amber-900/40 backdrop-blur-xs cursor-pointer hover:brightness-110 transition-all shrink-0"
            title="Sitsirya at snacks na nakabitin sa nylon string"
          >
            <div className="w-5 h-8 bg-red-600 rounded-xs flex items-center justify-center text-[7px] text-white font-bold shadow rotate-[-4deg]">
              🌶️
            </div>
            <div className="w-5 h-8 bg-yellow-500 rounded-xs flex items-center justify-center text-[7px] text-stone-900 font-bold shadow rotate-[3deg]">
              🥜
            </div>
            <div className="w-5 h-8 bg-blue-600 rounded-xs flex items-center justify-center text-[7px] text-white font-bold shadow rotate-[-2deg]">
              🍿
            </div>
          </div>

          {/* "Bawal Umutang" sign if unlocked */}
          {hasBawalUmutang && (
            <div
              onClick={() => onShowToast('"Bawal Umutang: Bukas na lang pwede!" - Bossing')}
              className="bg-amber-900 text-amber-100 border border-amber-600 px-2 py-1 rounded text-[10px] font-bold shadow-md cursor-pointer hover:bg-amber-800 shrink-0"
              title="Pinoy Karinderya Classic Signboard"
            >
              📜 BAWAL UMUTANG
            </div>
          )}

          {/* Wilcon LED Emergency Light Fixture */}
          {hasEmergencyLight && (
            <div
              onClick={() => {
                sound.playClick();
                onShowToast('💡 Wilcon Emergency Lamp: Laging handa laban sa brownout at maliwanag sa hapunan!');
              }}
              className="flex items-center gap-1.5 bg-stone-950/90 border border-amber-500/80 px-2 py-1 rounded shadow-md cursor-pointer hover:border-amber-400 transition-all shrink-0"
              title="Wilcon Heavy-Duty LED Emergency Lamp"
            >
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-amber-300 text-xs">💡</span>
              </div>
              <div className="text-[9px] leading-tight text-stone-200">
                <div className="font-bold text-amber-300">Wilcon LED</div>
                <div className="text-[8px] text-emerald-400 font-mono">AC POWER OK</div>
              </div>
            </div>
          )}

          {/* Wilcon UV Insect & Fly Zapper */}
          {hasFlyTrap && (
            <div
              onClick={() => {
                sound.playClean();
                onShowToast('⚡ Wilcon UV Insect Zapper: Bzzzt! Walang makakalapit na langaw sa ulam!');
              }}
              className="flex items-center gap-1.5 bg-indigo-950/90 border border-violet-500/80 px-2 py-1 rounded shadow-md cursor-pointer hover:border-violet-400 transition-all shrink-0 animate-pulse"
              title="Wilcon Electronic UV Bug & Fly Zapper"
            >
              <span className="text-xs">⚡</span>
              <div className="text-[9px] leading-tight text-violet-200">
                <div className="font-bold text-violet-300">UV Zapper</div>
                <div className="text-[8px] text-cyan-300 font-mono">Langaw-Free</div>
              </div>
            </div>
          )}
        </div>

        {/* Real Karinderya Hanging Chalkboard for Daily Special */}
        {gameState.dailySpecialDishId && gameState.dishes[gameState.dailySpecialDishId] && (
          <div className={`absolute left-1/2 -translate-x-1/2 z-25 scale-90 sm:scale-95 md:scale-100 origin-top ${hasAwning ? 'top-8' : 'top-2'}`}>
            <ChalkboardDailySpecial
              specialDish={gameState.dishes[gameState.dailySpecialDishId]}
              onCookDish={onCookDish}
              onShowToast={onShowToast}
              canAfford={gameState.money >= gameState.dishes[gameState.dailySpecialDishId].cost}
            />
          </div>
        )}

        {/* Top Right Wall Props: Stand Fan, AM Radio, Orocan Water */}
        <div className={`absolute right-4 z-20 flex items-center gap-2 sm:gap-3 flex-wrap justify-end ${hasAwning ? 'top-8' : 'top-3'}`}>
          {/* Orocan Ice Water Station */}
          {hasWaterJug && (
            <div
              onClick={() => {
                sound.playWater();
                onShowToast('Malamig na Tubig: Libre sa bawat kumakain!');
              }}
              className="flex items-center gap-1.5 bg-blue-950/80 border border-blue-600/70 text-blue-200 px-2.5 py-1.5 rounded-lg shadow-lg cursor-pointer hover:bg-blue-900 transition-colors"
              title="Orocan Tubig Libre Dispenser (Pindutin para mag-salok)"
            >
              <Droplets className="w-4 h-4 text-cyan-400" />
              <div className="text-[11px] leading-tight">
                <div className="font-bold text-white">Tubig Libre</div>
                <div className="text-[9px] text-cyan-300">Orocan Jug</div>
              </div>
            </div>
          )}

          {/* Vintage AM Radio */}
          {hasRadio && (
            <button
              onClick={onToggleRadio}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border shadow-lg cursor-pointer transition-all ${
                gameState.radioPlaying
                  ? 'bg-amber-700 border-amber-400 text-white animate-pulse'
                  : 'bg-stone-900/80 border-stone-700 text-stone-300 hover:bg-stone-800'
              }`}
              title="AM Transistor Radio - Pindutin para magpatugtog"
            >
              <Music className="w-4 h-4 text-amber-300" />
              <div className="text-[11px] leading-tight text-left">
                <div className="font-bold">AM Radio</div>
                <div className="text-[9px] opacity-80">{gameState.radioPlaying ? 'Tugtog On ♪' : 'Patay'}</div>
              </div>
            </button>
          )}

          {/* Standard Electric Stand Fan */}
          {hasFan && (
            <button
              onClick={onChangeFanSpeed}
              className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-600/70 text-emerald-200 px-2.5 py-1.5 rounded-lg shadow-lg cursor-pointer hover:bg-emerald-900 transition-colors"
              title="Standard Electric Fan (Pindutin para ilipat ang Number 1, 2, 3)"
            >
              <div className="relative">
                <Wind
                  className={`w-5 h-5 text-emerald-300 ${
                    gameState.fanSpeed === 3
                      ? 'animate-fan-fast'
                      : gameState.fanSpeed === 2
                      ? 'animate-fan-medium'
                      : gameState.fanSpeed === 1
                      ? 'animate-fan-slow'
                      : ''
                  }`}
                />
              </div>
              <div className="text-[11px] leading-tight text-left">
                <div className="font-bold text-white">Stand Fan</div>
                <div className="text-[9px] text-emerald-300 font-mono">
                  {gameState.fanSpeed === 0 ? 'Off' : `No. ${gameState.fanSpeed} Speed`}
                </div>
              </div>
            </button>
          )}

          {/* Videoke Machine if unlocked */}
          {hasVideoke && (
            <div
              onClick={() => {
                sound.playFanfare();
                onShowToast('🎤 Videoke Machine: Score 99! "My Way" ni Kapitan!');
              }}
              className="hidden sm:flex items-center gap-1.5 bg-purple-950/80 border border-purple-500 text-purple-200 px-2.5 py-1.5 rounded-lg shadow-lg cursor-pointer hover:bg-purple-900 transition-colors"
              title="Birit King Videoke Machine"
            >
              <span className="text-sm">🎤</span>
              <div className="text-[11px] leading-tight">
                <div className="font-bold text-white">Videoke</div>
                <div className="text-[9px] text-purple-300">₱5 / Kanta</div>
              </div>
            </div>
          )}
        </div>

        {/* Dining Area - Tables & Monobloc Chairs with optional Wilcon Glazed Tiles */}
        <div className={`absolute left-3 right-3 z-10 p-2 rounded-xl transition-all ${
          hasTiles
            ? 'bg-[#2b180d]/85 border-2 border-orange-700/60 shadow-xl shadow-amber-950/40 backdrop-blur-xs'
            : ''
        } ${hasAwning ? 'top-26 sm:top-28 md:top-30' : 'top-24 sm:top-28 md:top-32'}`}
        style={hasTiles ? {
          backgroundImage:
            'radial-gradient(circle, rgba(234, 88, 12, 0.12) 1px, transparent 1px), linear-gradient(to right, rgba(120, 53, 15, 0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(120, 53, 15, 0.18) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        } : undefined}
        >
          {/* Wilcon Tiles Floor Badge */}
          {hasTiles && (
            <div
              onClick={() => onShowToast('🧱 Wilcon Spanish Glazed Tiles: Makintab, mabilis maglakad ang tauhan at laging presko!')}
              className="absolute -top-2.5 right-4 bg-orange-950/90 text-orange-300 border border-orange-600/70 text-[9px] font-bold px-2 py-0.2 rounded-full shadow flex items-center gap-1 cursor-pointer hover:bg-orange-900"
            >
              <span>🧱</span>
              <span>Wilcon Glazed Ceramic Floor</span>
            </div>
          )}

          {/* Tropical Potted Plants flanking the tables */}
          {hasPlants && (
            <>
              <div
                onClick={() => onShowToast('🪴 Wilcon Garden San Francisco Plant: Pampaswerte at maaliwalas ang kainan!')}
                className="absolute -bottom-3 -left-1 text-2xl sm:text-3xl filter drop-shadow cursor-pointer hover:scale-110 transition-transform z-20"
                title="Wilcon Garden San Francisco Plant"
              >
                🪴
              </div>
              <div
                onClick={() => onShowToast('🪴 Wilcon Garden Fortune Plant: Dagdag sigla sa mga suki!')}
                className="absolute -bottom-3 -right-1 text-2xl sm:text-3xl filter drop-shadow cursor-pointer hover:scale-110 transition-transform z-20"
                title="Wilcon Garden Fortune Plant"
              >
                🌿
              </div>
            </>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {gameState.tables.map((table, idx) => (
              <div
                key={table.id}
                className={`relative rounded-xl p-2.5 flex flex-col items-center justify-between min-h-[145px] transition-all border ${
                  table.locked
                    ? 'bg-stone-900/70 border-stone-800 border-dashed text-stone-400'
                    : table.customer
                    ? 'bg-amber-950/80 border-amber-600/80 shadow-md backdrop-blur-xs'
                    : table.dirty
                    ? 'bg-stone-900/85 border-amber-800 shadow-md'
                    : 'bg-emerald-950/40 border-emerald-800/40 shadow-sm backdrop-blur-xs hover:border-emerald-600/60'
                }`}
              >
                {/* Table Header: Label */}
                <div className="w-full flex items-center justify-between text-[11px] font-semibold text-stone-300 mb-1">
                  <span>{table.label}</span>
                  {!table.locked && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded ${
                        table.customer
                          ? 'bg-amber-500/20 text-amber-300'
                          : table.dirty
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {table.customer ? 'May Tao' : table.dirty ? 'Marumi' : 'Bukas'}
                    </span>
                  )}
                </div>

                {/* Scenario 1: Table is Locked */}
                {table.locked && (
                  <div className="my-auto flex flex-col items-center text-center p-1">
                    <span className="text-2xl opacity-60">📦</span>
                    <button
                      onClick={() => onUnlockTable(idx)}
                      disabled={gameState.money < table.unlockCost}
                      className={`mt-2 text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                        gameState.money >= table.unlockCost
                          ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow cursor-pointer'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      Bili Mesa (₱{table.unlockCost})
                    </button>
                  </div>
                )}

                {/* Scenario 2: Occupied by Customer */}
                {!table.locked && table.customer && (
                  <div className="w-full flex flex-col items-center">
                    {/* Order Bubble */}
                    <div className="w-full bg-white text-stone-900 rounded-lg p-1.5 shadow-md border border-stone-300 mb-1 animate-gentle-bounce">
                      <div className="flex items-center justify-between gap-1 text-[11px] font-bold">
                        <span className="flex items-center gap-1 truncate">
                          <span>{table.customer.order.icon}</span>
                          <span className="truncate">{table.customer.order.dishName}</span>
                        </span>
                        <span className="text-emerald-700 font-mono shrink-0">₱{table.customer.order.totalBill}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-wrap mt-0.5">
                        {table.customer.order.dishId === gameState.dailySpecialDishId && (
                          <span className="text-[8px] bg-amber-500 text-stone-950 font-bold px-1 py-0.2 rounded font-mono">
                            ⭐ Special (+20%)
                          </span>
                        )}
                        {table.customer.order.wantsExtraRice && (
                          <span className="text-[9px] text-amber-800 font-semibold">🍚 +Extra Rice</span>
                        )}
                      </div>
                    </div>

                    {/* Customer Sprite Avatar, Mood Badge & Name */}
                    {(() => {
                      const mood = getCustomerMood(table.customer);
                      return (
                        <div className="relative my-0.5 flex flex-col items-center">
                          {/* Avatar with Floating Context-Aware Mood Icon */}
                          <div className="relative inline-flex items-center justify-center">
                            {/* Small context-aware mood icon floating above customer avatar */}
                            <div
                              className={`absolute -top-2.5 -right-2.5 z-20 flex items-center justify-center w-5 h-5 rounded-full border shadow-md text-xs backdrop-blur-xs select-none pointer-events-none transition-all duration-300 ${mood.badgeColor} ${
                                mood.pulse ? 'animate-bounce ring-2 ring-rose-500/50' : ''
                              }`}
                              title={`Mood: ${mood.label} (${Math.round(table.customer.patience)}% pasensya)`}
                            >
                              <span className="leading-none">{mood.icon}</span>
                            </div>

                            {/* Avatar */}
                            <div className="text-3xl filter drop-shadow select-none">
                              {table.customer.avatar}
                            </div>
                          </div>

                          <div className="text-[10px] font-bold text-amber-200 truncate max-w-[95px] text-center mt-0.5">
                            {table.customer.name}
                          </div>
                          <div className="flex items-center gap-1 text-[8px] text-stone-400 truncate">
                            <span>{table.customer.title}</span>
                            <span className="text-stone-600">•</span>
                            <span className={mood.textColor}>{mood.label}</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Patience Bar */}
                    <div className="w-full bg-stone-900 rounded-full h-1.5 my-1 overflow-hidden border border-stone-700">
                      <div
                        className={`h-full transition-all duration-300 ${
                          table.customer.patience > 55
                            ? 'bg-emerald-500'
                            : table.customer.patience > 25
                            ? 'bg-amber-500'
                            : 'bg-rose-500 animate-pulse'
                        }`}
                        style={{ width: `${Math.max(0, table.customer.patience)}%` }}
                      />
                    </div>

                    {/* Action Buttons: Serve Food & Give Water */}
                    <div className="w-full flex items-center gap-1 mt-1">
                      <button
                        onClick={(e) => onServeCustomer(idx, e)}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-[10px] py-1 rounded shadow cursor-pointer transition-all active:scale-95"
                        title="Ihain ang ulam sa suki"
                      >
                        Ihain 🍛
                      </button>

                      {hasWaterJug && (
                        <button
                          onClick={() => onGiveWater(idx)}
                          className="px-1.5 py-1 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-[9px] font-bold cursor-pointer"
                          title="Bigyan ng libreng tubig pampataas ng pasensya"
                        >
                          💧
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Scenario 3: Table is Dirty */}
                {!table.locked && !table.customer && table.dirty && (
                  <div className="my-auto flex flex-col items-center text-center p-1">
                    <div className="text-3xl animate-bounce">🍽️💦</div>
                    <div className="text-[10px] text-stone-300 font-medium my-1">Maruming Plato</div>
                    <button
                      onClick={(e) => onCleanTable(idx, e)}
                      className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-[10px] px-2.5 py-1 rounded shadow cursor-pointer active:scale-95 transition-all"
                      title="Pindutin para linisin ang mesa"
                    >
                      Linisin 🧽
                    </button>
                  </div>
                )}

                {/* Scenario 4: Table is Empty & Ready */}
                {!table.locked && !table.customer && !table.dirty && (
                  <div className="my-auto flex flex-col items-center text-center p-1 opacity-75">
                    {/* Visual 2D Monobloc Table & Chairs */}
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <div className="w-2.5 h-6 bg-emerald-600 rounded-t-xs border border-emerald-800" />
                      <div className="w-12 h-6 bg-stone-300 rounded border border-stone-500 shadow-inner flex items-center justify-center text-[9px] text-stone-700 font-bold">
                        Orocan
                      </div>
                      <div className="w-2.5 h-6 bg-emerald-600 rounded-t-xs border border-emerald-800" />
                    </div>
                    <span className="text-[9px] text-emerald-400 font-medium">Bukas sa Suki</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Muning the Karinderya Cat on Banig Mat */}
        <div
          onClick={handlePet}
          className="absolute bottom-2 left-4 z-20 flex items-center gap-2 cursor-pointer group"
          title="Si Muning (Himasin para sa swerte at barya!)"
        >
          <div className="relative">
            {catHeart && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-rose-500 text-sm font-bold animate-float-up pointer-events-none">
                💖 Meow!
              </div>
            )}
            <div className="text-3xl group-hover:scale-110 transition-transform filter drop-shadow">🐈</div>
          </div>

          <div className="bg-stone-950/80 border border-amber-800/80 px-2 py-0.5 rounded text-[10px] text-amber-200 shadow">
            <span className="font-bold">Si Muning</span>
            <span className="text-amber-400 ml-1">✨ Swerte</span>
          </div>
        </div>

        {/* Staff Working Avatars Indicator */}
        <div className="absolute bottom-2 right-4 z-20 flex items-center gap-1.5 bg-stone-950/80 border border-amber-900/60 p-1.5 rounded-lg shadow-lg backdrop-blur-xs">
          {Object.values(gameState.staff)
            .filter((s) => s.hired)
            .map((staff) => (
              <div
                key={staff.id}
                onClick={() => onShowToast(`${staff.name}: ${staff.currentTask}`)}
                className="flex items-center gap-1 px-1.5 py-0.5 bg-stone-900 rounded border border-amber-900/40 text-[10px] cursor-pointer hover:border-amber-500 transition-colors"
                title={`${staff.name} (${staff.roleTitle}): ${staff.currentTask}`}
              >
                <span className="text-sm">{staff.avatar}</span>
                <span className="font-semibold text-stone-200 hidden md:inline">{staff.name}</span>
              </div>
            ))}
          {Object.values(gameState.staff).filter((s) => s.hired).length === 0 && (
            <div className="text-[10px] text-amber-400/80 px-1">Walang tauhan pa (Mag-hire sa tab!)</div>
          )}
        </div>
      </div>

      {/* TURO-TURO WARMER DISPLAY COUNTER (Lower Section) */}
      <div className="w-full bg-gradient-to-b from-[#3a2215] to-[#25140b] border-t-4 border-[#5d371d] p-3 sm:p-4 shadow-inner">
        {/* Wilcon Stainless Steel Exhaust Hood */}
        {hasExhaust && (
          <div
            onClick={() => onShowToast('🌪️ Wilcon Stainless Exhaust Hood: Sipsip-usok at grasa sa tapat ng lutuan!')}
            className="w-full mb-2.5 bg-gradient-to-r from-stone-400 via-stone-200 to-stone-400 border-2 border-stone-500 rounded-lg p-1.5 shadow-md flex items-center justify-between text-stone-900 cursor-pointer hover:brightness-105 transition-all"
            title="Wilcon Stainless Range Hood & Exhaust Duct"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">🌪️</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-800">
                Wilcon Stainless Kitchen Exhaust Hood
              </span>
              <span className="text-[9px] bg-stone-800 text-amber-300 font-mono font-bold px-1.5 py-0.2 rounded hidden sm:inline">
                Sipsip-Usok Aktibo
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>100% Malinis na Hangin</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-1.5 border-b border-amber-900/60">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
              Display Warmers & Turo-Turo Trays
            </h3>
            <span className="text-xs text-amber-400/60 hidden sm:inline">
              (Pindutin ang ulam para magluto o mag-refill)
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={onGoToPuregold}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-600 border border-emerald-400 text-yellow-300 font-extrabold text-xs shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Bumili ng mga sariwang sangkap sa Puregold Price Club"
            >
              <span>🛒</span>
              <span>Mamili sa Puregold</span>
            </button>
            <div className="hidden sm:flex items-center gap-1 text-amber-200">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Lutuin bago maubos!</span>
            </div>
          </div>
        </div>

        {/* Wilcon Ultra-Clear Acrylic Sneeze Guard Pane */}
        {hasSneezeGuard && (
          <div
            onClick={() => onShowToast('🛡️ Wilcon Acrylic Sneeze Guard: Malinaw na salamin laban sa alikabok at laway!')}
            className="w-full mb-2 bg-gradient-to-r from-cyan-400/20 via-sky-200/40 to-cyan-400/20 border-t-2 border-b border-cyan-300/60 rounded px-3 py-1 flex items-center justify-between shadow-inner cursor-pointer hover:bg-cyan-400/30 transition-all backdrop-blur-xs"
            title="Wilcon Clear Acrylic Sneeze Guard (Protektado ang 11 ulam)"
          >
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-200">
              <span>🛡️</span>
              <span className="tracking-wide">Wilcon Acrylic Sneeze Guard</span>
            </div>
            <span className="text-[9px] font-mono font-semibold text-cyan-300/90 hidden sm:inline">
              Protektado ang mga Ulam laban sa Langaw & Alikabok
            </span>
          </div>
        )}

        {/* Trays Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-2 sm:gap-2.5">
          {Object.values(gameState.dishes).map((dish) => {
            if (!dish.unlocked) {
              return (
                <div
                  key={dish.id}
                  className="bg-stone-950/60 border border-stone-800/80 rounded-lg p-2 flex flex-col items-center justify-center text-center min-h-[110px] opacity-60"
                >
                  <span className="text-xl filter grayscale mb-1">{dish.icon}</span>
                  <span className="text-[10px] font-bold text-stone-400 truncate w-full">{dish.name}</span>
                  <span className="text-[9px] text-amber-500/80 mt-1">Naka-lock (₱{dish.unlockCost})</span>
                </div>
              );
            }

            const isLow = dish.portions <= 2;
            const isEmpty = dish.portions === 0;
            const isSpecial = dish.id === gameState.dailySpecialDishId;
            const boostedPrice = Math.round(dish.price * 1.2);

            return (
              <div
                key={dish.id}
                onClick={() => onCookDish(dish.id)}
                className={`group relative rounded-lg p-2 flex flex-col justify-between min-h-[115px] cursor-pointer transition-all border shadow-md ${
                  isSpecial
                    ? 'ring-2 ring-amber-400 border-amber-400 bg-gradient-to-b from-amber-950/70 to-amber-900/60 shadow-amber-500/20 shadow-lg'
                    : isEmpty
                    ? 'bg-rose-950/40 border-rose-600/80 hover:bg-rose-950/60'
                    : isLow
                    ? 'bg-amber-950/40 border-amber-500/80 hover:bg-amber-950/60'
                    : 'bg-gradient-to-b from-stone-200 to-stone-400 border-stone-400 text-stone-900 hover:from-amber-100 hover:to-stone-300'
                }`}
                title={`Pindutin para magluto ng ${dish.name} (Puhunan: ₱${dish.cost})${isSpecial ? ' - ⭐ Daily Special (+20% Benta)!' : ''}`}
              >
                {/* Daily Special Ribbon */}
                {isSpecial && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black text-[8px] px-2 py-0.2 rounded-full shadow border border-amber-300 flex items-center gap-0.5 whitespace-nowrap z-10 animate-pulse">
                    ⭐ DAILY SPECIAL (+20%)
                  </div>
                )}

                {/* Steam Rising Animation if hot */}
                {dish.portions > 0 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none text-stone-300 text-xs animate-steam">
                    ♨️
                  </div>
                )}

                {/* Tray Header */}
                <div className="w-full flex items-center justify-between">
                  <span className="text-xl filter drop-shadow">{dish.icon}</span>
                  <span
                    className={`font-mono text-xs font-black px-1.5 py-0.5 rounded ${
                      isSpecial
                        ? 'bg-amber-400 text-stone-950'
                        : isEmpty
                        ? 'bg-rose-600 text-white animate-pulse'
                        : isLow
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-stone-800 text-amber-300'
                    }`}
                  >
                    {dish.portions}/{dish.maxPortions}
                  </span>
                </div>

                {/* Dish Title & Price */}
                <div className="my-1">
                  <div
                    className={`text-[11px] font-bold leading-tight truncate ${
                      isSpecial || isEmpty || isLow ? 'text-white' : 'text-stone-950'
                    }`}
                  >
                    {dish.name}
                  </div>
                  <div
                    className={`text-[9px] font-mono ${
                      isSpecial
                        ? 'text-amber-300 font-bold'
                        : isEmpty || isLow
                        ? 'text-amber-300'
                        : 'text-stone-700'
                    }`}
                  >
                    {isSpecial ? (
                      <span className="flex items-center gap-1">
                        <span className="line-through opacity-60 text-stone-400">₱{dish.price}</span>
                        <span className="text-amber-300 font-bold">₱{boostedPrice}</span>
                        <span className="text-[8px] text-emerald-400 font-extrabold">+20%</span>
                      </span>
                    ) : (
                      <span>Benta: ₱{dish.price}</span>
                    )}
                  </div>
                </div>

                {/* Cook / Progress Action Button */}
                <div className="w-full">
                  <button
                    disabled={dish.cooking || gameState.money < dish.cost}
                    className={`w-full py-1 text-[10px] font-bold rounded flex items-center justify-center gap-1 transition-colors ${
                      dish.cooking
                        ? 'bg-amber-600 text-white animate-pulse'
                        : isSpecial
                        ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow font-black cursor-pointer'
                        : gameState.money >= dish.cost
                        ? 'bg-emerald-700 hover:bg-emerald-600 text-white shadow'
                        : 'bg-stone-700 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    {dish.cooking ? (
                      <>
                        <Flame className="w-3 h-3 animate-spin" />
                        <span>Luluto...</span>
                      </>
                    ) : (
                      <span>Luto (₱{dish.cost})</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Interactive Cash / Text FX */}
      {floatingTexts.map((f) => (
        <div
          key={f.id}
          className={`absolute pointer-events-none font-black text-sm md:text-base font-mono z-50 animate-float-up filter drop-shadow-md ${
            f.color || 'text-emerald-400'
          }`}
          style={{ left: f.x, top: f.y }}
        >
          {f.text}
        </div>
      ))}
    </div>
  );
};
