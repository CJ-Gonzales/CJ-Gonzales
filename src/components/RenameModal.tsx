import React, { useState } from 'react';
import { X, Edit3 } from 'lucide-react';

interface RenameModalProps {
  isOpen: boolean;
  currentName: string;
  onSave: (newName: string) => void;
  onClose: () => void;
}

export const RenameModal: React.FC<RenameModalProps> = ({
  isOpen,
  currentName,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(currentName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  const presetNames = [
    'Kusina ni Bossing',
    'Aling Nena Turo-Turo',
    'Mang Inasal & Ulam',
    'Karinderya sa Kanto',
    'Lutong Bahay Express',
    'Kusina ni Nanay',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md bg-[#27150c] border-2 border-amber-600 rounded-2xl shadow-2xl overflow-hidden text-stone-100">
        <div className="p-4 bg-gradient-to-r from-amber-800 to-amber-700 border-b border-amber-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-amber-300" />
            <h2 className="text-base font-bold text-white">Palitan ang Pangalan ng Karinderya</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-amber-200 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Pangalan ng iyong Kainan:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              className="w-full bg-[#180c06] border border-amber-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-hidden focus:border-amber-400"
              placeholder="e.g. Kusina ni Bossing"
              autoFocus
            />
          </div>

          <div>
            <div className="text-[11px] text-stone-400 mb-1.5">O pumili sa mga sikat na pangalan:</div>
            <div className="flex flex-wrap gap-1.5">
              {presetNames.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setName(p)}
                  className="text-xs bg-[#1a0e08] hover:bg-amber-950 border border-amber-900 px-2 py-1 rounded text-stone-300 cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-amber-950">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs text-stone-400 hover:text-white cursor-pointer"
            >
              Kanselahin
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-lg shadow cursor-pointer"
            >
              I-save ang Pangalan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
