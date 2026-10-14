import React from 'react';

interface QuickChipsProps {
  options: { label: string; value: number | string }[];
  onSelect: (value: any) => void;
  activeValue?: any;
}

export const QuickChips: React.FC<QuickChipsProps> = ({ options, onSelect, activeValue }) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 my-2">
      <span className="text-xs text-stone-400 font-medium mr-1">Quick:</span>
      {options.map((opt) => {
        const isActive = activeValue !== undefined && activeValue === opt.value;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer border ${
              isActive
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm font-semibold'
                : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800 hover:text-amber-300 hover:border-amber-600/50'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
