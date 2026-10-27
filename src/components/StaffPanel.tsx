import React from 'react';
import { GameState, Staff } from '../types/game';
import { Users, UserPlus, CheckCircle2, Award, Zap, DollarSign } from 'lucide-react';

interface StaffPanelProps {
  gameState: GameState;
  onHireStaff: (staffId: string) => void;
  onUpgradeStaff: (staffId: string) => void;
}

export const StaffPanel: React.FC<StaffPanelProps> = ({
  gameState,
  onHireStaff,
  onUpgradeStaff,
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Overview Banner */}
      <div className="rounded-xl border border-amber-900/60 bg-gradient-to-r from-[#2c180e] via-[#351d11] to-[#201007] p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Pamamahala ng Tauhan at Kasambahay</span>
          </div>
          <h2 className="text-xl font-bold text-amber-200">
            Kumuha ng Maaasahang Katulong sa Karinderya
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            I-automate ang paghuhugas ng pinggan, pagluluto ng ulam, paghahain sa suki, at paniningil ng barya. Ang mga empleyado ay may maliit na arawang sweldo (₱) na binabayaran sa katapusan ng bawat araw.
          </p>
        </div>

        <div className="bg-[#1b0d07] border border-amber-900/60 px-4 py-3 rounded-lg text-xs space-y-1 font-mono shrink-0">
          <div className="text-stone-400">Kasambahay na Kinuha:</div>
          <div className="text-base font-bold text-amber-300">
            {Object.values(gameState.staff).filter((s) => s.hired).length} / {Object.keys(gameState.staff).length} Tauhan
          </div>
          <div className="text-stone-400 pt-1 text-[11px]">
            Kabuuang Arawang Sahod: <span className="text-rose-400 font-bold">₱{Object.values(gameState.staff).filter(s => s.hired).reduce((acc, cur) => acc + cur.dailyWage, 0)}</span>/araw
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(gameState.staff).map((staff) => {
          const upgradeCost = Math.round(staff.upgradeCost * staff.level);
          const isMaxLevel = staff.level >= 5;

          return (
            <div
              key={staff.id}
              className={`rounded-xl border p-4 flex flex-col justify-between shadow-lg transition-all ${
                staff.hired
                  ? 'bg-[#25150d] border-amber-800/60 hover:border-amber-600'
                  : 'bg-stone-950/70 border-stone-800'
              }`}
            >
              <div>
                {/* Header: Avatar, Name & Role */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl filter drop-shadow">{staff.avatar}</span>
                    <div>
                      <h3 className="font-bold text-amber-200 text-base">{staff.name}</h3>
                      <div className="text-xs font-semibold text-emerald-400">{staff.roleTitle}</div>
                    </div>
                  </div>

                  {staff.hired ? (
                    <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded">
                      Nagtatrabaho (Lvl {staff.level})
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold bg-stone-900 text-stone-400 border border-stone-800 px-2 py-0.5 rounded">
                      Available
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-300 mb-4 min-h-[40px] leading-relaxed">
                  {staff.roleDesc}
                </p>

                {/* Status Box */}
                <div className="bg-[#1a0e08] rounded-lg p-3 border border-amber-950 space-y-1.5 text-xs font-mono mb-4">
                  <div className="flex justify-between items-center text-stone-300">
                    <span className="text-stone-400">Puhunan sa Pag-hire:</span>
                    <span className="font-bold text-white">₱{staff.cost}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-300">
                    <span className="text-stone-400">Arawang Sahod:</span>
                    <span className="font-bold text-rose-400">₱{staff.dailyWage} / araw</span>
                  </div>
                  {staff.hired && (
                    <div className="flex justify-between items-center text-stone-300 pt-1.5 border-t border-stone-800 text-[11px]">
                      <span className="text-stone-400">Gawain ngayon:</span>
                      <span className="font-bold text-amber-300 truncate max-w-[170px]">
                        {staff.currentTask}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-amber-900/40">
                {staff.hired ? (
                  <button
                    onClick={() => onUpgradeStaff(staff.id)}
                    disabled={isMaxLevel || gameState.money < upgradeCost}
                    className={`w-full py-2 px-3 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                      isMaxLevel
                        ? 'bg-stone-900 text-stone-500 cursor-not-allowed'
                        : gameState.money >= upgradeCost
                        ? 'bg-amber-800 hover:bg-amber-700 text-amber-100 border border-amber-600 shadow cursor-pointer'
                        : 'bg-stone-900 text-stone-500 border border-stone-800 cursor-not-allowed'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {isMaxLevel ? 'Pinaka-Mabilis Na' : `Pataasin ang Bilis (₱${upgradeCost})`}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => onHireStaff(staff.id)}
                    disabled={gameState.money < staff.cost}
                    className={`w-full py-2 px-3 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                      gameState.money >= staff.cost
                        ? 'bg-emerald-700 hover:bg-emerald-600 text-white shadow cursor-pointer'
                        : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Kunin / Hire (₱{staff.cost})</span>
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
