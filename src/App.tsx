import React, { useState, useEffect, useRef } from 'react';
import {
  calculateElectronConfig,
  formatIonFormula,
  getSuggestions,
  parseInput
} from './utils/chemistry';
import { ChemicalElement, ElectronConfigResult, ExceptionMode, HistoryItem, OrderMode } from './types/chemistry';
import { PeriodicTableModal } from './components/PeriodicTableModal';
import { ResultCards } from './components/ResultCards';
import { RecentHistory } from './components/RecentHistory';
import {
  Plus,
  Search,
  Sun,
  Moon,
  Atom,
  HelpCircle
} from 'lucide-react';

export default function App() {
  // Input states
  const [searchInput, setSearchInput] = useState('Fe');
  const [chargeInput, setChargeInput] = useState<number>(0);
  const [orderMode, setOrderMode] = useState<OrderMode>('shell'); // default 'shell' (theo lớp SGK)
  const [exceptionMode, setExceptionMode] = useState<ExceptionMode>('thpt'); // default 'thpt' (chỉ Cr, Cu)

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<ChemicalElement[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsBoxRef = useRef<HTMLDivElement>(null);

  // Modal periodic table state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Result & Error states
  const [result, setResult] = useState<ElectronConfigResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // History state in JS memory (MAX 10 items, no localStorage/sessionStorage)
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Dark/Light Theme state (defaults to system preference)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Update suggestions on input typing
  useEffect(() => {
    if (!searchInput.trim()) {
      setSuggestions([]);
      return;
    }
    // Extract base string before possible ion signs
    const cleaned = searchInput.trim().replace(/[0-8]?[+-]+$/, '').trim();
    if (cleaned) {
      const matches = getSuggestions(cleaned, 6);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [searchInput]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsBoxRef.current &&
        !suggestionsBoxRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Core execution function
  const executeCalculation = (customElement?: ChemicalElement, customCharge?: number) => {
    setErrorMsg(null);
    setShowSuggestions(false);

    try {
      let targetElement: ChemicalElement | null = null;
      let targetCharge = typeof customCharge === 'number' ? customCharge : chargeInput;

      if (customElement) {
        targetElement = customElement;
      } else {
        const parsed = parseInput(searchInput, chargeInput);
        if (parsed.error) {
          setErrorMsg(parsed.error);
          return;
        }
        if (!parsed.element) {
          setErrorMsg('Vui lòng nhập ký hiệu nguyên tố, số hiệu Z hoặc tên nguyên tố.');
          return;
        }
        targetElement = parsed.element;
        targetCharge = parsed.charge;
        // Sync back charge input if user typed an inline ion like Fe3+
        if (parsed.charge !== chargeInput) {
          setChargeInput(parsed.charge);
        }
      }

      // Calculate configuration
      const res = calculateElectronConfig(targetElement, targetCharge, orderMode, exceptionMode);
      setResult(res);

      // Add to in-memory history (limit to 10 most recent items)
      const newItem: HistoryItem = {
        id: `${res.element.symbol}-${res.charge}-${Date.now()}`,
        input: searchInput,
        symbol: res.element.symbol,
        nameVi: res.element.nameVi,
        z: res.element.z,
        charge: res.charge,
        ionFormula: res.ionFormula,
        timestamp: Date.now()
      };

      setHistory(prev => {
        const filtered = prev.filter(
          item => item.z !== newItem.z || item.charge !== newItem.charge
        );
        return [newItem, ...filtered].slice(0, 10);
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Đã xảy ra lỗi trong quá trình tính toán.');
      }
    }
  };

  // Re-calculate when mode changes if result is active
  useEffect(() => {
    if (result) {
      try {
        const updated = calculateElectronConfig(result.element, result.charge, orderMode, exceptionMode);
        setResult(updated);
      } catch (err: unknown) {
        console.error(err);
      }
    }
  }, [orderMode, exceptionMode]);

  // Initial calculation on mount (default Fe for instant gratification)
  useEffect(() => {
    executeCalculation();
  }, []);

  const handleSelectElementFromTable = (element: ChemicalElement) => {
    setSearchInput(element.symbol);
    executeCalculation(element, chargeInput);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setSearchInput(item.symbol);
    setChargeInput(item.charge);
    const el = parseInput(item.symbol).element;
    if (el) {
      executeCalculation(el, item.charge);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors selection:bg-blue-500 selection:text-white">
      {/* Top Navigation / Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Atom className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>Tính cấu hình electron</span>
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Chuẩn Hóa Học THPT &amp; IUPAC 118 nguyên tố
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Mode switch: THPT vs Đầy đủ */}
            <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 px-1.5">
                Chế độ:
              </span>
              <button
                onClick={() => setExceptionMode('thpt')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  exceptionMode === 'thpt'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Chế độ THPT: Chỉ Cr (24) và Cu (29) được tính là ngoại lệ theo SGK"
              >
                THPT (Cr, Cu)
              </button>
              <button
                onClick={() => setExceptionMode('full')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  exceptionMode === 'full'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Chế độ Đầy đủ: Áp dụng toàn bộ 20 nguyên tố ngoại lệ theo thực nghiệm IUPAC"
              >
                Đầy đủ (20 ngoại lệ)
              </button>
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition"
              aria-label={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
              title={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Mobile Mode Switcher */}
        <div className="sm:hidden flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <span className="font-semibold text-slate-500 dark:text-slate-400">
            Chế độ ngoại lệ:
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setExceptionMode('thpt')}
              className={`px-2 py-1 rounded-md text-xs font-medium ${
                exceptionMode === 'thpt'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              THPT
            </button>
            <button
              onClick={() => setExceptionMode('full')}
              className={`px-2 py-1 rounded-md text-xs font-medium ${
                exceptionMode === 'full'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Đầy đủ
            </button>
          </div>
        </div>

        {/* 1. Khu vực ô nhập theo yêu cầu */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <label
              htmlFor="element-search-input"
              className="block text-sm font-bold text-slate-900 dark:text-white mb-1.5"
            >
              Nhập nguyên tố hoặc ion
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Nhận ký hiệu (Fe, Cu, Na), số hiệu Z (26, 29), tên (Sắt, Đồng), hoặc ion viết liền (Fe3+, Fe2+, Cl-, O2-).
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Ô nhập nguyên tố + Nút "+" mở bảng tuần hoàn */}
              <div className="relative flex-1 flex items-center">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="element-search-input"
                    ref={searchInputRef}
                    type="text"
                    value={searchInput}
                    onChange={e => {
                      setSearchInput(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        executeCalculation();
                      }
                    }}
                    placeholder="Ví dụ: Fe, 26, Sắt, Fe3+, Cl-, Cu..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-base"
                    autoComplete="off"
                  />
                </div>

                {/* Nút "+" kế bên ô nhập mở bảng chọn 118 nguyên tố */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="ml-2 px-3.5 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80 transition flex items-center justify-center font-bold text-lg shadow-sm"
                  title="Mở bảng tuần hoàn 118 nguyên tố"
                  aria-label="Mở bảng chọn 118 nguyên tố"
                >
                  <Plus className="w-5 h-5" />
                </button>

                {/* Autocomplete Suggestions Box */}
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    ref={suggestionsBoxRef}
                    className="absolute top-full left-0 right-14 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-40 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800"
                  >
                    {suggestions.map(el => (
                      <button
                        key={el.z}
                        type="button"
                        onClick={() => {
                          setSearchInput(el.symbol);
                          setShowSuggestions(false);
                          executeCalculation(el, chargeInput);
                        }}
                        className="w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center">
                            {el.symbol}
                          </span>
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white text-sm">
                              {el.nameVi}
                            </span>
                            <span className="text-xs text-slate-400 ml-1.5">
                              ({el.nameEn})
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-slate-500">
                            Z = {el.z}
                          </span>
                          <span className="block text-[10px] uppercase font-bold text-slate-400">
                            Khối {el.block}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Ô "Điện tích ion" (mặc định 0, từ -4 đến +8) */}
              <div className="flex items-center gap-2 sm:w-56">
                <div className="flex-1">
                  <label
                    htmlFor="charge-select"
                    className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1"
                  >
                    Điện tích ion:
                  </label>
                  <select
                    id="charge-select"
                    value={chargeInput}
                    onChange={e => {
                      const newCharge = parseInt(e.target.value, 10);
                      setChargeInput(newCharge);
                      if (result) {
                        executeCalculation(result.element, newCharge);
                      }
                    }}
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>0 (Nguyên tử trung hòa)</option>
                    <optgroup label="Cation (Ion dương)">
                      <option value={1}>+1 (Mất 1 e, ví dụ Na⁺)</option>
                      <option value={2}>+2 (Mất 2 e, ví dụ Fe²⁺, Mg²⁺)</option>
                      <option value={3}>+3 (Mất 3 e, ví dụ Fe³⁺, Al³⁺)</option>
                      <option value={4}>+4 (Mất 4 e, ví dụ Sn⁴⁺, Ti⁴⁺)</option>
                      <option value={5}>+5 (Mất 5 e, trạng thái cao)</option>
                      <option value={6}>+6 (Mất 6 e, trạng thái cao)</option>
                      <option value={7}>+7 (Mất 7 e, ví dụ Mn⁷⁺)</option>
                      <option value={8}>+8 (Mất 8 e, ví dụ Os⁸⁺)</option>
                    </optgroup>
                    <optgroup label="Anion (Ion âm)">
                      <option value={-1}>-1 (Nhận 1 e, ví dụ Cl⁻, F⁻)</option>
                      <option value={-2}>-2 (Nhận 2 e, ví dụ O²⁻, S²⁻)</option>
                      <option value={-3}>-3 (Nhận 3 e, ví dụ N³⁻, P³⁻)</option>
                      <option value={-4}>-4 (Nhận 4 e, ví dụ C⁴⁻)</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* 2. Nút "Xem cấu hình" */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => executeCalculation()}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition active:scale-95 flex items-center justify-center gap-2 h-[46px]"
                >
                  <Search className="w-4 h-4" />
                  <span>Xem cấu hình</span>
                </button>
              </div>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="mt-3 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bonus: Lịch sử 10 tra cứu gần nhất */}
        <RecentHistory
          history={history}
          onSelect={handleSelectHistory}
          onClear={() => setHistory([])}
        />

        {/* 3. Khu vực kết quả gồm các thẻ theo thứ tự a -> i */}
        {result && (
          <ResultCards
            result={result}
            orderMode={orderMode}
            onToggleOrderMode={setOrderMode}
          />
        )}
      </main>

      {/* 118 Elements Periodic Table Modal */}
      <PeriodicTableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectElement={handleSelectElementFromTable}
        selectedZ={result?.element.z}
      />
    </div>
  );
}
