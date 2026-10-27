import React from 'react';
import { DailySummary } from '../types/game';
import { Award, Star, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

interface DailySummaryModalProps {
  isOpen: boolean;
  summary: DailySummary | null;
  onClose: () => void;
}

export const DailySummaryModal: React.FC<DailySummaryModalProps> = ({
  isOpen,
  summary,
  onClose,
}) => {
  if (!isOpen || !summary) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg bg-[#27150c] border-2 border-amber-600 rounded-2xl shadow-2xl overflow-hidden text-stone-100">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 p-4 text-center border-b border-amber-500">
          <div className="text-xs uppercase font-extrabold tracking-widest text-amber-200">
            Turo-Turo Daily Sales Report
          </div>
          <h2 className="text-2xl font-black text-white mt-0.5">
            Tapos Na ang Araw {summary.day}! 🎉
          </h2>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Star Rating Badge */}
          <div className="flex items-center justify-center gap-1.5 py-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= summary.starRating
                    ? 'fill-amber-400 text-amber-400 drop-shadow'
                    : 'text-stone-700'
                }`}
              />
            ))}
            <span className="ml-2 font-bold text-amber-300 text-sm font-mono">
              {summary.starRating} / 5 Rating
            </span>
          </div>

          {/* Breakdown Box */}
          <div className="bg-[#1b0d07] rounded-xl p-4 border border-amber-950 space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center text-stone-300">
              <span>Gross Benta sa Pagkain:</span>
              <span className="font-bold text-emerald-400 text-sm">
                +₱{summary.grossRevenue.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center text-stone-300">
              <span>Dagdag Tips mula sa Suki:</span>
              <span className="font-bold text-emerald-400">
                +₱{summary.tipsEarned.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center text-stone-300">
              <span>Puhunan sa Sangkap:</span>
              <span className="font-bold text-rose-400">
                -₱{summary.ingredientExpenses.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center text-stone-300">
              <span>Sahod ng mga Empleyado:</span>
              <span className="font-bold text-rose-400">
                -₱{summary.staffWages.toLocaleString()}
              </span>
            </div>

            {summary.dailySpecialServed !== undefined && summary.dailySpecialServed > 0 && (
              <div className="flex justify-between items-center text-amber-300 bg-amber-950/40 px-2 py-1 rounded border border-amber-800/40 text-[11px]">
                <span className="flex items-center gap-1 font-sans">
                  <span>⭐</span>
                  <span>Daily Special Naibenta:</span>
                </span>
                <span className="font-bold">{summary.dailySpecialServed} suki (+20% kita!)</span>
              </div>
            )}

            <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-sm">
              <span className="font-bold text-white">Netong Kita (Net Profit):</span>
              <span
                className={`font-black text-base ${
                  summary.netProfit >= 0 ? 'text-amber-300' : 'text-rose-400'
                }`}
              >
                ₱{summary.netProfit.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Customer Highlight Review */}
          {summary.highlightReview && (
            <div className="bg-[#1e1008] border border-amber-900/60 rounded-xl p-3 text-xs">
              <div className="font-semibold text-amber-400 mb-0.5">
                Komentaryo ni {summary.highlightReview.customerName}:
              </div>
              <p className="italic text-stone-300">
                "{summary.highlightReview.comment}"
              </p>
            </div>
          )}

          {/* Next Day Button */}
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>Simulan ang Araw {summary.day + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
