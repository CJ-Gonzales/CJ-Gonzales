import React, { useState } from 'react';
import { GameState, Ingredient } from '../types/game';
import { PUREGOLD_INGREDIENTS } from '../data/initialGameData';
import { sound } from '../utils/audio';
import { GAME_ASSETS } from '../assets/images';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Tag,
  CheckCircle2,
  Sparkles,
  Award,
  Package,
  Layers,
  Search,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Truck
} from 'lucide-react';

interface PuregoldGroceryProps {
  gameState: GameState;
  onBuyIngredients: (
    items: Array<{ ingredientId: string; quantity: number; cost: number }>,
    pointsEarned: number
  ) => void;
  onToggleAutoRestock: () => void;
  onRedeemPoints: () => void;
  onShowToast: (msg: string) => void;
}

export const PuregoldGrocery: React.FC<PuregoldGroceryProps> = ({
  gameState,
  onBuyIngredients,
  onToggleAutoRestock,
  onRedeemPoints,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterDish, setFilterDish] = useState<string>('all');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Cart operations
  const addToCart = (ingredientId: string, quantity: number = 1) => {
    sound.playBarcodeBeep();
    setCart((prev) => ({
      ...prev,
      [ingredientId]: (prev[ingredientId] || 0) + quantity,
    }));
  };

  const removeFromCart = (ingredientId: string, quantity: number = 1) => {
    sound.playClick();
    setCart((prev) => {
      const current = prev[ingredientId] || 0;
      if (current <= quantity) {
        const next = { ...prev };
        delete next[ingredientId];
        return next;
      }
      return {
        ...prev,
        [ingredientId]: current - quantity,
      };
    });
  };

  const clearCart = () => {
    sound.playClick();
    setCart({});
  };

  // Pre-packaged Wholesale Bundles
  const wholesaleBundles = [
    {
      id: 'adobo_bundle',
      name: 'Adobo Suki Value Pack',
      tagline: '5x Liempo + 5x Adobo Mix Pack',
      icon: '🍗',
      items: [
        { id: 'pork_belly', qty: 5 },
        { id: 'adobo_seasoning', qty: 5 },
      ],
      price: 75, // normal 90 (17% off)
      originalPrice: 90,
      savings: 15,
    },
    {
      id: 'sinigang_bundle',
      name: 'Sinigang Asim-Kilig Pack',
      tagline: '5x Buto-Buto + 5x Sampalok Mix',
      icon: '🍲',
      items: [
        { id: 'pork_ribs', qty: 5 },
        { id: 'sinigang_mix', qty: 5 },
      ],
      price: 100, // normal 120 (17% off)
      originalPrice: 120,
      savings: 20,
    },
    {
      id: 'rice_sack_bundle',
      name: 'Bigasan Sako Fiesta Pack',
      tagline: '20 Kilos Premium Sinandomeng',
      icon: '🌾',
      items: [{ id: 'bigas', qty: 20 }],
      price: 80, // normal 100 (20% off)
      originalPrice: 100,
      savings: 20,
    },
    {
      id: 'grand_fiesta_bundle',
      name: 'Aling Puring Karinderya Mega Crate',
      tagline: 'Pang-negosyo: Bigas, Liempo, Sisig at Atay Sets',
      icon: '📦',
      items: [
        { id: 'bigas', qty: 15 },
        { id: 'pork_belly', qty: 6 },
        { id: 'pork_maskara', qty: 5 },
        { id: 'sisig_aromatics', qty: 5 },
      ],
      price: 260, // normal 312
      originalPrice: 312,
      savings: 52,
    },
    {
      id: 'lechon_bundle',
      name: 'Crispy Lechon Kawali Suki Bundle',
      tagline: '5x Pork Liempo + 5x Mang Tomas Sarsa',
      icon: '🥩',
      items: [
        { id: 'pork_belly', qty: 5 },
        { id: 'mang_tomas_sauce', qty: 5 },
      ],
      price: 110, // normal 130 (15% off)
      originalPrice: 130,
      savings: 20,
    },
    {
      id: 'merienda_bundle',
      name: 'Lucban Merienda Fiesta Pack',
      tagline: '5x Miki Habhab + 5x Gulay/Liempo + 5x Sweet Corn',
      icon: '🥢',
      items: [
        { id: 'miki_lucban_noodles', qty: 5 },
        { id: 'habhab_veggies_meat', qty: 5 },
        { id: 'sweet_corn_kernel', qty: 5 },
      ],
      price: 170, // normal 205 (17% off)
      originalPrice: 205,
      savings: 35,
    },
  ];

  const handleBuyBundle = (bundle: (typeof wholesaleBundles)[0]) => {
    if (gameState.money < bundle.price) {
      onShowToast(`Kulang ang pera pambili ng ${bundle.name}! (₱${bundle.price})`);
      return;
    }

    const itemsToBuy = bundle.items.map((i) => {
      const ing = PUREGOLD_INGREDIENTS[i.id];
      return {
        ingredientId: i.id,
        quantity: i.qty,
        cost: Math.round((ing?.pricePerUnit || 10) * i.qty * 0.82),
      };
    });

    const points = Math.max(5, Math.floor(bundle.price / 15));
    onBuyIngredients(itemsToBuy, points);
    sound.playRegisterChime();
    onShowToast(`Nabili ang ${bundle.name}! Nakatipid ng ₱${bundle.savings} + ${points} Aling Puring pts! 🎉`);
  };

  // Cart Totals Calculation
  const cartEntries = Object.entries(cart);
  const totalCartCount = cartEntries.reduce((sum, [, qty]) => sum + qty, 0);

  let rawSubtotal = 0;
  cartEntries.forEach(([id, qty]) => {
    const item = PUREGOLD_INGREDIENTS[id];
    if (item) {
      // Bulk discount check (if >= bulkQty)
      if (qty >= item.bulkQty) {
        const discountedUnitPrice = item.pricePerUnit * (1 - item.bulkDiscountPercent / 100);
        rawSubtotal += discountedUnitPrice * qty;
      } else {
        rawSubtotal += item.pricePerUnit * qty;
      }
    }
  });

  // Aling Puring Card member discount
  const memberDiscountRate = gameState.alingPuringCard?.discountRate || 0.05;
  const memberDiscount = Math.round(rawSubtotal * memberDiscountRate);
  const finalTotal = Math.max(0, Math.round(rawSubtotal - memberDiscount));
  const pointsToEarn = Math.max(1, Math.floor(finalTotal / 20));

  const handleCheckout = () => {
    if (totalCartCount === 0) {
      onShowToast('Walang laman ang iyong grocery cart!');
      return;
    }
    if (gameState.money < finalTotal) {
      onShowToast(`Kulang ang pera mo sa kahera! Kailangan: ₱${finalTotal}`);
      return;
    }

    const checkoutItems = cartEntries.map(([id, qty]) => {
      const item = PUREGOLD_INGREDIENTS[id];
      const baseCost = item ? item.pricePerUnit * qty : 10;
      return {
        ingredientId: id,
        quantity: qty,
        cost: Math.round(baseCost * (1 - memberDiscountRate)),
      };
    });

    onBuyIngredients(checkoutItems, pointsToEarn);
    sound.playRegisterChime();
    setCart({});
    setCheckoutSuccess(true);
    setTimeout(() => setCheckoutSuccess(false), 3000);
    onShowToast(`Salamat sa pamimili sa Puregold! Naihatid na sa kusina ang mga sangkap. 🛒`);
  };

  // Filter ingredients
  const filteredIngredients = Object.values(PUREGOLD_INGREDIENTS).filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (filterDish !== 'all' && !item.usedInDishIds.includes(filterDish)) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full space-y-6">
      {/* PUREGOLD HERO BANNER & ALING PURING MEMBERSHIP */}
      <div className="relative rounded-2xl overflow-hidden border-3 border-emerald-600 shadow-2xl bg-gradient-to-r from-[#003818] via-[#005a2b] to-[#043317] text-white">
        <div className="flex flex-col lg:flex-row items-stretch">
          {/* Supermarket Interior Visual Photo */}
          <div className="lg:w-2/5 relative min-h-[220px] lg:min-h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-emerald-500/40">
            <img
              src={GAME_ASSETS.puregoldSupermarketAisle}
              alt="Puregold Supermarket Aisle"
              className="w-full h-full object-cover object-center filter brightness-105"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== window.location.origin + GAME_ASSETS.puregoldSupermarketAisleFallback) {
                  target.src = GAME_ASSETS.puregoldSupermarketAisleFallback;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#003818] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#005a2b]" />
            <div className="absolute top-3 left-3 bg-yellow-400 text-stone-950 px-2.5 py-1 rounded font-black text-xs uppercase tracking-wider shadow-md">
              Sa Puregold, Always Panalo!
            </div>
          </div>

          {/* Puregold Title & Aling Puring Loyalty Card */}
          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-5">
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-yellow-400 text-emerald-950 font-black text-base sm:text-lg px-2.5 py-0.5 rounded tracking-tighter shadow">
                    PUREGOLD
                  </div>
                  <span className="text-yellow-300 font-bold text-xs uppercase tracking-widest hidden sm:inline">
                    Price Club Karinderya Partner
                  </span>
                </div>

                {/* Auto Restock Switch */}
                <button
                  onClick={onToggleAutoRestock}
                  className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-semibold ${
                    gameState.autoRestockEnabled
                      ? 'bg-yellow-400 text-emerald-950 border-yellow-300 shadow-md font-bold'
                      : 'bg-emerald-950/80 text-emerald-200 border-emerald-700 hover:bg-emerald-900'
                  }`}
                  title="Awtomatikong mag-order si Ate Nena sa Puregold kapag kulang ang sangkap habang nagluluto"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>
                    Express Restock: {gameState.autoRestockEnabled ? 'BUKAY (ON)' : 'PATAY (OFF)'}
                  </span>
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Pamilihang Bayan: Sariwang Sangkap sa Presyong Pakyawan
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
                Bumili ng de-kalidad na karne, sariwang gulay, at unang klaseng bigas para sa iyong mga ulam.
                Gamitin ang iyong Aling Puring card para sa dagdag na diskuwento at rebate points!
              </p>
            </div>

            {/* Tindahan ni Aling Puring VIP Member Card */}
            <div className="bg-gradient-to-r from-emerald-950/90 to-emerald-900/90 border border-yellow-400/50 rounded-xl p-3.5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-xs">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-yellow-400 text-emerald-950 flex items-center justify-center font-black text-lg shadow">
                  💳
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-yellow-300 uppercase tracking-wide">
                      Tindahan ni Aling Puring
                    </span>
                    <span className="bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      {gameState.alingPuringCard?.tier || 'Kasosyo'} Member
                    </span>
                  </div>
                  <div className="text-xs text-emerald-100">
                    Diskuwento: <span className="font-bold text-yellow-300">{(memberDiscountRate * 100).toFixed(0)}% Off</span> sa lahat ng bilihin
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-emerald-800/80 pt-2 sm:pt-0">
                <div className="text-right">
                  <div className="text-[10px] text-emerald-300 uppercase font-bold">Naipong Points</div>
                  <div className="text-base font-extrabold text-yellow-300 font-mono">
                    {gameState.alingPuringCard?.points || 0} pts
                  </div>
                </div>

                <button
                  onClick={onRedeemPoints}
                  disabled={(gameState.alingPuringCard?.points || 0) < 50}
                  className={`text-xs font-bold px-3 py-1.5 rounded transition-all cursor-pointer ${
                    (gameState.alingPuringCard?.points || 0) >= 50
                      ? 'bg-yellow-400 hover:bg-yellow-300 text-stone-950 shadow-md animate-bounce'
                      : 'bg-emerald-900/60 text-emerald-400/60 border border-emerald-800 cursor-not-allowed'
                  }`}
                  title="I-convert ang 50 points sa libreng ₱25 cash voucher!"
                >
                  I-redeem (50 pts = ₱25)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WHOLESALE PAKYAWAN BUNDLES (Fast 1-Click Packs) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-yellow-500" />
            <h3 className="text-base font-bold text-amber-200">
              Pakyawan Bundles ni Aling Puring (Pang-Negosyo Value Packs)
            </h3>
          </div>
          <span className="text-xs text-stone-400 hidden sm:inline">
            Mas mura kaysa tingi — diretso sa imbakan ng kusina
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {wholesaleBundles.map((bundle) => {
            const canAfford = gameState.money >= bundle.price;
            return (
              <div
                key={bundle.id}
                className="bg-[#24150c] border border-amber-800/60 hover:border-yellow-500 rounded-xl p-3.5 shadow-md flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-2xl filter drop-shadow">{bundle.icon}</span>
                    <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Tipid ₱{bundle.savings}
                    </span>
                  </div>
                  <h4 className="font-bold text-amber-100 text-sm group-hover:text-yellow-300 transition-colors">
                    {bundle.name}
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">{bundle.tagline}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-amber-950 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-stone-500 line-through">₱{bundle.originalPrice}</div>
                    <div className="text-base font-black text-yellow-400 font-mono">₱{bundle.price}</div>
                  </div>

                  <button
                    onClick={() => handleBuyBundle(bundle)}
                    disabled={!canAfford}
                    className={`px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-all ${
                      canAfford
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-stone-950 shadow'
                        : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    Bumili agad
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN GROCERY AISLES & SHOPPING CART SPLIT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Aisle Catalogue */}
        <div className="lg:col-span-2 space-y-4">
          {/* Aisle Category Navigation */}
          <div className="flex items-center justify-between gap-2 flex-wrap bg-[#1d1008] p-2 rounded-xl border border-amber-900/60">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'Lahat ng Aisle' },
                { id: 'meat', label: '🥩 Karnehan' },
                { id: 'produce', label: '🥬 Gulay & Sahog' },
                { id: 'grain', label: '🌾 Bigas & Grains' },
                { id: 'dessert', label: '🍧 Halo-Halo' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-amber-200/80 hover:bg-amber-950'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Filter by Dish Needs */}
            <div className="flex items-center gap-1.5 text-xs text-stone-300">
              <span className="text-stone-400 hidden sm:inline">Ulam:</span>
              <select
                value={filterDish}
                onChange={(e) => setFilterDish(e.target.value)}
                className="bg-[#2a170d] text-amber-200 border border-amber-800 rounded px-2 py-1 text-xs outline-none cursor-pointer"
              >
                <option value="all">Lahat ng Ulam</option>
                <option value="kanin">🍚 Kanin</option>
                <option value="adobo">🍗 Adobo</option>
                <option value="sinigang">🍲 Sinigang</option>
                <option value="menudo">🥘 Menudo</option>
                <option value="sisig">🥓 Sisig</option>
                <option value="bicolExpress">🌶️ Bicol Express</option>
                <option value="kaldereta">🥩 Kaldereta</option>
                <option value="halohalo">🍧 Halo-Halo</option>
              </select>
            </div>
          </div>

          {/* Product Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredIngredients.map((item) => {
              const currentStock = gameState.inventory?.[item.id] || 0;
              const inCartQty = cart[item.id] || 0;
              const bulkPrice = Math.round(item.pricePerUnit * item.bulkQty * (1 - item.bulkDiscountPercent / 100));

              return (
                <div
                  key={item.id}
                  className="bg-[#22130b] border border-amber-900/60 hover:border-emerald-500/80 rounded-xl p-3.5 shadow-md flex flex-col justify-between transition-all group"
                >
                  <div>
                    {/* Top row: Icon, Category & Current Stock */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl filter drop-shadow">{item.icon}</span>
                        <div>
                          <h4 className="font-bold text-amber-100 text-sm group-hover:text-yellow-300 transition-colors">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-stone-400 italic">{item.tagalogName}</span>
                        </div>
                      </div>

                      {/* Stock in Kusina Pantry */}
                      <div
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                          currentStock === 0
                            ? 'bg-rose-950/80 text-rose-300 border-rose-800 animate-pulse'
                            : currentStock < 5
                            ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                            : 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                        }`}
                        title="Dami ng sangkap sa iyong kusina"
                      >
                        Pantry: {currentStock} {item.unitLabel}
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-300 line-clamp-2 mt-1">{item.description}</p>

                    {/* Dish associations */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      <span className="text-[10px] text-stone-400 font-semibold">Gamit sa:</span>
                      {item.usedInDishIds.map((dishId) => {
                        const dish = gameState.dishes[dishId];
                        return (
                          <span
                            key={dishId}
                            className="text-[10px] bg-stone-900/80 border border-amber-900/60 text-amber-200 px-1.5 py-0.2 rounded"
                          >
                            {dish?.icon} {dish?.name || dishId}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-amber-950 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-stone-400 text-[11px]">Tingi: </span>
                        <span className="font-bold text-yellow-300 font-mono text-sm">
                          ₱{item.pricePerUnit}
                        </span>
                        <span className="text-[10px] text-stone-500">/{item.unitLabel}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 font-bold">
                          Pakyawan ({item.bulkQty}x):{' '}
                        </span>
                        <span className="font-bold text-yellow-300 font-mono text-sm">₱{bulkPrice}</span>
                        <span className="text-[9px] text-yellow-500 ml-1">(-{item.bulkDiscountPercent}%)</span>
                      </div>
                    </div>

                    {/* Purchase & Cart Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => addToCart(item.id, 1)}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded cursor-pointer transition-colors active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Bumili ng 1</span>
                      </button>

                      <button
                        onClick={() => addToCart(item.id, item.bulkQty)}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 bg-yellow-500 hover:bg-yellow-400 text-stone-950 text-xs font-bold rounded cursor-pointer transition-colors active:scale-95 shadow"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Pakyaw ({item.bulkQty}x)</span>
                      </button>
                    </div>

                    {inCartQty > 0 && (
                      <div className="flex items-center justify-between text-xs bg-emerald-950/60 border border-emerald-600/50 px-2 py-1 rounded text-emerald-300">
                        <span>Nasa Cart: {inCartQty} {item.unitLabel}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => removeFromCart(item.id, 1)}
                            className="p-0.5 hover:bg-emerald-900 rounded cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => addToCart(item.id, 1)}
                            className="p-0.5 hover:bg-emerald-900 rounded cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Puregold Shopping Cart & Checkout Ledger */}
        <div className="bg-[#1f1109] border-2 border-emerald-600/70 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between min-h-[460px] sticky top-24">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/60 mb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-yellow-400" />
                <h3 className="font-extrabold text-amber-200 text-base">Puregold Grocery Cart</h3>
              </div>
              {totalCartCount > 0 && (
                <button
                  onClick={clearCart}
                  className="text-stone-400 hover:text-rose-400 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Alisin Lahat</span>
                </button>
              )}
            </div>

            {/* Cart Items List */}
            {totalCartCount === 0 ? (
              <div className="py-12 text-center text-stone-400 space-y-2">
                <div className="text-4xl">🛒</div>
                <div className="text-sm font-semibold text-stone-300">Walang laman ang iyong cart</div>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Pumili ng mga sangkap sa kaliwa o kumuha ng Pakyawan Bundle para mapuno ang iyong kusina!
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {cartEntries.map(([id, qty]) => {
                  const item = PUREGOLD_INGREDIENTS[id];
                  if (!item) return null;

                  const isBulk = qty >= item.bulkQty;
                  const unitPrice = isBulk
                    ? item.pricePerUnit * (1 - item.bulkDiscountPercent / 100)
                    : item.pricePerUnit;
                  const itemTotal = Math.round(unitPrice * qty);

                  return (
                    <div
                      key={id}
                      className="bg-[#2a170d] border border-amber-900/50 rounded-lg p-2 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg shrink-0">{item.icon}</span>
                        <div className="truncate">
                          <div className="font-bold text-amber-100 truncate">{item.name}</div>
                          <div className="text-[10px] text-stone-400 font-mono">
                            ₱{item.pricePerUnit} x {qty} {isBulk && '(Bulk Rate)'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono font-bold text-yellow-300">₱{itemTotal}</span>
                        <div className="flex items-center gap-0.5 bg-stone-900 rounded border border-amber-900/40 p-0.5">
                          <button
                            onClick={() => removeFromCart(id, 1)}
                            className="p-1 text-stone-300 hover:text-white hover:bg-stone-800 rounded cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono px-1 font-bold">{qty}</span>
                          <button
                            onClick={() => addToCart(id, 1)}
                            className="p-1 text-stone-300 hover:text-white hover:bg-stone-800 rounded cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Checkout Summary Box */}
          <div className="mt-4 pt-3 border-t border-amber-900/60 space-y-2.5">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-stone-300">
                <span>Subtotal ({totalCartCount} aytem):</span>
                <span className="font-mono">₱{Math.round(rawSubtotal)}</span>
              </div>

              <div className="flex justify-between text-yellow-400 font-medium">
                <span>Aling Puring Member Card ({(memberDiscountRate * 100).toFixed(0)}% Off):</span>
                <span className="font-mono">-₱{memberDiscount}</span>
              </div>

              <div className="flex justify-between text-emerald-400 text-[11px]">
                <span>Makukuhang Rebate Points:</span>
                <span className="font-mono font-bold">+{pointsToEarn} pts</span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-amber-950">
                <span>Kabuuang Bayarin:</span>
                <span className="font-mono text-yellow-300 text-lg">₱{finalTotal}</span>
              </div>
            </div>

            {checkoutSuccess && (
              <div className="bg-emerald-950 border border-emerald-500 text-emerald-300 p-2 rounded text-xs flex items-center gap-1.5 animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Nabayaran na sa kahera! Dumating na ang mga sangkap sa kusina.</span>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={totalCartCount === 0 || gameState.money < finalTotal}
              className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                totalCartCount === 0 || gameState.money < finalTotal
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-stone-950 shadow-lg active:scale-98'
              }`}
            >
              <span>Bayaran sa Kahera (Checkout)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {gameState.money < finalTotal && totalCartCount > 0 && (
              <p className="text-[11px] text-rose-400 text-center font-medium">
                Kulang ang iyong pera (Kailangan: ₱{finalTotal}, Mayroon: ₱{gameState.money})
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
