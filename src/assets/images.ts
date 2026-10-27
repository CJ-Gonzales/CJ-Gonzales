/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ESM imports allow Vite to process, hash, and bundle the image assets into dist/
// for 100% permanent availability across all deployments and shared URLs.
import karinderyaStreetBackdrop from './images/karinderya_street_backdrop_1792990114683.jpg';
import puregoldSupermarketAisle from './images/puregold_supermarket_aisle_1793080249533.jpg';
import karinderyaFoodSpread from './images/karinderya_food_spread_1792990113689.jpg';

export const GAME_ASSETS = {
  // Street backdrop showing the jeepney, sari-sari atmosphere, and street scene
  karinderyaStreetBackdrop,
  karinderyaStreetBackdropFallback: '/images/karinderya_street_backdrop.jpg',

  // Puregold supermarket aisle
  puregoldSupermarketAisle,
  puregoldSupermarketAisleFallback: '/images/puregold_supermarket_aisle.jpg',

  // Lutong Bahay food spread
  karinderyaFoodSpread,
  karinderyaFoodSpreadFallback: '/images/karinderya_food_spread.jpg',
} as const;
