/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameState,
  ShiftTime,
  TableSpot,
  Customer,
  DailySummary,
  Achievement,
} from './types/game';
import {
  INITIAL_GAME_STATE,
  INITIAL_INVENTORY,
  INITIAL_ALING_PURING_CARD,
  PUREGOLD_INGREDIENTS,
  CUSTOMER_ARCHETYPES,
  CustomerArchetype,
  pickRandomDailySpecial,
} from './data/initialGameData';
import { sound } from './utils/audio';
import { HeaderBar } from './components/HeaderBar';
import { KarinderyaScene } from './components/KarinderyaScene';
import { DishesPanel } from './components/DishesPanel';
import { PuregoldGrocery } from './components/PuregoldGrocery';
import { StaffPanel } from './components/StaffPanel';
import { DecorPanel } from './components/DecorPanel';
import { DailyReportPanel } from './components/DailyReportPanel';
import { DailySummaryModal } from './components/DailySummaryModal';
import { TutorialModal } from './components/TutorialModal';
import { AchievementsModal } from './components/AchievementsModal';
import { RenameModal } from './components/RenameModal';
import { CreditsModal } from './components/CreditsModal';
import { RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'kusina_ni_bossing_save_v1';

export default function App() {
  // Load initial state from LocalStorage or defaults
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const resolvedDishes: Record<string, any> = {};
        Object.keys(INITIAL_GAME_STATE.dishes).forEach((key) => {
          resolvedDishes[key] = {
            ...INITIAL_GAME_STATE.dishes[key],
            ...(parsed.dishes?.[key] || {}),
            requiredIngredients: INITIAL_GAME_STATE.dishes[key].requiredIngredients,
          };
        });

        const resolvedSpecial =
          parsed.dailySpecialDishId && resolvedDishes[parsed.dailySpecialDishId]?.unlocked
            ? parsed.dailySpecialDishId
            : pickRandomDailySpecial(resolvedDishes);

        const resolvedAchievements = (INITIAL_GAME_STATE.achievements || []).map((initA) => {
          const old = (parsed.achievements || []).find((a: any) => a.id === initA.id);
          return old
            ? { ...initA, unlocked: old.unlocked, progress: old.progress }
            : initA;
        });

        return {
          ...INITIAL_GAME_STATE,
          ...parsed,
          dailySpecialDishId: resolvedSpecial,
          tables: parsed.tables || INITIAL_GAME_STATE.tables,
          dishes: resolvedDishes,
          staff: { ...INITIAL_GAME_STATE.staff, ...(parsed.staff || {}) },
          decor: { ...INITIAL_GAME_STATE.decor, ...(parsed.decor || {}) },
          inventory: { ...INITIAL_INVENTORY, ...(parsed.inventory || {}) },
          alingPuringCard: parsed.alingPuringCard || INITIAL_ALING_PURING_CARD,
          achievements: resolvedAchievements,
          autoRestockEnabled:
            parsed.autoRestockEnabled !== undefined ? parsed.autoRestockEnabled : true,
          todayStats: {
            ...INITIAL_GAME_STATE.todayStats,
            ...(parsed.todayStats || {}),
            dailySpecialServed: parsed.todayStats?.dailySpecialServed || 0,
          },
        };
      }
    } catch (e) {
      console.warn('Failed to load saved state, using default', e);
    }
    return INITIAL_GAME_STATE;
  });

  const [activeTab, setActiveTab] = useState<string>('scene');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<
    Array<{ id: number; text: string; x: number; y: number; color?: string }>
  >([]);

  // Modals
  const [isDailySummaryOpen, setIsDailySummaryOpen] = useState(false);
  const [activeDailySummary, setActiveDailySummary] = useState<DailySummary | null>(null);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);

  const toastTimerRef = useRef<any>(null);
  const floatIdRef = useRef(0);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [gameState]);

  // Toast Helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  // Floating text Helper
  const addFloatingText = useCallback(
    (text: string, x?: number, y?: number, color?: string) => {
      const id = ++floatIdRef.current;
      const targetX = x || Math.floor(window.innerWidth / 2 - 40);
      const targetY = y || 240;

      setFloatingTexts((prev) => [...prev, { id, text, x: targetX, y: targetY, color }]);
      setTimeout(() => {
        setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
      }, 950);
    },
    []
  );

  // Trigger sound toggle
  const handleToggleSound = useCallback(() => {
    const next = !gameState.soundEnabled;
    sound.setSoundEnabled(next);
    setGameState((prev) => ({ ...prev, soundEnabled: next }));
    showToast(next ? '🔊 Buhay ang audio' : '🔇 Naka-mute ang audio');
  }, [gameState.soundEnabled, showToast]);

  // Trigger game speed toggle
  const handleToggleSpeed = useCallback(() => {
    setGameState((prev) => {
      const nextSpeed = prev.gameSpeed === 1 ? 2 : 1;
      showToast(`Bilis ng Laro: ${nextSpeed}x`);
      return { ...prev, gameSpeed: nextSpeed };
    });
  }, [showToast]);

  // Trigger pause toggle
  const handleTogglePause = useCallback(() => {
    setGameState((prev) => {
      const nextPaused = !prev.isPaused;
      showToast(nextPaused ? '⏸️ Naka-pause ang laro' : '▶️ Tuloy ang laro!');
      return { ...prev, isPaused: nextPaused };
    });
  }, [showToast]);

  // Rename eatery
  const handleSaveName = useCallback((newName: string) => {
    setGameState((prev) => ({ ...prev, carinderiaName: newName }));
    showToast(`Pangalan: ${newName}`);
  }, [showToast]);

  // Claim achievement
  const handleClaimAchievement = useCallback((id: string) => {
    setGameState((prev) => {
      const ach = prev.achievements.find((a) => a.id === id);
      if (!ach || ach.unlocked || ach.progress < ach.goal) return prev;

      sound.playFanfare();
      const updated = prev.achievements.map((a) =>
        a.id === id ? { ...a, unlocked: true } : a
      );

      return {
        ...prev,
        money: prev.money + ach.rewardPeso,
        achievements: updated,
      };
    });
    showToast(`Nakuha ang gantimpala! 💰`);
  }, [showToast]);

  // Puregold Buy Ingredients
  const handleBuyIngredients = useCallback(
    (
      items: Array<{ ingredientId: string; quantity: number; cost: number }>,
      pointsEarned: number
    ) => {
      setGameState((prev) => {
        const totalCost = items.reduce((sum, item) => sum + item.cost, 0);
        if (prev.money < totalCost) {
          showToast(`Kulang ang pera pambayad sa Puregold! (₱${totalCost})`);
          return prev;
        }

        const updatedInventory = { ...(prev.inventory || INITIAL_INVENTORY) };
        items.forEach((item) => {
          updatedInventory[item.ingredientId] =
            (updatedInventory[item.ingredientId] || 0) + item.quantity;
        });

        const card = prev.alingPuringCard || INITIAL_ALING_PURING_CARD;
        const newTotalSpent = card.totalSpent + totalCost;
        let newTier = card.tier;
        let newDiscount = card.discountRate;

        if (newTotalSpent >= 1500) {
          newTier = 'Gold';
          newDiscount = 0.15;
        } else if (newTotalSpent >= 500) {
          newTier = 'Silver';
          newDiscount = 0.10;
        }

        return {
          ...prev,
          money: prev.money - totalCost,
          inventory: updatedInventory,
          alingPuringCard: {
            ...card,
            points: card.points + pointsEarned,
            totalSpent: newTotalSpent,
            tier: newTier,
            discountRate: newDiscount,
          },
          todayStats: {
            ...prev.todayStats,
            ingredientExpenses: prev.todayStats.ingredientExpenses + totalCost,
          },
        };
      });
    },
    [showToast]
  );

  // Toggle Express Puregold Restock
  const handleToggleAutoRestock = useCallback(() => {
    setGameState((prev) => {
      const next = !prev.autoRestockEnabled;
      showToast(
        next
          ? '🛒 Bukas ang Express Restock: Awtomatikong bibili si Ate Nena sa Puregold'
          : '🛒 Sarado ang Express Restock: Manwal na pamimili sa Puregold tab'
      );
      return { ...prev, autoRestockEnabled: next };
    });
  }, [showToast]);

  // Redeem Aling Puring Points
  const handleRedeemPoints = useCallback(() => {
    setGameState((prev) => {
      const card = prev.alingPuringCard || INITIAL_ALING_PURING_CARD;
      if (card.points < 50) return prev;

      sound.playCoin();
      showToast('🎉 Na-redeem ang 50 Aling Puring Points sa ₱25 Cash Voucher!');
      return {
        ...prev,
        money: prev.money + 25,
        alingPuringCard: {
          ...card,
          points: card.points - 50,
        },
      };
    });
  }, [showToast]);

  // Cook dish logic (Checking Puregold Pantry & Auto-Restock)
  const handleCookDish = useCallback((dishId: string) => {
    setGameState((prev) => {
      const dish = prev.dishes[dishId];
      if (!dish || dish.cooking || !dish.unlocked) return prev;
      if (dish.portions >= dish.maxPortions) {
        showToast(`Puno pa ang tray ng ${dish.name}!`);
        return prev;
      }

      const inv = prev.inventory || INITIAL_INVENTORY;
      const reqs = dish.requiredIngredients || [];

      // Check ingredient stock
      const missingItems: Array<{ id: string; name: string; needed: number }> = [];
      reqs.forEach((r) => {
        const available = inv[r.ingredientId] || 0;
        if (available < r.quantity) {
          missingItems.push({
            id: r.ingredientId,
            name: r.name,
            needed: r.quantity - available,
          });
        }
      });

      let autoPurchasedCost = 0;
      const updatedInv = { ...inv };

      if (missingItems.length > 0) {
        if (prev.autoRestockEnabled) {
          // Calculate cost to auto-buy missing items from Puregold
          let autoCost = 0;
          missingItems.forEach((m) => {
            const pInfo = PUREGOLD_INGREDIENTS[m.id];
            const unitCost = pInfo ? pInfo.pricePerUnit : 10;
            autoCost += unitCost * m.needed;
          });

          if (prev.money < dish.cost + autoCost) {
            showToast(`Kulang ang pera pambili ng sangkap sa Puregold! (₱${dish.cost + autoCost})`);
            return prev;
          }

          autoPurchasedCost = autoCost;
          // Add auto-bought items to inventory
          missingItems.forEach((m) => {
            updatedInv[m.id] = (updatedInv[m.id] || 0) + m.needed;
          });
          showToast(`🛒 Puregold Express: Kinuha ang sangkap para sa ${dish.name}! (-₱${autoCost})`);
        } else {
          const missingNames = missingItems.map((m) => m.name).join(', ');
          showToast(`Kulang sa sangkap: ${missingNames}! Bumili sa Puregold Grocery.`);
          return prev;
        }
      }

      const totalDeduction = dish.cost + autoPurchasedCost;
      if (prev.money < totalDeduction) {
        showToast(`Kulang ang pera pambili ng sangkap! (Kailangan: ₱${totalDeduction})`);
        return prev;
      }

      // Deduct required ingredients from inventory
      reqs.forEach((r) => {
        updatedInv[r.ingredientId] = Math.max(0, (updatedInv[r.ingredientId] || 0) - r.quantity);
      });

      sound.playSizzle();

      // Trigger cooking
      const cookDuration = dish.cookTime / prev.gameSpeed;
      setTimeout(() => {
        setGameState((current) => {
          const targetDish = current.dishes[dishId];
          if (!targetDish) return current;

          sound.playDing();
          showToast(`Luto na ang ${targetDish.name}! ♨️`);

          // Update achievements progress
          const updatedAchievements = current.achievements.map((a) => {
            if (a.id === 'first_cook') return { ...a, progress: a.progress + 1 };
            return a;
          });

          return {
            ...current,
            dishes: {
              ...current.dishes,
              [dishId]: {
                ...targetDish,
                portions: Math.min(targetDish.maxPortions, targetDish.portions + 4),
                cooking: false,
              },
            },
            totalDishesCooked: current.totalDishesCooked + 1,
            achievements: updatedAchievements,
          };
        });
      }, cookDuration);

      return {
        ...prev,
        money: prev.money - totalDeduction,
        inventory: updatedInv,
        todayStats: {
          ...prev.todayStats,
          ingredientExpenses: prev.todayStats.ingredientExpenses + totalDeduction,
        },
        dishes: {
          ...prev.dishes,
          [dishId]: { ...dish, cooking: true },
        },
      };
    });
  }, [showToast]);

  // Serve table logic
  const handleServeCustomer = useCallback((tableIndex: number, event?: React.MouseEvent) => {
    setGameState((prev) => {
      const table = prev.tables[tableIndex];
      if (!table || !table.customer || table.dirty) return prev;

      const customer = table.customer;
      const order = customer.order;
      const orderedDish = prev.dishes[order.dishId];
      const riceDish = prev.dishes['kanin'];

      // Check if food is available
      if (!orderedDish || orderedDish.portions <= 0) {
        showToast(`Ubos na ang ${orderedDish?.name || 'ulam'}! Magluto muna.`);
        return prev;
      }
      if (order.wantsExtraRice && riceDish.portions < 2) {
        showToast(`Kulang ang kanin para sa extra rice!`);
        return prev;
      }
      if (riceDish.portions <= 0) {
        showToast(`Walang kanin sa kaldero! Mag-saing muna.`);
        return prev;
      }

      // Calculate bill & tips
      let billEarned = order.totalBill;
      let tip = 0;

      // Generosity based on patience & fast service
      if (customer.patience > 60) tip += 5;
      if (customer.patience > 80) tip += 5;
      if (customer.isVip) tip += 40;

      // Ate Baby cashier bonus (+20% tip)
      if (prev.staff.ateBaby.hired) {
        tip = Math.round(tip * 1.2) + 2;
      }

      // Bawal Umutang decor (+10% tip)
      if (prev.decor.bawalUmutang.bought) {
        tip += 2;
      }

      // Check if this was the Daily Special
      const isDailySpecial = order.dishId === prev.dailySpecialDishId;

      const totalEarned = billEarned + tip;
      sound.playCoin();

      const clickX = event ? event.clientX - 20 : undefined;
      const clickY = event ? event.clientY - 20 : undefined;
      const floatingLabel = isDailySpecial
        ? (tip > 0 ? `+₱${totalEarned} (⭐ Special +₱${tip} Tip!)` : `+₱${totalEarned} (⭐ Special!)`)
        : (tip > 0 ? `+₱${totalEarned} (₱${tip} Tip!)` : `+₱${totalEarned}`);

      addFloatingText(
        floatingLabel,
        clickX,
        clickY,
        isDailySpecial ? 'text-amber-300' : 'text-emerald-400'
      );

      // Deduct portions
      const updatedDishes = { ...prev.dishes };
      updatedDishes[order.dishId] = {
        ...orderedDish,
        portions: Math.max(0, orderedDish.portions - 1),
      };
      updatedDishes['kanin'] = {
        ...riceDish,
        portions: Math.max(0, riceDish.portions - (order.wantsExtraRice ? 2 : 1)),
      };

      // Set table to dirty
      const updatedTables = prev.tables.map((t, idx) =>
        idx === tableIndex
          ? { ...t, customer: null, dirty: true, plateDishName: orderedDish.name }
          : t
      );

      // Achievements check
      const updatedAchievements = prev.achievements.map((a) => {
        if (a.id === 'serve_20') return { ...a, progress: a.progress + 1 };
        return a;
      });

      return {
        ...prev,
        money: prev.money + totalEarned,
        reputation: Math.min(100, prev.reputation + 2),
        totalCustomersServed: prev.totalCustomersServed + 1,
        totalRevenueAllTime: prev.totalRevenueAllTime + totalEarned,
        todayStats: {
          ...prev.todayStats,
          grossRevenue: prev.todayStats.grossRevenue + billEarned,
          tipsEarned: prev.todayStats.tipsEarned + tip,
          customersServed: prev.todayStats.customersServed + 1,
          dailySpecialServed: prev.todayStats.dailySpecialServed + (isDailySpecial ? 1 : 0),
        },
        dishes: updatedDishes,
        tables: updatedTables,
        achievements: updatedAchievements,
      };
    });
  }, [addFloatingText, showToast]);

  // Clean table logic
  const handleCleanTable = useCallback((tableIndex: number, event?: React.MouseEvent) => {
    setGameState((prev) => {
      const table = prev.tables[tableIndex];
      if (!table || !table.dirty) return prev;

      sound.playClean();
      const clickX = event ? event.clientX - 10 : undefined;
      const clickY = event ? event.clientY - 10 : undefined;
      addFloatingText('Nalinis! 🧽', clickX, clickY, 'text-cyan-300');

      return {
        ...prev,
        tables: prev.tables.map((t, idx) =>
          idx === tableIndex ? { ...t, dirty: false } : t
        ),
      };
    });
  }, [addFloatingText]);

  // Give water logic
  const handleGiveWater = useCallback((tableIndex: number) => {
    setGameState((prev) => {
      const table = prev.tables[tableIndex];
      if (!table || !table.customer || table.dirty) return prev;

      sound.playWater();
      showToast(`Binigyan ng malamig na tubig si ${table.customer.name}!`);

      return {
        ...prev,
        tables: prev.tables.map((t, idx) =>
          idx === tableIndex && t.customer
            ? { ...t, customer: { ...t.customer, patience: Math.min(100, t.customer.patience + 35) } }
            : t
        ),
      };
    });
  }, [showToast]);

  // Unlock table
  const handleUnlockTable = useCallback((tableIndex: number) => {
    setGameState((prev) => {
      const table = prev.tables[tableIndex];
      if (!table || !table.locked) return prev;
      if (prev.money < table.unlockCost) {
        showToast(`Kulang ang pera pambili ng mesa! (₱${table.unlockCost})`);
        return prev;
      }

      sound.playFanfare();
      showToast(`Binuksan ang ${table.label}! Pwede nang maupuan.`);

      return {
        ...prev,
        money: prev.money - table.unlockCost,
        tables: prev.tables.map((t, idx) =>
          idx === tableIndex ? { ...t, locked: false } : t
        ),
      };
    });
  }, [showToast]);

  // Pet Muning the Cat
  const handlePetCat = useCallback((e: React.MouseEvent) => {
    sound.playMeow();
    const luckyReward = Math.floor(Math.random() * 12) + 3; // ₱3 - ₱14

    setGameState((prev) => {
      const updatedAchievements = prev.achievements.map((a) => {
        if (a.id === 'pet_cat') return { ...a, progress: a.progress + 1 };
        return a;
      });

      return {
        ...prev,
        money: prev.money + luckyReward,
        catPettedCount: prev.catPettedCount + 1,
        achievements: updatedAchievements,
      };
    });

    addFloatingText(`+₱${luckyReward} Swerte!`, e.clientX - 20, e.clientY - 20, 'text-amber-400');
    showToast('Hinimamas mo si Muning! May nag-iwan ng barya.');
  }, [addFloatingText, showToast]);

  // Toggle Radio
  const handleToggleRadio = useCallback(() => {
    setGameState((prev) => {
      const nextPlaying = !prev.radioPlaying;
      if (nextPlaying) {
        sound.startRadioMusic();
        showToast('📻 AM Radio On: DZBB Balita at Manila Sound!');
      } else {
        sound.stopRadioMusic();
        showToast('📻 AM Radio Off');
      }
      return { ...prev, radioPlaying: nextPlaying };
    });
  }, [showToast]);

  // Change Fan Speed
  const handleChangeFanSpeed = useCallback(() => {
    sound.playClick();
    setGameState((prev) => {
      const nextSpeed = ((prev.fanSpeed + 1) % 4) as 0 | 1 | 2 | 3;
      showToast(`💨 Stand Fan: ${nextSpeed === 0 ? 'Naka-off' : `Number ${nextSpeed} Speed`}`);
      return { ...prev, fanSpeed: nextSpeed };
    });
  }, [showToast]);

  // Unlock Dish
  const handleUnlockDish = useCallback((dishId: string) => {
    setGameState((prev) => {
      const dish = prev.dishes[dishId];
      if (!dish || dish.unlocked) return prev;
      if (prev.money < dish.unlockCost) {
        showToast(`Kulang ang ipon para sa resipe! (Kailangan: ₱${dish.unlockCost})`);
        return prev;
      }

      sound.playFanfare();
      showToast(`Nabuksan ang bagong ulam: ${dish.name}! 🎉`);

      const unlockedCount = Object.values(prev.dishes).filter((d) => d.unlocked).length + 1;
      const updatedAchievements = prev.achievements.map((a) => {
        if (a.id === 'unlock_all_dishes') return { ...a, progress: unlockedCount };
        return a;
      });

      return {
        ...prev,
        money: prev.money - dish.unlockCost,
        reputation: Math.min(100, prev.reputation + 5),
        dishes: {
          ...prev.dishes,
          [dishId]: { ...dish, unlocked: true },
        },
        achievements: updatedAchievements,
      };
    });
  }, [showToast]);

  // Upgrade Dish
  const handleUpgradeDish = useCallback((dishId: string) => {
    setGameState((prev) => {
      const dish = prev.dishes[dishId];
      if (!dish || !dish.unlocked) return prev;
      const cost = Math.round(dish.cost * 12 * dish.level);
      if (prev.money < cost) {
        showToast(`Kulang ang puhunan para i-upgrade ang resipe! (₱${cost})`);
        return prev;
      }

      sound.playCoin();
      showToast(`Pina-level up ang resipe ng ${dish.name}! (Antas ${dish.level + 1})`);

      return {
        ...prev,
        money: prev.money - cost,
        dishes: {
          ...prev.dishes,
          [dishId]: {
            ...dish,
            level: dish.level + 1,
            price: Math.round(dish.price * 1.2),
            maxPortions: dish.maxPortions + 4,
          },
        },
      };
    });
  }, [showToast]);

  // Hire Staff
  const handleHireStaff = useCallback((staffId: string) => {
    setGameState((prev) => {
      const staff = prev.staff[staffId];
      if (!staff || staff.hired) return prev;
      if (prev.money < staff.cost) {
        showToast(`Kulang ang pera pambayad sa pag-hire! (₱${staff.cost})`);
        return prev;
      }

      sound.playFanfare();
      showToast(`Maligayang pagdating kay ${staff.name}! 🤝`);

      const hiredCount = Object.values(prev.staff).filter((s) => s.hired).length + 1;
      const updatedAchievements = prev.achievements.map((a) => {
        if (a.id === 'hire_first') return { ...a, progress: hiredCount };
        return a;
      });

      return {
        ...prev,
        money: prev.money - staff.cost,
        reputation: Math.min(100, prev.reputation + 4),
        staff: {
          ...prev.staff,
          [staffId]: { ...staff, hired: true },
        },
        achievements: updatedAchievements,
      };
    });
  }, [showToast]);

  // Upgrade Staff
  const handleUpgradeStaff = useCallback((staffId: string) => {
    setGameState((prev) => {
      const staff = prev.staff[staffId];
      if (!staff || !staff.hired) return prev;
      const cost = Math.round(staff.upgradeCost * staff.level);
      if (prev.money < cost) {
        showToast(`Kulang ang pera para sa pagsasanay! (₱${cost})`);
        return prev;
      }

      sound.playCoin();
      showToast(`Tumaas ang antas ni ${staff.name} sa Level ${staff.level + 1}!`);

      return {
        ...prev,
        money: prev.money - cost,
        staff: {
          ...prev.staff,
          [staffId]: {
            ...staff,
            level: staff.level + 1,
            currentTask: `Sanay na sa Antas ${staff.level + 1}`,
          },
        },
      };
    });
  }, [showToast]);

  // Buy Decor
  const handleBuyDecor = useCallback((decorId: string) => {
    setGameState((prev) => {
      const decor = prev.decor[decorId];
      if (!decor || decor.bought) return prev;
      if (prev.money < decor.cost) {
        showToast(`Kulang ang pera para sa ${decor.name}! (₱${decor.cost})`);
        return prev;
      }

      sound.playFanfare();
      showToast(`Nabili na ang ${decor.name}! ✨`);

      return {
        ...prev,
        money: prev.money - decor.cost,
        reputation: Math.min(100, prev.reputation + 6),
        decor: {
          ...prev.decor,
          [decorId]: { ...decor, bought: true },
        },
      };
    });
  }, [showToast]);

  // Reset Game
  const handleResetGame = useCallback(() => {
    if (window.confirm('Sigurado ka bang nais mong mag-umpisa muli mula sa simula?')) {
      localStorage.removeItem(STORAGE_KEY);
      sound.stopRadioMusic();
      setGameState(INITIAL_GAME_STATE);
      showToast('Nagsimula muli ang Karinderya!');
    }
  }, [showToast]);

  // Spawn customer logic helper
  const trySpawnCustomer = useCallback(() => {
    setGameState((prev) => {
      if (prev.isPaused) return prev;

      // Find available table spots
      const availableIndices = prev.tables
        .map((t, idx) => (!t.locked && !t.customer && !t.dirty ? idx : -1))
        .filter((idx) => idx !== -1);

      if (availableIndices.length === 0) return prev;

      // Spawn rate chance modifier based on shift & decor
      let spawnChance = 0.5;
      if (prev.shift === 'TANGHALIAN') spawnChance += 0.35; // Lunch rush!
      if (prev.shift === 'HAPUNAN') spawnChance += 0.25; // Dinner rush!
      if (prev.decor.fiestaTarp.bought) spawnChance += 0.2;
      if (prev.staff.manongBert.hired) spawnChance += 0.25;

      if (Math.random() > spawnChance) return prev;

      // Pick random table spot
      const targetTableIndex =
        availableIndices[Math.floor(Math.random() * availableIndices.length)];

      // Pick archetype
      const pool = CUSTOMER_ARCHETYPES.filter((arch) => {
        if (arch.isVip && !prev.decor.videokeBox.bought) return false;
        return true;
      });

      const persona: CustomerArchetype = pool[Math.floor(Math.random() * pool.length)];

      // Pick dish: Customer has a high chance (45%) of picking today's Daily Special if unlocked!
      const unlockedDishKeys = Object.keys(prev.dishes).filter(
        (k) => prev.dishes[k].unlocked && k !== 'kanin'
      );

      let chosenDishId = unlockedDishKeys[0] || 'adobo';
      if (
        prev.dailySpecialDishId &&
        prev.dishes[prev.dailySpecialDishId]?.unlocked &&
        Math.random() < 0.45
      ) {
        // Customer noticed the Daily Special chalkboard!
        chosenDishId = prev.dailySpecialDishId;
      } else if (unlockedDishKeys.includes(persona.favDish)) {
        chosenDishId = persona.favDish;
      } else if (unlockedDishKeys.length > 0) {
        chosenDishId = unlockedDishKeys[Math.floor(Math.random() * unlockedDishKeys.length)];
      }

      const dishObj = prev.dishes[chosenDishId];
      const isDailySpecial = chosenDishId === prev.dailySpecialDishId;
      // 20% price bonus for Daily Special
      const effectiveDishPrice = isDailySpecial
        ? Math.round(dishObj.price * 1.2)
        : dishObj.price;
      const extraRice = Math.random() > 0.6;
      const totalBill = effectiveDishPrice + 15 + (extraRice ? 15 : 0);

      const customer: Customer = {
        id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: persona.name,
        archetypeId: persona.id,
        title: persona.title,
        avatar: persona.avatar,
        quote: persona.quote,
        order: {
          dishId: chosenDishId,
          dishName: dishObj.name,
          icon: dishObj.icon,
          wantsExtraRice: extraRice,
          totalBill,
        },
        patience: persona.patienceBase,
        maxPatience: persona.patienceBase,
        isVip: persona.isVip,
        tableIndex: targetTableIndex,
        state: 'waiting',
      };

      const updatedTables = prev.tables.map((t, idx) =>
        idx === targetTableIndex ? { ...t, customer } : t
      );

      return {
        ...prev,
        tables: updatedTables,
      };
    });
  }, []);

  // Main Simulation Loop (runs every 600ms)
  useEffect(() => {
    const tickInterval = 600 / gameState.gameSpeed;

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.isPaused) return prev;

        let modified = false;
        let nextRep = prev.reputation;
        let walkoutsCount = prev.todayStats.walkouts;
        let updatedTables = [...prev.tables];
        let updatedStaff = { ...prev.staff };
        let updatedDishes = { ...prev.dishes };
        let nextMoney = prev.money;
        let todayServed = prev.todayStats.customersServed;
        let todayGross = prev.todayStats.grossRevenue;
        let todayTips = prev.todayStats.tipsEarned;
        let todayDailySpecialCount = prev.todayStats.dailySpecialServed || 0;
        let totalRevenue = prev.totalRevenueAllTime;
        let totalServed = prev.totalCustomersServed;

        // 1. Advance Shift & Day Progression
        let nextShiftProgress = prev.shiftProgress + 0.6 * prev.gameSpeed;
        let nextShift: ShiftTime = prev.shift;
        let nextDay = prev.day;

        if (nextShiftProgress >= 100) {
          nextShiftProgress = 0;
          if (prev.shift === 'ALMUSAL') {
            nextShift = 'TANGHALIAN';
            showToast('🌞 Tanghalian Rush na! Dagsa ang gutom na suki!');
          } else if (prev.shift === 'TANGHALIAN') {
            nextShift = 'MERIENDA';
            showToast('☕ Merienda Time: Palamig at meryenda!');
          } else if (prev.shift === 'MERIENDA') {
            nextShift = 'HAPUNAN';
            showToast('🌙 Hapunan Dinner Rush!');
          } else if (prev.shift === 'HAPUNAN') {
            // Day ended! Trigger Daily Summary
            nextShift = 'ALMUSAL';
            nextDay = prev.day + 1;

            // Deduct staff wages
            const totalWages = Object.values(prev.staff)
              .filter((s) => s.hired)
              .reduce((acc, cur) => acc + cur.dailyWage, 0);

            nextMoney = Math.max(0, nextMoney - totalWages);

            const reviews = [
              { customerName: 'Kuya Carding', comment: 'Sulit ang extra rice at sabaw boss! Balik ako bukas!', stars: 5 },
              { customerName: 'Aling Marites', comment: 'Mabilis ang serbisyo ngayon, masarap ang menudo!', stars: 4 },
              { customerName: 'Jemima', comment: 'Buhay na buhay ang shift ko dahil sa mainit na sinigang.', stars: 5 },
              { customerName: 'Mark Lester', comment: 'Pasok sa budget ng estudyante! The best karinderya!', stars: 5 },
              { customerName: 'Kuya Boy', comment: 'Malasa ang kaldereta, busog ang buong construction team.', stars: 5 },
            ];
            const chosenReview = reviews[Math.floor(Math.random() * reviews.length)];

            const summary: DailySummary = {
              day: prev.day,
              grossRevenue: prev.todayStats.grossRevenue,
              ingredientExpenses: prev.todayStats.ingredientExpenses,
              staffWages: totalWages,
              tipsEarned: prev.todayStats.tipsEarned,
              netProfit:
                prev.todayStats.grossRevenue +
                prev.todayStats.tipsEarned -
                prev.todayStats.ingredientExpenses -
                totalWages,
              customersServed: prev.todayStats.customersServed,
              walkouts: prev.todayStats.walkouts,
              starRating: Math.max(3, Math.min(5, Math.round(prev.reputation / 20))),
              dailySpecialDishId: prev.dailySpecialDishId,
              dailySpecialServed: prev.todayStats.dailySpecialServed,
              highlightReview: chosenReview,
            };

            setActiveDailySummary(summary);
            setIsDailySummaryOpen(true);

            // Achievements day 5 check
            const updatedAchievements = prev.achievements.map((a) => {
              if (a.id === 'reach_day_5') return { ...a, progress: nextDay };
              return a;
            });

            // Randomly pick a new Daily Special from unlocked dishes for the new day
            const nextSpecialDishId = pickRandomDailySpecial(prev.dishes, prev.dailySpecialDishId);
            const nextSpecialName = prev.dishes[nextSpecialDishId]?.name || 'Adobo';
            showToast(`⭐ Bagong Araw, Bagong Espesyal: ${nextSpecialName}! (+20% kita ngayon)`);

            return {
              ...prev,
              day: nextDay,
              shift: nextShift,
              shiftProgress: nextShiftProgress,
              money: nextMoney,
              dailySpecialDishId: nextSpecialDishId,
              history: [...prev.history, summary],
              todayStats: {
                grossRevenue: 0,
                ingredientExpenses: 0,
                staffWages: totalWages,
                tipsEarned: 0,
                customersServed: 0,
                walkouts: 0,
                dailySpecialServed: 0,
              },
              achievements: updatedAchievements,
            };
          }
        }

        // 2. Customer Patience Decay
        let patienceDecay = 1.6;
        if (prev.decor.standFan.bought && prev.fanSpeed > 0) {
          patienceDecay *= (1 - prev.fanSpeed * 0.15); // Stand fan slows decay!
        }

        updatedTables = updatedTables.map((t) => {
          if (t.customer && !t.dirty) {
            const nextPatience = t.customer.patience - patienceDecay;
            if (nextPatience <= 0) {
              // Customer walks out in anger
              nextRep = Math.max(0, nextRep - 3);
              walkoutsCount++;
              showToast(`Umalis si ${t.customer.name} sa tagal ng serbisyo! (-3 Rep)`);
              modified = true;
              return { ...t, customer: null };
            }
            modified = true;
            return {
              ...t,
              customer: { ...t.customer, patience: nextPatience },
            };
          }
          return t;
        });

        // 3. Dodong (Dishwasher) Automation
        if (prev.staff.dodong.hired) {
          const dirtySpot = updatedTables.find((t) => t.dirty);
          if (dirtySpot) {
            dirtySpot.dirty = false;
            sound.playClean();
            updatedStaff.dodong = {
              ...updatedStaff.dodong,
              currentTask: `Niligpit ang ${dirtySpot.label}`,
            };
            modified = true;
          } else {
            updatedStaff.dodong = {
              ...updatedStaff.dodong,
              currentTask: 'Nakahanda maghugas',
            };
          }
        }

        // 4. Kuya Jun (Server) Automation
        if (prev.staff.kuyaJun.hired) {
          const seatedTable = updatedTables.find((t) => t.customer && !t.dirty);
          if (seatedTable && seatedTable.customer) {
            const cust = seatedTable.customer;
            const dish = updatedDishes[cust.order.dishId];
            const rice = updatedDishes['kanin'];

            const hasDish = dish && dish.portions > 0;
            const hasRice = rice && rice.portions >= (cust.order.wantsExtraRice ? 2 : 1);

            if (hasDish && hasRice) {
              // Auto serve!
              dish.portions -= 1;
              rice.portions -= cust.order.wantsExtraRice ? 2 : 1;

              let bill = cust.order.totalBill;
              let tip = cust.patience > 50 ? 5 : 0;
              if (prev.staff.ateBaby.hired) tip += 3;
              if (prev.decor.bawalUmutang.bought) tip += 2;

              if (cust.order.dishId === prev.dailySpecialDishId) {
                todayDailySpecialCount += 1;
              }

              const totalEarned = bill + tip;
              nextMoney += totalEarned;
              todayGross += bill;
              todayTips += tip;
              todayServed += 1;
              totalRevenue += totalEarned;
              totalServed += 1;
              nextRep = Math.min(100, nextRep + 2);

              sound.playCoin();

              seatedTable.customer = null;
              seatedTable.dirty = true;
              seatedTable.plateDishName = dish.name;

              updatedStaff.kuyaJun = {
                ...updatedStaff.kuyaJun,
                currentTask: `Nagsilbi ng ${dish.name}${cust.order.dishId === prev.dailySpecialDishId ? ' (Special!)' : ''}`,
              };
              modified = true;
            } else {
              updatedStaff.kuyaJun = {
                ...updatedStaff.kuyaJun,
                currentTask: 'Naghihintay ng luto',
              };
            }
          }
        }

        // 5. Ate Nena (Kusinera) Automation
        let updatedInventory = { ...(prev.inventory || INITIAL_INVENTORY) };
        if (prev.staff.ateNena.hired) {
          const needCookingKey = Object.keys(updatedDishes).find((dKey) => {
            const d = updatedDishes[dKey];
            if (!d.unlocked || d.portions > 2 || d.cooking) return false;

            const reqs = d.requiredIngredients || [];
            let extraRestockCost = 0;
            let hasAll = true;

            for (const r of reqs) {
              const stock = updatedInventory[r.ingredientId] || 0;
              if (stock < r.quantity) {
                if (prev.autoRestockEnabled) {
                  const p = PUREGOLD_INGREDIENTS[r.ingredientId];
                  extraRestockCost += (p?.pricePerUnit || 10) * (r.quantity - stock);
                } else {
                  hasAll = false;
                  break;
                }
              }
            }

            return hasAll && nextMoney >= (d.cost + extraRestockCost);
          });

          if (needCookingKey) {
            const d = updatedDishes[needCookingKey];
            const reqs = d.requiredIngredients || [];
            let extraRestockCost = 0;

            reqs.forEach((r) => {
              const stock = updatedInventory[r.ingredientId] || 0;
              if (stock < r.quantity && prev.autoRestockEnabled) {
                const p = PUREGOLD_INGREDIENTS[r.ingredientId];
                extraRestockCost += (p?.pricePerUnit || 10) * (r.quantity - stock);
                updatedInventory[r.ingredientId] = r.quantity;
              }
              updatedInventory[r.ingredientId] = Math.max(0, (updatedInventory[r.ingredientId] || 0) - r.quantity);
            });

            const totalCookCost = d.cost + extraRestockCost;
            nextMoney -= totalCookCost;
            d.cooking = true;

            sound.playSizzle();
            updatedStaff.ateNena = {
              ...updatedStaff.ateNena,
              currentTask: `Nagluluto ng ${d.name}...`,
            };

            const duration = d.cookTime / prev.gameSpeed;
            setTimeout(() => {
              setGameState((curr) => {
                const targetD = curr.dishes[needCookingKey];
                if (!targetD) return curr;
                sound.playDing();
                return {
                  ...curr,
                  dishes: {
                    ...curr.dishes,
                    [needCookingKey]: {
                      ...targetD,
                      portions: Math.min(targetD.maxPortions, targetD.portions + 4),
                      cooking: false,
                    },
                  },
                  staff: {
                    ...curr.staff,
                    ateNena: { ...curr.staff.ateNena, currentTask: 'Nakahandang magluto' },
                  },
                  totalDishesCooked: curr.totalDishesCooked + 1,
                };
              });
            }, duration);

            modified = true;
          }
        }

        return {
          ...prev,
          money: nextMoney,
          reputation: nextRep,
          shift: nextShift,
          shiftProgress: nextShiftProgress,
          totalCustomersServed: totalServed,
          totalRevenueAllTime: totalRevenue,
          tables: updatedTables,
          staff: updatedStaff,
          dishes: updatedDishes,
          inventory: updatedInventory,
          todayStats: {
            ...prev.todayStats,
            grossRevenue: todayGross,
            tipsEarned: todayTips,
            customersServed: todayServed,
            walkouts: walkoutsCount,
            dailySpecialServed: todayDailySpecialCount,
          },
        };
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [gameState.gameSpeed, showToast]);

  // Customer Arrival Spawner Interval (runs every 3.2s)
  useEffect(() => {
    const spawnTimer = setInterval(() => {
      trySpawnCustomer();
    }, 3200 / gameState.gameSpeed);

    return () => clearInterval(spawnTimer);
  }, [gameState.gameSpeed, trySpawnCustomer]);

  return (
    <div className="min-h-screen bg-[#1c110a] text-stone-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <HeaderBar
        carinderiaName={gameState.carinderiaName}
        money={gameState.money}
        reputation={gameState.reputation}
        day={gameState.day}
        shift={gameState.shift}
        shiftProgress={gameState.shiftProgress}
        isPaused={gameState.isPaused}
        gameSpeed={gameState.gameSpeed}
        soundEnabled={gameState.soundEnabled}
        activeTab={activeTab}
        dailySpecialDish={
          gameState.dailySpecialDishId ? gameState.dishes[gameState.dailySpecialDishId] : null
        }
        onSelectTab={setActiveTab}
        onTogglePause={handleTogglePause}
        onToggleSpeed={handleToggleSpeed}
        onToggleSound={handleToggleSound}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onRenameCarinderia={() => setIsRenameOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 space-y-5">
        {/* Toast Banner */}
        {toastMessage && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 border-2 border-amber-500 text-amber-200 px-4 py-2 rounded-full shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2 pointer-events-none animate-bounce">
            <span>🍛</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab 1: 2D Scene View (Interactive Karinderya & Tables) */}
        {activeTab === 'scene' && (
          <KarinderyaScene
            gameState={gameState}
            onCookDish={handleCookDish}
            onServeCustomer={handleServeCustomer}
            onCleanTable={handleCleanTable}
            onGiveWater={handleGiveWater}
            onUnlockTable={handleUnlockTable}
            onPetCat={handlePetCat}
            onToggleRadio={handleToggleRadio}
            onChangeFanSpeed={handleChangeFanSpeed}
            onShowToast={showToast}
            floatingTexts={floatingTexts}
            onGoToPuregold={() => setActiveTab('puregold')}
          />
        )}

        {/* Tab 2: Menu ng Ulam (Dishes & Cooking Upgrades) */}
        {activeTab === 'dishes' && (
          <DishesPanel
            gameState={gameState}
            onCookDish={handleCookDish}
            onUnlockDish={handleUnlockDish}
            onUpgradeDish={handleUpgradeDish}
            onGoToPuregold={() => setActiveTab('puregold')}
          />
        )}

        {/* Tab 3: Puregold Grocery (Tindahan ni Aling Puring) */}
        {activeTab === 'puregold' && (
          <PuregoldGrocery
            gameState={gameState}
            onBuyIngredients={handleBuyIngredients}
            onToggleAutoRestock={handleToggleAutoRestock}
            onRedeemPoints={handleRedeemPoints}
            onShowToast={showToast}
          />
        )}

        {/* Tab 4: Mga Tauhan (Staff Hiring & Level Ups) */}
        {activeTab === 'staff' && (
          <StaffPanel
            gameState={gameState}
            onHireStaff={handleHireStaff}
            onUpgradeStaff={handleUpgradeStaff}
          />
        )}

        {/* Tab 5: Dekorasyon (Decor, Tables & Equipment) */}
        {activeTab === 'decor' && (
          <DecorPanel
            gameState={gameState}
            onBuyDecor={handleBuyDecor}
            onUnlockTable={handleUnlockTable}
          />
        )}

        {/* Tab 6: Ulat & Benta (Daily Ledger & History) */}
        {activeTab === 'report' && <DailyReportPanel gameState={gameState} />}
      </main>

      {/* Bottom Footer */}
      <footer className="w-full bg-[#160d07] border-t border-amber-950/80 py-4 px-4 text-center text-xs text-stone-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-bold text-amber-300">Kusina ni Bossing</span>
            <span>·</span>
            <span>2D Filipino Karinderya Simulator</span>
            <span>·</span>
            <span>
              Binuo ni{' '}
              <button
                onClick={() => setIsCreditsOpen(true)}
                className="font-bold text-amber-300 hover:text-amber-200 underline decoration-amber-500/50 cursor-pointer transition-colors"
                title="Tingnan ang Credits & Developer Info"
              >
                CJ Gonzales
              </button>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px]">
            <button
              onClick={() => setIsTutorialOpen(true)}
              className="hover:text-amber-300 cursor-pointer transition-colors"
            >
              Paano Maglaro
            </button>
            <span>·</span>
            <button
              onClick={() => setIsAchievementsOpen(true)}
              className="hover:text-amber-300 cursor-pointer transition-colors"
            >
              Mga Nakamit
            </button>
            <span>·</span>
            <button
              onClick={() => setIsCreditsOpen(true)}
              className="text-amber-300 hover:text-amber-200 font-semibold cursor-pointer transition-colors"
            >
              Credits
            </button>
            <span>·</span>
            <button
              onClick={handleResetGame}
              className="text-stone-500 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
              title="I-reset ang lahat ng naipon at bumalik sa Simula"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Bagong Laro (Reset)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DailySummaryModal
        isOpen={isDailySummaryOpen}
        summary={activeDailySummary}
        onClose={() => setIsDailySummaryOpen(false)}
      />

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        achievements={gameState.achievements}
        onClaim={handleClaimAchievement}
        onClose={() => setIsAchievementsOpen(false)}
      />

      <RenameModal
        isOpen={isRenameOpen}
        currentName={gameState.carinderiaName}
        onSave={handleSaveName}
        onClose={() => setIsRenameOpen(false)}
      />

      <CreditsModal
        isOpen={isCreditsOpen}
        onClose={() => setIsCreditsOpen(false)}
      />
    </div>
  );
}
