import React from 'react';
import { X, Heart, Sparkles, ChefHat, Code2, Award } from 'lucide-react';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md bg-[#25140b] border-2 border-amber-600 rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col">
        {/* Header Ribbon */}
        <div className="p-4 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 border-b border-amber-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-300" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Mga May-Akda at Pasasalamat (Credits)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-200 hover:text-white hover:bg-amber-900/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 text-center">
          {/* Main Developer Badge */}
          <div className="relative p-5 rounded-xl bg-gradient-to-b from-[#341b0e] to-[#1c0f08] border-2 border-amber-500/80 shadow-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 text-2xl mb-2 filter drop-shadow">
              👨‍💻
            </div>
            <div className="text-xs font-mono font-bold tracking-widest uppercase text-amber-400">
              Developer & Game Creator
            </div>
            <h3 className="text-2xl font-black text-amber-200 mt-0.5 tracking-tight font-sans">
              CJ Gonzales
            </h3>
            <p className="text-xs text-stone-300 mt-1 max-w-xs mx-auto">
              Lead Game Designer, Full-Stack Developer & Culinary Systems Architect
            </p>
          </div>

          {/* Tribute & Details */}
          <div className="space-y-3 text-left text-xs bg-[#1a0e08] p-4 rounded-xl border border-amber-950">
            <div className="flex items-start gap-2.5">
              <ChefHat className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200">Konsepto at Inspirasyon:</strong>
                <p className="text-stone-300 text-[11px] mt-0.5 leading-relaxed">
                  Isang pagpupugay sa tunay na kulturang Pilipino—sa mga masisipag na may-ari ng karinderya, tindero, tagahugas, tsuper ng dyip, at masusugid na suki sa bawat kanto.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-stone-800/80">
              <Code2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200">Teknolohiya at Audio:</strong>
                <p className="text-stone-300 text-[11px] mt-0.5 leading-relaxed">
                  Binuo gamit ang React, TypeScript, Tailwind CSS, at Web Audio API para sa 8-bit procedural sound synthesis.
                </p>
              </div>
            </div>
          </div>

          {/* Filipino Flag & Heart Footer */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-stone-400">
            <span>Gawa nang may pagmamahal</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>para sa sambayanang Pilipino 🇵🇭</span>
          </div>

          {/* Close Action */}
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md cursor-pointer transition-transform active:scale-98"
          >
            Salamat at Mabuhay!
          </button>
        </div>
      </div>
    </div>
  );
};
