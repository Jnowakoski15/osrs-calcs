import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-stone-800/80 bg-stone-950 mt-16 text-xs text-stone-500 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-400 font-medium">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Hosted natively on Cloudflare Pages with Global Edge Acceleration</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Live OSRS Wiki GE Price Engine
            </span>
            <span className="text-stone-700">•</span>
            <a
              href="https://github.com/Jnowakoski15/osrs-calcs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
            >
              GitHub Source & Issues
            </a>
          </div>
        </div>

        <div className="border-t border-stone-900 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] leading-relaxed text-stone-500 max-w-2xl text-center md:text-left">
            Old School RuneScape is a registered trademark of Jagex Ltd. OSRS Portal Streamlined is an open-source utility website built for players, theorycrafters, and bots. We are not affiliated with or endorsed by Jagex Ltd.
          </p>
          <div className="text-[11px] text-stone-500 flex items-center gap-1">
            Built with care for zero-click OSRS efficiency
          </div>
        </div>
      </div>
    </footer>
  );
};
