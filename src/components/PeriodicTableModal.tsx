import React, { useState } from 'react';
import { ChemicalElement, BlockType } from '../types/chemistry';
import { ELEMENTS_DATA } from '../utils/elementsData';
import { X, Search } from 'lucide-react';

interface PeriodicTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectElement: (element: ChemicalElement) => void;
  selectedZ?: number;
}

export const BLOCK_COLORS: Record<BlockType, { bg: string; hover: string; text: string; border: string; badge: string }> = {
  s: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    hover: 'hover:bg-rose-100 dark:hover:bg-rose-900/60',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
  },
  p: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/60',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
  },
  d: {
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    hover: 'hover:bg-sky-100 dark:hover:bg-sky-900/60',
    text: 'text-sky-700 dark:text-sky-300',
    border: 'border-sky-200 dark:border-sky-800',
    badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200'
  },
  f: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/60',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200'
  }
};

export const PeriodicTableModal: React.FC<PeriodicTableModalProps> = ({
  isOpen,
  onClose,
  onSelectElement,
  selectedZ
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [hoveredElement, setHoveredElement] = useState<ChemicalElement | null>(null);

  if (!isOpen) return null;

  // Build grid 10 rows x 18 cols
  // Rows 1-7: main table
  // Row 8: Lanthanides 57-71
  // Row 9: Actinides 89-103
  const elementMap = new Map<string, ChemicalElement>();
  ELEMENTS_DATA.forEach(el => {
    elementMap.set(`${el.tableRow}-${el.tableCol}`, el);
  });

  const isMatched = (el: ChemicalElement) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase().trim();
    return (
      el.symbol.toLowerCase().includes(q) ||
      el.nameVi.toLowerCase().includes(q) ||
      el.nameEn.toLowerCase().includes(q) ||
      String(el.z) === q
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Bảng tuần hoàn 118 nguyên tố hóa học"
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Bảng Tuần Hoàn 118 Nguyên Tố Hóa Học</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nhấp vào một nguyên tố để xem cấu hình electron chi tiết
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Legend */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium">
              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Khối s
              </span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Khối p
              </span>
              <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Khối d
              </span>
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Khối f
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              aria-label="Đóng bảng tuần hoàn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-5 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              placeholder="Lọc theo Z, ký hiệu, tên..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {hoveredElement ? (
            <div className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <span className="font-bold text-blue-600 dark:text-blue-400">Z = {hoveredElement.z}</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{hoveredElement.symbol}</span>
              <span>- {hoveredElement.nameVi} ({hoveredElement.nameEn})</span>
              <span className="text-slate-400 text-xs">M = {hoveredElement.atomicMass}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${BLOCK_COLORS[hoveredElement.block].badge}`}>
                Khối {hoveredElement.block}
              </span>
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">
              Rê chuột vào một ô để xem nhanh thông tin
            </div>
          )}
        </div>

        {/* Table scroll area */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6">
          <div className="min-w-[920px] select-none">
            {/* Columns headers 1 to 18 */}
            <div className="grid grid-cols-18 gap-1 mb-1 text-center text-[10px] font-semibold text-slate-400">
              {Array.from({ length: 18 }, (_, i) => (
                <div key={i + 1}>{i + 1}</div>
              ))}
            </div>

            {/* Rows 1 to 7: Main periodic table */}
            <div className="space-y-1">
              {[1, 2, 3, 4, 5, 6, 7].map(row => (
                <div key={row} className="grid grid-cols-18 gap-1">
                  {Array.from({ length: 18 }, (_, colIdx) => {
                    const col = colIdx + 1;

                    // Special slots for Lanthanides and Actinides markers in Period 6 & 7 col 3
                    if (row === 6 && col === 3) {
                      return (
                        <div
                          key="la-marker"
                          className="h-11 rounded border border-dashed border-purple-300 dark:border-purple-800/80 bg-purple-50/50 dark:bg-purple-950/20 flex flex-col items-center justify-center text-[9px] font-medium text-purple-600 dark:text-purple-400 text-center leading-tight"
                          title="Họ Lantan (57-71)"
                        >
                          <span>57-71</span>
                          <span>La-Lu</span>
                        </div>
                      );
                    }

                    if (row === 7 && col === 3) {
                      return (
                        <div
                          key="ac-marker"
                          className="h-11 rounded border border-dashed border-purple-300 dark:border-purple-800/80 bg-purple-50/50 dark:bg-purple-950/20 flex flex-col items-center justify-center text-[9px] font-medium text-purple-600 dark:text-purple-400 text-center leading-tight"
                          title="Họ Actini (89-103)"
                        >
                          <span>89-103</span>
                          <span>Ac-Lr</span>
                        </div>
                      );
                    }

                    const el = elementMap.get(`${row}-${col}`);
                    if (!el) {
                      return <div key={`${row}-${col}`} className="h-11" />;
                    }

                    const matched = isMatched(el);
                    const isSelected = selectedZ === el.z;
                    const styling = BLOCK_COLORS[el.block];

                    return (
                      <button
                        key={el.z}
                        onClick={() => {
                          onSelectElement(el);
                          onClose();
                        }}
                        onMouseEnter={() => setHoveredElement(el)}
                        onMouseLeave={() => setHoveredElement(null)}
                        className={`h-11 rounded border text-left p-1 flex flex-col justify-between transition-all duration-150 relative ${
                          styling.bg
                        } ${styling.hover} ${styling.border} ${styling.text} ${
                          isSelected ? 'ring-2 ring-blue-600 dark:ring-blue-400 font-bold scale-105 z-10' : ''
                        } ${!matched ? 'opacity-25 grayscale' : 'opacity-100 hover:scale-105 hover:z-10 hover:shadow-md'}`}
                        aria-label={`${el.symbol} - ${el.nameVi}, số hiệu ${el.z}`}
                      >
                        <span className="text-[9px] leading-none opacity-80">{el.z}</span>
                        <span className="text-xs font-bold leading-none text-center self-center">{el.symbol}</span>
                        <span className="text-[8px] leading-none truncate opacity-90 text-center">{el.nameVi}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Lanthanide & Actinide separated series */}
            <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
              {/* Row 8: Lanthanides */}
              <div className="grid grid-cols-18 gap-1 items-center">
                <div className="col-span-2 text-right pr-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
                  Họ Lantan
                </div>
                {Array.from({ length: 15 }, (_, i) => {
                  const z = 57 + i;
                  const el = ELEMENTS_DATA.find(e => e.z === z);
                  if (!el) return <div key={z} className="h-11" />;
                  const matched = isMatched(el);
                  const isSelected = selectedZ === el.z;
                  const styling = BLOCK_COLORS[el.block];

                  return (
                    <button
                      key={el.z}
                      onClick={() => {
                        onSelectElement(el);
                        onClose();
                      }}
                      onMouseEnter={() => setHoveredElement(el)}
                      onMouseLeave={() => setHoveredElement(null)}
                      className={`h-11 rounded border text-left p-1 flex flex-col justify-between transition-all duration-150 ${
                        styling.bg
                      } ${styling.hover} ${styling.border} ${styling.text} ${
                        isSelected ? 'ring-2 ring-blue-600 dark:ring-blue-400 font-bold scale-105 z-10' : ''
                      } ${!matched ? 'opacity-25 grayscale' : 'opacity-100 hover:scale-105 hover:z-10 hover:shadow-md'}`}
                      aria-label={`${el.symbol} - ${el.nameVi}, số hiệu ${el.z}`}
                    >
                      <span className="text-[9px] leading-none opacity-80">{el.z}</span>
                      <span className="text-xs font-bold leading-none text-center self-center">{el.symbol}</span>
                      <span className="text-[8px] leading-none truncate opacity-90 text-center">{el.nameVi}</span>
                    </button>
                  );
                })}
                <div className="col-span-1" />
              </div>

              {/* Row 9: Actinides */}
              <div className="grid grid-cols-18 gap-1 items-center">
                <div className="col-span-2 text-right pr-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
                  Họ Actini
                </div>
                {Array.from({ length: 15 }, (_, i) => {
                  const z = 89 + i;
                  const el = ELEMENTS_DATA.find(e => e.z === z);
                  if (!el) return <div key={z} className="h-11" />;
                  const matched = isMatched(el);
                  const isSelected = selectedZ === el.z;
                  const styling = BLOCK_COLORS[el.block];

                  return (
                    <button
                      key={el.z}
                      onClick={() => {
                        onSelectElement(el);
                        onClose();
                      }}
                      onMouseEnter={() => setHoveredElement(el)}
                      onMouseLeave={() => setHoveredElement(null)}
                      className={`h-11 rounded border text-left p-1 flex flex-col justify-between transition-all duration-150 ${
                        styling.bg
                      } ${styling.hover} ${styling.border} ${styling.text} ${
                        isSelected ? 'ring-2 ring-blue-600 dark:ring-blue-400 font-bold scale-105 z-10' : ''
                      } ${!matched ? 'opacity-25 grayscale' : 'opacity-100 hover:scale-105 hover:z-10 hover:shadow-md'}`}
                      aria-label={`${el.symbol} - ${el.nameVi}, số hiệu ${el.z}`}
                    >
                      <span className="text-[9px] leading-none opacity-80">{el.z}</span>
                      <span className="text-xs font-bold leading-none text-center self-center">{el.symbol}</span>
                      <span className="text-[8px] leading-none truncate opacity-90 text-center">{el.nameVi}</span>
                    </button>
                  );
                })}
                <div className="col-span-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
