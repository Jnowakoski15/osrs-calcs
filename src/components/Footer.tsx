import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#261f18] bg-[#0e0c0a] mt-16 text-xs text-[#8c7e73] py-10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#b5a69a] font-medium">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Hosted natively on Cloudflare Pages with Global Edge Acceleration</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-[#a39487]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Live OSRS Wiki GE Price Engine
            </span>
            <span className="text-[#3d3126]">•</span>
            <a
              href="https://github.com/Jnowakoski15/osrs-calcs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
            >
              GitHub Source & Issues
            </a>
          </div>
        </div>

        <div className="border-t border-[#1f1914] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] leading-relaxed text-[#6d5e53] max-w-2xl text-center md:text-left">
            Old School RuneScape is a registered trademark of Jagex Ltd. OSRS Portal Streamlined is an open-source utility website built for players, theorycrafters, and bots. We are not affiliated with or endorsed by Jagex Ltd.
          </p>
          <div className="text-[11px] text-[#6d5e53] flex items-center gap-1 font-mono">
            Zero-Click OSRS Experience
          </div>
        </div>
      </div>
    </footer>
  );
};
