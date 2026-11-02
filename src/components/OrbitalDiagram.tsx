import React from 'react';
import { SubshellState } from '../types/chemistry';
import { BLOCK_COLORS } from './PeriodicTableModal';

interface OrbitalDiagramProps {
  subshells: SubshellState[];
}

export const OrbitalDiagram: React.FC<OrbitalDiagramProps> = ({ subshells }) => {
  return (
    <div className="flex flex-wrap gap-4 sm:gap-6 items-end p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 overflow-x-auto">
      {subshells.map((sub, sIdx) => {
        const styling = BLOCK_COLORS[sub.l];
        const isFullyFilled = sub.electrons === sub.maxElectrons;

        return (
          <div
            key={`${sub.n}${sub.l}-${sIdx}`}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            {/* Orbital boxes container */}
            <div className="flex items-center -space-x-px">
              {sub.orbitals.map((orb, oIdx) => (
                <div
                  key={oIdx}
                  className={`w-9 h-11 sm:w-10 sm:h-12 border flex items-center justify-center font-bold text-base sm:text-lg select-none transition-colors ${
                    styling.border
                  } ${
                    orb.spinUp || orb.spinDown
                      ? 'bg-white dark:bg-slate-800'
                      : 'bg-slate-100/60 dark:bg-slate-800/40 text-transparent'
                  }`}
                  title={`${sub.n}${sub.l} (orbital ${oIdx + 1}): ${
                    orb.spinUp && orb.spinDown
                      ? '2 electron ghép đôi (↑↓)'
                      : orb.spinUp
                      ? '1 electron độc thân (↑)'
                      : '0 electron (trống)'
                  }`}
                >
                  <span className="flex items-center justify-center tracking-tighter">
                    {orb.spinUp && (
                      <span className="text-blue-600 dark:text-blue-400 leading-none">
                        ↑
                      </span>
                    )}
                    {orb.spinDown && (
                      <span className="text-rose-600 dark:text-rose-400 leading-none">
                        ↓
                      </span>
                    )}
                    {!orb.spinUp && !orb.spinDown && (
                      <span className="text-slate-300 dark:text-slate-700 text-xs font-normal">
                        ·
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Subshell Label */}
            <div className="text-center">
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                  styling.badge
                }`}
              >
                {sub.n}
                {sub.l}
                <sup>{sub.electrons}</sup>
              </span>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                {isFullyFilled ? (
                  <span className="text-emerald-600 dark:text-emerald-400">bão hòa</span>
                ) : sub.electrons === Math.floor(sub.maxElectrons / 2) ? (
                  <span className="text-amber-600 dark:text-amber-400">bán bão hòa</span>
                ) : (
                  <span>{sub.electrons}/{sub.maxElectrons} e</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
