import React, { useState } from 'react';
import { ElectronConfigResult, OrderMode } from '../types/chemistry';
import { OrbitalDiagram } from './OrbitalDiagram';
import { BLOCK_COLORS } from './PeriodicTableModal';
import {
  Copy,
  Check,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
  Compass,
  Zap,
  Atom
} from 'lucide-react';

interface ResultCardsProps {
  result: ElectronConfigResult;
  orderMode: OrderMode;
  onToggleOrderMode: (mode: OrderMode) => void;
}

export const ResultCards: React.FC<ResultCardsProps> = ({
  result,
  orderMode,
  onToggleOrderMode
}) => {
  const [copied, setCopied] = useState(false);

  const {
    element,
    charge,
    totalElectrons,
    ionFormula,
    isIon,
    subshells,
    fullConfigText,
    condensedConfigText,
    condensedNote,
    shells,
    subshellTotals,
    unpairedElectrons,
    unpairedSubshells,
    magneticPropertyVi,
    magneticExplanation,
    valenceElectrons,
    valenceExplanation,
    isException,
    exceptionReason,
    isPredicted,
    warning
  } = result;

  const handleCopy = () => {
    const textReport = [
      `=== KẾT QUẢ TÍNH CẤU HÌNH ELECTRON ===`,
      `Nguyên tố: ${element.nameVi} (${element.nameEn}) - Ký hiệu: ${element.symbol} - Số hiệu Z: ${element.z}`,
      `Đối tượng khảo sát: ${isIon ? `Ion ${ionFormula} (Điện tích ${charge > 0 ? `+${charge}` : charge})` : 'Nguyên tử trung hòa'}`,
      `Tổng số electron: ${totalElectrons} e`,
      `Thứ tự sắp xếp: ${orderMode === 'shell' ? 'Theo lớp n (SGK Việt Nam)' : 'Theo mức năng lượng (Aufbau)'}`,
      ``,
      `a. Cấu hình electron đầy đủ:`,
      `   ${fullConfigText}`,
      ``,
      `b. Cấu hình electron rút gọn:`,
      `   ${condensedConfigText}${condensedNote ? ` (${condensedNote})` : ''}`,
      ``,
      `d. Số electron từng lớp:`,
      `   Lớp K (n=1): ${shells.K} e | Lớp L (n=2): ${shells.L} e | Lớp M (n=3): ${shells.M} e | Lớp N (n=4): ${shells.N} e | Lớp O (n=5): ${shells.O} e | Lớp P (n=6): ${shells.P} e | Lớp Q (n=7): ${shells.Q} e`,
      ``,
      `e. Số electron từng phân lớp:`,
      `   - Phân lớp s: ${subshellTotals.s} e`,
      `   - Phân lớp p: ${subshellTotals.p} e`,
      `   - Phân lớp d: ${subshellTotals.d} e`,
      `   - Phân lớp f: ${subshellTotals.f} e`,
      ``,
      `f. Số electron độc thân & Tính chất từ:`,
      `   - Số electron độc thân: ${unpairedElectrons} e ${unpairedSubshells.length > 0 ? `(ở ${unpairedSubshells.join(', ')})` : ''}`,
      `   - Tính chất từ: ${magneticPropertyVi}`,
      `   - Giải thích: ${magneticExplanation}`,
      ``,
      `g. Electron hóa trị:`,
      `   - Số electron hóa trị: ${valenceElectrons} e`,
      `   - Giải thích: ${valenceExplanation}`,
      ``,
      `h. Thông tin nguyên tố:`,
      `   - Z: ${element.z} | Ký hiệu: ${element.symbol} | M: ${element.atomicMass}`,
      `   - Chu kỳ: ${element.period} | Nhóm: ${element.groupIUPAC}`,
      `   - Khối: ${element.block.toUpperCase()} | Loại: ${
        element.category === 'metal'
          ? 'Kim loại'
          : element.category === 'nonmetal'
          ? 'Phi kim'
          : element.category === 'metalloid'
          ? 'Á kim'
          : 'Khí hiếm'
      }`,
      isException ? `\ni. Ngoại lệ cấu hình electron: ${exceptionReason}` : '',
      isPredicted ? `\n(Ghi chú: Z ≥ 104 là cấu hình dự đoán lý thuyết IUPAC)` : ''
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(textReport).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const categoryLabels = {
    metal: 'Kim loại',
    nonmetal: 'Phi kim',
    metalloid: 'Á kim',
    noble_gas: 'Khí hiếm'
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top action bar: Quick summary & Copy result & Order toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl border ${
              BLOCK_COLORS[element.block].bg
            } ${BLOCK_COLORS[element.block].border} ${BLOCK_COLORS[element.block].text}`}
          >
            {element.symbol}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isIon ? `Ion ${ionFormula}` : element.nameVi}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                Z = {element.z}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium">
                {totalElectrons} e
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {element.nameVi} ({element.nameEn}) • Khối lượng: {element.atomicMass} • Chu kỳ {element.period}, Nhóm {element.groupIUPAC}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Order Mode Toggle */}
          <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => onToggleOrderMode('shell')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition ${
                orderMode === 'shell'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Theo lớp (SGK)
            </button>
            <button
              onClick={() => onToggleOrderMode('energy')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition ${
                orderMode === 'energy'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Theo mức năng lượng
            </button>
          </div>

          {/* Copy Button (Bonus) */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
            title="Sao chép toàn bộ kết quả dạng văn bản thuần"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Đã sao chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép kết quả</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Warnings & Notices */}
      {warning && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-200 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>{warning}</div>
        </div>
      )}

      {/* i. Thẻ cảnh báo ngoại lệ (hiển thị nổi bật theo yêu cầu nếu là ngoại lệ) */}
      {isException && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/40 border-2 border-amber-400 dark:border-amber-600 shadow-md">
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-xl bg-amber-500 text-white shadow-sm flex-shrink-0">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-amber-900 dark:text-amber-200">
                  Ngoại lệ cấu hình electron {isPredicted ? '(dự đoán)' : ''}
                </h4>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-semibold">
                  Thực nghiệm
                </span>
              </div>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                {exceptionReason}
              </p>
            </div>
          </div>
        </div>
      )}

      {isPredicted && !isException && (
        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span>
            Nguyên tố có Z ≥ 104 là nguyên tố siêu nặng tổng hợp nhân tạo, cấu hình electron mang tính chất <strong>(dự đoán)</strong> theo mô hình hóa học lượng tử tương đối tính Dirac-Fock.
          </span>
        </div>
      )}

      {/* a. Cấu hình electron đầy đủ */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            a. Cấu hình electron đầy đủ
          </span>
          <span className="text-xs text-slate-400">
            {orderMode === 'shell' ? 'Sắp theo lớp n tăng dần' : 'Sắp theo mức năng lượng tăng dần'}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800/80">
          <div className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide text-slate-900 dark:text-white font-mono break-words leading-relaxed">
            {subshells.map((s, idx) => {
              const styling = BLOCK_COLORS[s.l];
              return (
                <span key={`${s.n}${s.l}-${idx}`} className="inline-block mr-2 sm:mr-3">
                  <span className={styling.text}>
                    {s.n}{s.l}
                  </span>
                  <sup className="text-sm sm:text-base font-black text-slate-700 dark:text-slate-300 ml-0.5">
                    {s.electrons}
                  </sup>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* b. Cấu hình electron rút gọn bằng khí hiếm */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            b. Cấu hình electron rút gọn bằng khí hiếm
          </span>
          {isIon && (
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Rút gọn theo số electron thực của ion ({totalElectrons} e)
            </span>
          )}
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800/80">
          {condensedNote ? (
            <div className="space-y-1">
              <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {fullConfigText}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic">
                {condensedNote}
              </p>
            </div>
          ) : (
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide text-slate-900 dark:text-white font-mono break-words leading-relaxed">
              <span className="text-indigo-600 dark:text-indigo-400 mr-2 sm:mr-3">
                [{result.condensedNobleGas}]
              </span>
              <span
                dangerouslySetInnerHTML={{
                  __html: result.condensedConfigHtml.replace(`[${result.condensedNobleGas}]`, '')
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* c. Sơ đồ orbital */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Atom className="w-4 h-4 text-blue-500" />
            c. Sơ đồ Orbital (Ô lượng tử)
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Tuân thủ Quy tắc Hund &amp; Nguyên lý Pauli (Spin: ↑ dương, ↓ âm)
          </span>
        </div>
        <OrbitalDiagram subshells={subshells} />
      </div>

      {/* d. Số electron từng lớp (K, L, M, N, O, P, Q) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-500" />
            d. Số electron từng lớp (K, L, M, N, O, P, Q)
          </span>
          <span className="text-xs font-semibold text-slate-500">
            Tổng: {totalElectrons} e
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {[
            { shell: 'K', n: 1, count: shells.K, max: 2 },
            { shell: 'L', n: 2, count: shells.L, max: 8 },
            { shell: 'M', n: 3, count: shells.M, max: 18 },
            { shell: 'N', n: 4, count: shells.N, max: 32 },
            { shell: 'O', n: 5, count: shells.O, max: 50 },
            { shell: 'P', n: 6, count: shells.P, max: 72 },
            { shell: 'Q', n: 7, count: shells.Q, max: 98 }
          ].map(s => {
            const isFilled = s.count > 0;
            return (
              <div
                key={s.shell}
                className={`p-3 rounded-xl border text-center transition ${
                  isFilled
                    ? 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 shadow-sm'
                    : 'bg-slate-50/30 dark:bg-slate-900/20 border-dashed border-slate-200 dark:border-slate-800/60 opacity-40'
                }`}
              >
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Lớp {s.shell} (n = {s.n})
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {s.count}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  electron
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* e. Số electron từng phân lớp (s, p, d, f) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-500" />
          e. Số electron từng phân lớp (s, p, d, f)
        </span>

        {/* Totals by block */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['s', 'p', 'd', 'f'] as const).map(block => {
            const styling = BLOCK_COLORS[block];
            const count = subshellTotals[block];
            return (
              <div
                key={block}
                className={`p-3.5 rounded-xl border ${styling.bg} ${styling.border}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase ${styling.text}`}>
                    Phân lớp {block}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${styling.badge}`}>
                    khối {block}
                  </span>
                </div>
                <div className={`text-2xl font-black mt-1 ${styling.text}`}>
                  {count} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">e</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Breakdown of each individual subshell */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            Chi tiết từng phân lớp riêng biệt:
          </div>
          <div className="flex flex-wrap gap-2">
            {subshells.map((s, idx) => (
              <span
                key={`${s.n}${s.l}-${idx}`}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium text-slate-800 dark:text-slate-200"
              >
                {s.n}{s.l}: <strong className="text-blue-600 dark:text-blue-400">{s.electrons}e</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* f. Số electron độc thân & Tính chất từ */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-sky-500" />
          f. Số electron độc thân &amp; Tính chất từ
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Unpaired count card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Số electron độc thân
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {unpairedElectrons}
              </span>
              <span className="text-sm text-slate-500">electron độc thân</span>
            </div>
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
              {unpairedSubshells.length > 0 ? (
                <span>
                  Phân bố tại: <strong className="text-blue-600 dark:text-blue-400">{unpairedSubshells.join(', ')}</strong>
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Không có electron độc thân (tất cả đã ghép đôi)
                </span>
              )}
            </div>
          </div>

          {/* Magnetic property card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Tính chất từ
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`text-xl font-bold px-3 py-0.5 rounded-lg ${
                  unpairedElectrons > 0
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}
              >
                {magneticPropertyVi}
              </span>
              <span className="text-xs text-slate-400">
                ({unpairedElectrons > 0 ? 'Paramagnetic' : 'Diamagnetic'})
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {magneticExplanation}
            </p>
          </div>
        </div>
      </div>

      {/* g. Electron hóa trị */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          g. Electron hóa trị
        </span>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
              {valenceElectrons}
            </span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              electron hóa trị
            </span>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {valenceExplanation}
          </p>
        </div>
      </div>

      {/* h. Thông tin nguyên tố */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-slate-500" />
          h. Thông tin nguyên tố chi tiết (IUPAC &amp; SGK THPT)
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs sm:text-sm">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">Số hiệu nguyên tử (Z)</span>
            <span className="font-extrabold text-base text-slate-900 dark:text-white">{element.z}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">Ký hiệu hóa học</span>
            <span className="font-extrabold text-base text-slate-900 dark:text-white">{element.symbol}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">Tên tiếng Việt</span>
            <span className="font-extrabold text-base text-slate-900 dark:text-white">{element.nameVi}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">Tên tiếng Anh (IUPAC)</span>
            <span className="font-extrabold text-base text-slate-900 dark:text-white">{element.nameEn}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">Khối lượng nguyên tử</span>
            <span className="font-extrabold text-base text-slate-900 dark:text-white">{element.atomicMass}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">Chu kỳ</span>
            <span className="font-extrabold text-base text-slate-900 dark:text-white">Chu kỳ {element.period}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">Nhóm</span>
            <span className="font-extrabold text-base text-slate-900 dark:text-white">Nhóm {element.groupIUPAC}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">Khối electron &amp; Phân loại</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`px-1.5 py-0.5 rounded text-xs font-bold uppercase ${BLOCK_COLORS[element.block].badge}`}>
                Khối {element.block}
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {categoryLabels[element.category]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
