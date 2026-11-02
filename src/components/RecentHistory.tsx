import React from 'react';
import { HistoryItem } from '../types/chemistry';
import { History, ArrowRight } from 'lucide-react';

interface RecentHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const RecentHistory: React.FC<RecentHistoryProps> = ({
  history,
  onSelect,
  onClear
}) => {
  if (history.length === 0) return null;

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-blue-500" />
          Lịch sử 10 tra cứu gần nhất (lưu trong phiên làm việc)
        </span>
        <button
          onClick={onClear}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-[11px] underline transition"
        >
          Xóa lịch sử
        </button>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {history.map(item => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 transition group"
            title={`Xem lại cấu hình của ${item.ionFormula} (${item.nameVi})`}
          >
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {item.ionFormula}
            </span>
            <span className="text-slate-400 text-[11px]">
              ({item.nameVi})
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
};
