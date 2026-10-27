import React from 'react';
import { Achievement } from '../types/game';
import { Trophy, X, CheckCircle, Gift } from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  achievements: Achievement[];
  onClaim: (id: string) => void;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  achievements,
  onClaim,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg max-h-[90vh] bg-[#27150c] border-2 border-amber-600 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-stone-100">
        <div className="p-4 bg-gradient-to-r from-amber-800 to-amber-700 border-b border-amber-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-bold text-white">Mga Parangal at Nakamit (Achievements)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-200 hover:text-white hover:bg-amber-900/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-3">
          {achievements.map((ach) => {
            const isCompleted = ach.progress >= ach.goal;

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 shadow-md ${
                  ach.unlocked
                    ? 'bg-[#1b1009] border-emerald-800/60'
                    : isCompleted
                    ? 'bg-[#2f1b10] border-amber-500 animate-pulse'
                    : 'bg-[#1f1008] border-amber-950 opacity-80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl filter drop-shadow">{ach.icon}</span>
                  <div>
                    <h3 className="font-bold text-amber-200 text-sm flex items-center gap-1.5">
                      <span>{ach.title}</span>
                      {ach.unlocked && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </h3>
                    <p className="text-xs text-stone-300 mt-0.5">{ach.description}</p>
                    <div className="mt-1 text-[11px] font-mono text-stone-400">
                      Progreso: {Math.min(ach.progress, ach.goal)} / {ach.goal}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {ach.unlocked ? (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700 px-2 py-1 rounded">
                      Nakuha Na
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => onClaim(ach.id)}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-xs rounded-lg shadow-lg cursor-pointer flex items-center gap-1 animate-bounce"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Kunin (₱{ach.rewardPeso})</span>
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-stone-400 bg-stone-900 px-2 py-1 rounded border border-stone-800">
                      Gantimpala: ₱{ach.rewardPeso}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
