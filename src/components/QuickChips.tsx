import React from 'react';

interface QuickChipsProps {
  options: { label: string; value: number | string }[];
  onSelect: (value: any) => void;
  activeValue?: any;
}

export const QuickChips: React.FC<QuickChipsProps> = ({ options, onSelect, activeValue }) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 my-2">
      <span className="text-[11px] text-[#8a7b6f] font-semibold mr-1">Quick:</span>
      {options.map((opt) => {
        const isActive = activeValue !== undefined && activeValue === opt.value;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer border ${
              isActive
                ? 'bg-gradient-to-b from-[#4a361c] to-[#261b0c] text-amber-300 border-amber-500 shadow-sm ring-1 ring-amber-500/40'
                : 'bg-[#15110e] text-[#c4b7ad] border-[#29211a] hover:bg-[#211a15] hover:text-amber-200 hover:border-[#4d3d30]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
