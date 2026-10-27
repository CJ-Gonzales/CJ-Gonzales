/**
 * Types for Kusina ni Bossing - 2D Filipino Karinderya Simulator
 */

export type ShiftTime = 'ALMUSAL' | 'TANGHALIAN' | 'MERIENDA' | 'HAPUNAN';

export interface IngredientRequirement {
  ingredientId: string;
  name: string;
  quantity: number;
}

export interface Ingredient {
  id: string;
  name: string;
  tagalogName: string;
  category: 'meat' | 'produce' | 'grain' | 'dessert';
  icon: string;
  pricePerUnit: number;
  bulkQty: number;
  bulkDiscountPercent: number;
  unitLabel: string;
  usedInDishIds: string[];
  description: string;
}

export interface AlingPuringCard {
  tier: 'Kasosyo' | 'Silver' | 'Gold';
  points: number;
  totalSpent: number;
  discountRate: number;
}

export interface Dish {
  id: string;
  name: string;
  tagalogName: string;
  category: 'ulam' | 'kanin' | 'merienda';
  icon: string;
  cost: number; // puhunan to prepare
  price: number; // selling price to suki
  portions: number; // available servings in warmer
  maxPortions: number; // tray capacity
  cookTime: number; // milliseconds
  cooking: boolean;
  unlocked: boolean;
  unlockCost: number;
  level: number;
  description: string;
  accentColor: string;
  requiredIngredients: IngredientRequirement[];
}

export interface CustomerOrder {
  dishId: string;
  dishName: string;
  icon: string;
  wantsExtraRice: boolean;
  totalBill: number;
}

export interface Customer {
  id: string;
  name: string;
  archetypeId: string;
  title: string;
  avatar: string;
  quote: string;
  order: CustomerOrder;
  patience: number; // 0 - 100
  maxPatience: number;
  isVip?: boolean;
  tableIndex: number;
  state: 'waiting' | 'eating' | 'leaving';
  eatProgress?: number;
}

export interface TableSpot {
  id: number;
  label: string;
  locked: boolean;
  unlockCost: number;
  customer: Customer | null;
  dirty: boolean;
  plateDishName?: string;
}

export interface Staff {
  id: string;
  name: string;
  roleTitle: string;
  roleDesc: string;
  avatar: string;
  hired: boolean;
  cost: number;
  dailyWage: number;
  level: number;
  upgradeCost: number;
  currentTask: string;
  lastActionTime?: number;
}

export interface DecorItem {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  cost: number;
  bought: boolean;
  level: number;
  maxLevel: number;
  effect: string;
  category: 'comfort' | 'facility' | 'marketing' | 'ambiance' | 'entertainment';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardPeso: number;
  unlocked: boolean;
  progress: number;
  goal: number;
}

export interface DailySummary {
  day: number;
  grossRevenue: number;
  ingredientExpenses: number;
  staffWages: number;
  tipsEarned: number;
  netProfit: number;
  customersServed: number;
  walkouts: number;
  starRating: number;
  dailySpecialDishId?: string | null;
  dailySpecialServed?: number;
  highlightReview: {
    customerName: string;
    comment: string;
    stars: number;
  };
}

export interface GameState {
  carinderiaName: string;
  money: number;
  reputation: number; // 0 to 100 Suki rating
  day: number;
  shift: ShiftTime;
  shiftProgress: number; // 0 to 100
  isPaused: boolean;
  gameSpeed: number; // 1 or 2
  soundEnabled: boolean;
  radioPlaying: boolean;
  fanSpeed: 0 | 1 | 2 | 3;
  catPettedCount: number;
  dailySpecialDishId: string | null;
  
  // Game entities
  dishes: Record<string, Dish>;
  staff: Record<string, Staff>;
  decor: Record<string, DecorItem>;
  tables: TableSpot[];
  
  // Puregold Pantry Inventory & Loyalty
  inventory: Record<string, number>;
  alingPuringCard: AlingPuringCard;
  autoRestockEnabled: boolean;
  
  // Statistics
  totalCustomersServed: number;
  totalDishesCooked: number;
  totalRevenueAllTime: number;
  todayStats: {
    grossRevenue: number;
    ingredientExpenses: number;
    staffWages: number;
    tipsEarned: number;
    customersServed: number;
    walkouts: number;
    dailySpecialServed: number;
  };
  history: DailySummary[];
  achievements: Achievement[];
}
