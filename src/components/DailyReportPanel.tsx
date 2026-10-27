import React from 'react';
import { GameState } from '../types/game';
import { BarChart3, TrendingUp, DollarSign, Users, Award, Star, History } from 'lucide-react';

interface DailyReportPanelProps {
  gameState: GameState;
}

export const DailyReportPanel: React.FC<DailyReportPanelProps> = ({ gameState }) => {
  const { todayStats, history } = gameState;
  const netToday =
    todayStats.grossRevenue +
    todayStats.tipsEarned -
    todayStats.ingredientExpenses -
    todayStats.staffWages;

  return (
    <div className="w-full space-y-6">
      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#24140c] border border-amber-900/60 rounded-xl p-4 shadow-md">
          <div className="text-xs text-stone-400 font-medium">Benta Ngayong Araw</div>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-1">
            ₱{todayStats.grossRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">
            +₱{todayStats.tipsEarned} tips mula sa suki
          </div>
        </div>

        <div className="bg-[#24140c] border border-amber-900/60 rounded-xl p-4 shadow-md">
          <div className="text-xs text-stone-400 font-medium">Gastos sa Sangkap at Sahod</div>
          <div className="text-xl sm:text-2xl font-black font-mono text-rose-400 mt-1">
            ₱{(todayStats.ingredientExpenses + todayStats.staffWages).toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Sahod ng tauhan: ₱{todayStats.staffWages}
          </div>
        </div>

        <div className="bg-[#24140c] border border-amber-900/60 rounded-xl p-4 shadow-md">
          <div className="text-xs text-stone-400 font-medium">Netong Kita (Net Profit)</div>
          <div
            className={`text-xl sm:text-2xl font-black font-mono mt-1 ${
              netToday >= 0 ? 'text-amber-300' : 'text-rose-400'
            }`}
          >
            ₱{netToday.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">Para sa Araw {gameState.day}</div>
        </div>

        <div className="bg-[#24140c] border border-amber-900/60 rounded-xl p-4 shadow-md">
          <div className="text-xs text-stone-400 font-medium">Suki na Naasikaso</div>
          <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1">
            {todayStats.customersServed} Suki
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {todayStats.walkouts} umalis sa tagal
          </div>
        </div>
      </div>

      {/* Lifetime Career Stats */}
      <div className="bg-[#22130b] border border-amber-900/60 rounded-xl p-5 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wide flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Pangkalahatang Rekord (All-Time Career Stats)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-[#190d07] p-3 rounded-lg border border-amber-950">
            <span className="text-stone-400">Kabuuang Benta (Gross Sales):</span>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">
              ₱{gameState.totalRevenueAllTime.toLocaleString()}
            </div>
          </div>

          <div className="bg-[#190d07] p-3 rounded-lg border border-amber-950">
            <span className="text-stone-400">Kabuuang Suki na Nagsilbi:</span>
            <div className="text-lg font-bold text-amber-300 mt-0.5">
              {gameState.totalCustomersServed} mga tao
            </div>
          </div>

          <div className="bg-[#190d07] p-3 rounded-lg border border-amber-950">
            <span className="text-stone-400">Nalutong Putahe at Kanin:</span>
            <div className="text-lg font-bold text-amber-200 mt-0.5">
              {gameState.totalDishesCooked} kawali
            </div>
          </div>
        </div>
      </div>

      {/* Daily Ledger History */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wide flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          <span>Kasaysayan ng mga Nakaraang Araw (Daily Ledger History)</span>
        </h3>

        {history.length === 0 ? (
          <div className="bg-[#22130b] border border-amber-900/40 rounded-xl p-6 text-center text-xs text-stone-400">
            Kasalukuyang nagpapatakbo sa Araw 1. Ang buod at pagsusuri ng benta ay lalabas dito sa pagtatapos ng bawat araw.
          </div>
        ) : (
          <div className="space-y-3">
            {history
              .slice()
              .reverse()
              .map((summary) => (
                <div
                  key={summary.day}
                  className="bg-[#22130b] border border-amber-900/60 rounded-xl p-4 shadow-md text-xs space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-amber-950">
                    <div className="flex items-center gap-2 font-bold text-amber-200 text-sm">
                      <span>Araw {summary.day} Buod</span>
                      <span className="text-amber-400 flex items-center gap-0.5 text-xs font-normal">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{summary.starRating} Stars</span>
                      </span>
                    </div>

                    <div className="font-mono">
                      Netong Kita:{' '}
                      <span
                        className={`font-bold ${
                          summary.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        ₱{summary.netProfit.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-stone-300">
                    <div>Gross: ₱{summary.grossRevenue}</div>
                    <div>Sangkap: ₱{summary.ingredientExpenses}</div>
                    <div>Sahod: ₱{summary.staffWages}</div>
                    <div>Suki: {summary.customersServed} tao</div>
                  </div>

                  {summary.highlightReview && (
                    <div className="p-2 bg-[#180c06] rounded border border-amber-950 italic text-stone-300 text-[11px] flex items-center gap-2">
                      <span className="font-bold text-amber-300 not-italic">
                        {summary.highlightReview.customerName}:
                      </span>
                      <span>"{summary.highlightReview.comment}"</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
