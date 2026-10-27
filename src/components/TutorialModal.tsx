import React from 'react';
import { X, ChefHat, Users, Sparkles, Heart } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-[#27150c] border-2 border-amber-600 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-stone-100">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-800 to-amber-700 border-b border-amber-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-bold text-white">Gabay sa Pagpapatakbo ng Karinderya</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-200 hover:text-white hover:bg-amber-900/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-300">
          <div className="bg-[#1b0d07] p-3 rounded-xl border border-amber-950 space-y-1">
            <h3 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
              <span>🍛 1. Paano Magluto at Mag-serve (Turo-Turo)</span>
            </h3>
            <p className="leading-relaxed">
              Pindutin ang mga ulam sa ibabang display trays para magluto bago pa ito maubos. Kapag umupo ang suki, tingnan ang kanilang order bubble at pindutin ang <strong>"Ihain 🍛"</strong> para maibigay ang pagkain at makakolekta ng barya!
            </p>
          </div>

          <div className="bg-[#1b0d07] p-3 rounded-xl border border-amber-950 space-y-1">
            <h3 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
              <span>🧽 2. Paglilinis ng Maruming Mesa</span>
            </h3>
            <p className="leading-relaxed">
              Pagkatapos kumain ng suki, mag-iiwan sila ng maruming plato. Pindutin ang <strong>"Linisin 🧽"</strong> upang mabuksan muli ang mesa. O kaya, kumuha kay <strong>Dodong</strong> para awtomatiko niyang hugasan!
            </p>
          </div>

          <div className="bg-[#1b0d07] p-3 rounded-xl border border-amber-950 space-y-1">
            <h3 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
              <span>👥 3. Pagkuha ng mga Tauhan (Automation)</span>
            </h3>
            <p className="leading-relaxed">
              Pumunta sa tab na <strong>"Mga Tauhan"</strong>. Si <strong>Ate Nena</strong> ay nagluluto kapag paubos na ang ulam, si <strong>Kuya Jun</strong> ay naghahain sa mesa, si <strong>Ate Baby</strong> ay nagpapataas ng tips, at si <strong>Manong Bert</strong> ay tumatawag ng mga suki!
            </p>
          </div>

          <div className="bg-[#1b0d07] p-3 rounded-xl border border-amber-950 space-y-1">
            <h3 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
              <span>⭐ 4. Daily Special (+20% Benta Kada Araw!)</span>
            </h3>
            <p className="leading-relaxed">
              Bawat bagong araw, random na pumipili ang karinderya ng <strong>"Daily Special"</strong> mula sa iyong mga bukas na ulam. Ang ulam na ito ay binibili ng mga suki nang may <strong>+20% dagdag na presyo</strong>! Magandang paraan ito para mag-ikot ng menu araw-araw at kumita ng mas malaking barya.
            </p>
          </div>

          <div className="bg-[#0e2416] p-3 rounded-xl border border-emerald-700/60 space-y-1">
            <h3 className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
              <span>🛒 5. Pamimili sa Puregold Grocery & Aling Puring</span>
            </h3>
            <p className="leading-relaxed text-emerald-100">
              Pumunta sa tab na <strong>"🛒 Puregold"</strong> upang mag-imbak ng sariwang karne, gulay, at bigas sa presyong pakyawan. Gamitin ang iyong <strong>Tindahan ni Aling Puring Card</strong> para sa rebate points at diskuwento! Pwede ring i-on ang <strong>Express Restock</strong> para awtomatikong mag-order si Ate Nena.
            </p>
          </div>

          <div className="bg-[#1b0d07] p-3 rounded-xl border border-amber-950 space-y-1">
            <h3 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
              <span>💨 5. Pasensya at Dekorasyon</span>
            </h3>
            <p className="leading-relaxed">
              Bumili ng <strong>Standard Electric Fan</strong> upang bumagal ang pagka-inip ng mga suki. I-unlock ang <strong>Tubig Libre</strong> para mabigyan ng malamig na inumin ang mga naghihintay!
            </p>
          </div>

          <div className="bg-[#1b0d07] p-3 rounded-xl border border-amber-950 space-y-1">
            <h3 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
              <span>🐈 6. Si Muning ang Swerte Cat</span>
            </h3>
            <p className="leading-relaxed">
              Pindutin si <strong>Muning</strong> habang natutulog siya sa banig! Hihimasin mo siya, magme-meow, at mag-iiwan ng <strong>₱3 hanggang ₱15</strong> na baryang swerte!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1e1008] border-t border-amber-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs cursor-pointer shadow"
          >
            Naiintindihan Ko Na! Magluto Tayo!
          </button>
        </div>
      </div>
    </div>
  );
};
