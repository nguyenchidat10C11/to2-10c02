import { BlockType, ChemicalElement, ElectronConfigResult, ExceptionMode, OrderMode, SubshellState } from '../types/chemistry';
import { ELEMENTS_DATA, NOBLE_GASES } from './elementsData';

// Aufbau filling order
export const AUFBAU_ORDER: Array<{ n: number; l: BlockType; max: number }> = [
  { n: 1, l: 's', max: 2 },
  { n: 2, l: 's', max: 2 },
  { n: 2, l: 'p', max: 6 },
  { n: 3, l: 's', max: 2 },
  { n: 3, l: 'p', max: 6 },
  { n: 4, l: 's', max: 2 },
  { n: 3, l: 'd', max: 10 },
  { n: 4, l: 'p', max: 6 },
  { n: 5, l: 's', max: 2 },
  { n: 4, l: 'd', max: 10 },
  { n: 5, l: 'p', max: 6 },
  { n: 6, l: 's', max: 2 },
  { n: 4, l: 'f', max: 14 },
  { n: 5, l: 'd', max: 10 },
  { n: 6, l: 'p', max: 6 },
  { n: 7, l: 's', max: 2 },
  { n: 5, l: 'f', max: 14 },
  { n: 6, l: 'd', max: 10 },
  { n: 7, l: 'p', max: 6 }
];

export const SUBSHELL_CAPACITIES: Record<BlockType, number> = {
  s: 2,
  p: 6,
  d: 10,
  f: 14
};

export const SUBSHELL_ORBITALS: Record<BlockType, number> = {
  s: 1,
  p: 3,
  d: 5,
  f: 7
};

// Exceptional configurations for neutral atoms (experimental / IUPAC standard)
export interface ExceptionDetail {
  z: number;
  config: Record<string, number>; // e.g. { "3d": 5, "4s": 1 }
  reason: string;
  isTHPT: boolean; // true if part of Vietnamese THPT curriculum (Cr, Cu)
}

export const EXCEPTIONS: Record<number, ExceptionDetail> = {
  24: {
    z: 24,
    config: { '3d': 5, '4s': 1 },
    reason: 'Phân lớp 3d bán bão hòa (3d⁵) và 4s bán bão hòa (4s¹) bền vững hơn cấu hình lý thuyết 3d⁴ 4s² do năng lượng trao đổi cực đại.',
    isTHPT: true
  },
  29: {
    z: 29,
    config: { '3d': 10, '4s': 1 },
    reason: 'Phân lớp 3d bão hòa hoàn toàn (3d¹⁰) bền vững hơn cấu hình lý thuyết 3d⁹ 4s² do tính đối xứng cầu và độ bền trường đối xứng.',
    isTHPT: true
  },
  41: {
    z: 41,
    config: { '4d': 4, '5s': 1 },
    reason: 'Sự chuyển dịch 1 electron từ 5s sang 4d làm giảm lực đẩy Coulomb electron-electron, đạt năng lượng thấp hơn so với 4d³ 5s².',
    isTHPT: false
  },
  42: {
    z: 42,
    config: { '4d': 5, '5s': 1 },
    reason: 'Phân lớp 4d bán bão hòa (4d⁵) và 5s bán bão hòa (5s¹) bền vững vượt trội hơn so với 4d⁴ 5s².',
    isTHPT: false
  },
  44: {
    z: 44,
    config: { '4d': 7, '5s': 1 },
    reason: 'Cấu hình 4d⁷ 5s¹ có tổng mức năng lượng thấp hơn và ổn định hơn cấu hình lý thuyết 4d⁶ 5s².',
    isTHPT: false
  },
  45: {
    z: 45,
    config: { '4d': 8, '5s': 1 },
    reason: 'Cấu hình 4d⁸ 5s¹ đạt năng lượng trao đổi tối ưu hơn so với cấu hình 4d⁷ 5s².',
    isTHPT: false
  },
  46: {
    z: 46,
    config: { '4d': 10, '5s': 0 },
    reason: 'Phân lớp 4d bão hòa hoàn toàn (4d¹⁰ 5s⁰) đạt trạng thái cực tiểu năng lượng khép kín, bền vững nhất.',
    isTHPT: false
  },
  47: {
    z: 47,
    config: { '4d': 10, '5s': 1 },
    reason: 'Phân lớp 4d bão hòa hoàn toàn (4d¹⁰) tạo độ bền phân lớp vượt trội hơn 4d⁹ 5s².',
    isTHPT: false
  },
  57: {
    z: 57,
    config: { '5d': 1, '6s': 2 },
    reason: 'Electron thứ 57 điền vào phân lớp 5d thay vì 4f do mức năng lượng 5d thấp hơn 4f ở Lantan.',
    isTHPT: false
  },
  58: {
    z: 58,
    config: { '4f': 1, '5d': 1, '6s': 2 },
    reason: 'Electron phân bố đồng thời giữa 4f và 5d do mức năng lượng 4f và 5d rất gần nhau ở Xeri.',
    isTHPT: false
  },
  64: {
    z: 64,
    config: { '4f': 7, '5d': 1, '6s': 2 },
    reason: 'Phân lớp 4f bán bão hòa hoàn hảo (4f⁷) có năng lượng trao đổi cực đại rất bền vững, electron tiếp theo điền vào 5d.',
    isTHPT: false
  },
  78: {
    z: 78,
    config: { '4f': 14, '5d': 9, '6s': 1 },
    reason: 'Hiệu ứng tương đối tính làm co orbital 6s và bền hóa cấu hình 5d⁹ 6s¹ hơn 5d⁸ 6s².',
    isTHPT: false
  },
  79: {
    z: 79,
    config: { '4f': 14, '5d': 10, '6s': 1 },
    reason: 'Hiệu ứng tương đối tính làm co orbital s và bền hóa phân lớp d bão hòa (5d¹⁰ 6s¹).',
    isTHPT: false
  },
  89: {
    z: 89,
    config: { '6d': 1, '7s': 2 },
    reason: 'Electron điền vào phân lớp 6d thay vì 5f do mức năng lượng 6d thấp hơn ở Actini.',
    isTHPT: false
  },
  90: {
    z: 90,
    config: { '6d': 2, '7s': 2 },
    reason: 'Cấu hình 6d² 7s² có năng lượng thấp hơn 5f² 7s² đối với nguyên tử Tori.',
    isTHPT: false
  },
  91: {
    z: 91,
    config: { '5f': 2, '6d': 1, '7s': 2 },
    reason: 'Mức năng lượng 5f và 6d cạnh tranh, electron phân bố 5f² 6d¹ 7s².',
    isTHPT: false
  },
  92: {
    z: 92,
    config: { '5f': 3, '6d': 1, '7s': 2 },
    reason: 'Mức năng lượng 5f và 6d rất gần nhau ở Urani, phân bố 5f³ 6d¹ 7s².',
    isTHPT: false
  },
  93: {
    z: 93,
    config: { '5f': 4, '6d': 1, '7s': 2 },
    reason: 'Electron phân bố giữa 5f và 6d (5f⁴ 6d¹ 7s²).',
    isTHPT: false
  },
  96: {
    z: 96,
    config: { '5f': 7, '6d': 1, '7s': 2 },
    reason: 'Phân lớp 5f bán bão hòa (5f⁷) đạt cấu hình đối xứng bền vững, electron còn lại ở 6d.',
    isTHPT: false
  },
  103: {
    z: 103,
    config: { '5f': 14, '7s': 2, '7p': 1 },
    reason: 'Hiệu ứng tương đối tính làm co và bền hóa orbital 7p1/2 hơn 6d ở Lorenxi.',
    isTHPT: false
  }
};

/**
 * Superscript numbers helper
 */
export const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹'
};

export function toSuperscript(num: number): string {
  return String(num)
    .split('')
    .map(digit => SUPERSCRIPT_MAP[digit] || digit)
    .join('');
}

/**
 * Format ion formula cleanly (e.g. Fe³⁺, Cl⁻, Na⁺, O²⁻)
 */
export function formatIonFormula(symbol: string, charge: number): string {
  if (charge === 0) return symbol;
  const absCharge = Math.abs(charge);
  const sign = charge > 0 ? '⁺' : '⁻';
  if (absCharge === 1) {
    return `${symbol}${sign}`;
  }
  return `${symbol}${toSuperscript(absCharge)}${sign}`;
}

/**
 * Build ground state neutral electron configuration mapping
 */
export function getNeutralAtomSubshells(z: number, exceptionMode: ExceptionMode = 'thpt'): Map<string, number> {
  const subshellCounts = new Map<string, number>();

  // 1. Standard Aufbau filling
  let remaining = z;
  for (const item of AUFBAU_ORDER) {
    if (remaining <= 0) break;
    const key = `${item.n}${item.l}`;
    const fill = Math.min(remaining, item.max);
    subshellCounts.set(key, fill);
    remaining -= fill;
  }

  // 2. Check exception
  const exception = EXCEPTIONS[z];
  if (exception) {
    const applyException = exceptionMode === 'full' || exception.isTHPT;
    if (applyException) {
      for (const [key, val] of Object.entries(exception.config)) {
        if (val === 0) {
          subshellCounts.delete(key);
        } else {
          subshellCounts.set(key, val);
        }
      }
    }
  }

  return subshellCounts;
}

/**
 * Build ion subshell configuration based on neutral atom
 */
export function getIonSubshells(
  z: number,
  charge: number,
  exceptionMode: ExceptionMode = 'thpt'
): Map<string, number> {
  const neutral = getNeutralAtomSubshells(z, exceptionMode);

  if (charge === 0) {
    return neutral;
  }

  const counts = new Map<string, number>(neutral);

  if (charge > 0) {
    // Cation: remove electrons from highest n first;
    // within the same n, remove from highest l (f > d > p > s)
    const lOrder: Record<BlockType, number> = { f: 3, d: 2, p: 1, s: 0 };
    let toRemove = charge;

    while (toRemove > 0) {
      // Find all active subshells with electrons > 0
      const active: Array<{ key: string; n: number; l: BlockType; lVal: number; electrons: number }> = [];
      for (const [key, electrons] of counts.entries()) {
        if (electrons > 0) {
          const n = parseInt(key[0], 10);
          const l = key[1] as BlockType;
          active.push({ key, n, l, lVal: lOrder[l], electrons });
        }
      }

      if (active.length === 0) {
        break; // no more electrons
      }

      // Sort by highest n descending, then highest lVal descending
      active.sort((a, b) => {
        if (b.n !== a.n) return b.n - a.n;
        return b.lVal - a.lVal;
      });

      const target = active[0];
      const removeAmount = Math.min(toRemove, target.electrons);
      const remainingElectrons = target.electrons - removeAmount;

      if (remainingElectrons <= 0) {
        counts.delete(target.key);
      } else {
        counts.set(target.key, remainingElectrons);
      }

      toRemove -= removeAmount;
    }
  } else {
    // Anion (charge < 0): add electrons into next unfilled subshell in Aufbau order
    let toAdd = Math.abs(charge);

    for (const item of AUFBAU_ORDER) {
      if (toAdd <= 0) break;
      const key = `${item.n}${item.l}`;
      const current = counts.get(key) || 0;
      if (current < item.max) {
        const space = item.max - current;
        const addAmount = Math.min(toAdd, space);
        counts.set(key, current + addAmount);
        toAdd -= addAmount;
      }
    }
  }

  return counts;
}

/**
 * Generate orbital boxes according to Hund's Rule and Pauli Exclusion Principle
 */
export function generateOrbitals(
  l: BlockType,
  electrons: number
): Array<{ spinUp: boolean; spinDown: boolean }> {
  const orbitalCount = SUBSHELL_ORBITALS[l];
  const orbitals: Array<{ spinUp: boolean; spinDown: boolean }> = [];

  for (let i = 0; i < orbitalCount; i++) {
    const hasSpinUp = i < Math.min(electrons, orbitalCount);
    const hasSpinDown = electrons > orbitalCount && i < electrons - orbitalCount;
    orbitals.push({
      spinUp: hasSpinUp,
      spinDown: hasSpinDown
    });
  }

  return orbitals;
}

/**
 * Calculate unpaired electrons in a subshell
 */
export function getUnpairedInSubshell(l: BlockType, electrons: number): number {
  const m = SUBSHELL_ORBITALS[l];
  if (electrons <= m) {
    return electrons;
  }
  return 2 * m - electrons;
}

/**
 * Determine noble gas core for condensed configuration
 */
export function getNobleGasCore(totalElectrons: number): { z: number; symbol: string } | null {
  // H and He have totalElectrons <= 2, thus no preceding noble gas
  if (totalElectrons <= 2) {
    return null;
  }

  // Find strictly preceding noble gas (noble.z < totalElectrons)
  let best: { z: number; symbol: string } | null = null;
  for (const noble of NOBLE_GASES) {
    if (noble.z < totalElectrons) {
      best = noble;
    } else {
      break;
    }
  }

  return best;
}

/**
 * Sort subshells according to order mode
 */
export function sortSubshells(
  subshells: SubshellState[],
  orderMode: OrderMode
): SubshellState[] {
  const copy = [...subshells];
  const lOrder: Record<BlockType, number> = { s: 0, p: 1, d: 2, f: 3 };

  if (orderMode === 'shell') {
    // Sắp theo lớp n tăng dần, trong cùng lớp sắp theo s, p, d, f
    copy.sort((a, b) => {
      if (a.n !== b.n) return a.n - b.n;
      return lOrder[a.l] - lOrder[b.l];
    });
  } else {
    // Sắp theo mức năng lượng tăng dần (Aufbau)
    const aufbauIndex = (n: number, l: BlockType): number => {
      return AUFBAU_ORDER.findIndex(x => x.n === n && x.l === l);
    };
    copy.sort((a, b) => aufbauIndex(a.n, a.l) - aufbauIndex(b.n, b.l));
  }

  return copy;
}

/**
 * Calculate valence electrons according to user prompt rules:
 * - Khối s và p: số electron lớp ngoài cùng (n lớn nhất);
 * - Khối d: ns + (n-1)d;
 * - Khối f: ns + (n-1)d + (n-2)f.
 * - Với nhóm 12 (Zn, Cd, Hg): ghi chú "thường chỉ 2 electron ns tham gia".
 * - Với ion: áp dụng cùng quy tắc lên cấu hình ion và nêu rõ đó là ion.
 */
export function calculateValenceElectrons(
  element: ChemicalElement,
  subshells: SubshellState[],
  isIon: boolean
): { count: number; explanation: string } {
  // Find highest n among present subshells with electrons
  let maxN = 0;
  for (const sub of subshells) {
    if (sub.electrons > 0 && sub.n > maxN) {
      maxN = sub.n;
    }
  }

  if (maxN === 0) {
    return { count: 0, explanation: 'Không có electron.' };
  }

  const prefix = isIon ? `Đối với ion: ` : '';

  if (element.block === 's' || element.block === 'p') {
    // Số electron lớp ngoài cùng (n lớn nhất)
    let outerElectrons = 0;
    const parts: string[] = [];
    for (const sub of subshells) {
      if (sub.n === maxN && sub.electrons > 0) {
        outerElectrons += sub.electrons;
        parts.push(`${sub.n}${sub.l}${toSuperscript(sub.electrons)}`);
      }
    }
    return {
      count: outerElectrons,
      explanation: `${prefix}Thuộc khối ${element.block.toUpperCase()}, số electron hóa trị bằng số electron lớp ngoài cùng (lớp n = ${maxN}): ${parts.join(' + ')} = ${outerElectrons} e.`
    };
  }

  if (element.block === 'd') {
    // ns + (n-1)d với n là chu kỳ của nguyên tố
    const n = element.period;
    let nsCount = 0;
    let nMinus1dCount = 0;

    for (const sub of subshells) {
      if (sub.n === n && sub.l === 's') {
        nsCount += sub.electrons;
      }
      if (sub.n === n - 1 && sub.l === 'd') {
        nMinus1dCount += sub.electrons;
      }
    }

    const total = nsCount + nMinus1dCount;

    if (element.group === 12) {
      return {
        count: total,
        explanation: `${prefix}Thuộc khối d (nhóm 12: Zn, Cd, Hg): ${n}s (${nsCount}e) + ${n - 1}d (${nMinus1dCount}e) = ${total} e hóa trị. Chú ý: thường chỉ ${nsCount > 0 ? nsCount : 2} electron ${n}s tham gia phản ứng hóa học (phân lớp ${n - 1}d¹⁰ đã bão hòa và rất trơ).`
      };
    }

    return {
      count: total,
      explanation: `${prefix}Thuộc khối d, số electron hóa trị = ${n}s (${nsCount}e) + ${n - 1}d (${nMinus1dCount}e) = ${total} e.`
    };
  }

  // Khối f: ns + (n-1)d + (n-2)f
  const n = element.period;
  let nsCount = 0;
  let nMinus1dCount = 0;
  let nMinus2fCount = 0;

  for (const sub of subshells) {
    if (sub.n === n && sub.l === 's') {
      nsCount += sub.electrons;
    }
    if (sub.n === n - 1 && sub.l === 'd') {
      nMinus1dCount += sub.electrons;
    }
    if (sub.n === n - 2 && sub.l === 'f') {
      nMinus2fCount += sub.electrons;
    }
  }

  const total = nsCount + nMinus1dCount + nMinus2fCount;
  return {
    count: total,
    explanation: `${prefix}Thuộc khối f, số electron hóa trị = ${n}s (${nsCount}e) + ${n - 1}d (${nMinus1dCount}e) + ${n - 2}f (${nMinus2fCount}e) = ${total} e.`
  };
}

/**
 * Main calculation entrypoint
 */
export function calculateElectronConfig(
  element: ChemicalElement,
  charge: number = 0,
  orderMode: OrderMode = 'shell',
  exceptionMode: ExceptionMode = 'thpt'
): ElectronConfigResult {
  const totalElectrons = element.z - charge;

  if (totalElectrons < 0) {
    throw new Error(`Số electron không thể âm (${totalElectrons} e). Vui lòng chọn điện tích phù hợp!`);
  }

  // Build subshell mapping
  const subshellCounts = getIonSubshells(element.z, charge, exceptionMode);

  // Convert to SubshellState list
  const subshellStates: SubshellState[] = [];
  for (const [key, electrons] of subshellCounts.entries()) {
    if (electrons > 0) {
      const n = parseInt(key[0], 10);
      const l = key[1] as BlockType;
      const orbitals = generateOrbitals(l, electrons);
      subshellStates.push({
        n,
        l,
        electrons,
        maxElectrons: SUBSHELL_CAPACITIES[l],
        orbitals
      });
    }
  }

  // Sort subshells by active order mode
  const sortedSubshells = sortSubshells(subshellStates, orderMode);

  // Full config string
  const fullConfigHtml = sortedSubshells
    .map(s => `${s.n}${s.l}<sup>${s.electrons}</sup>`)
    .join(' ');
  const fullConfigText = sortedSubshells
    .map(s => `${s.n}${s.l}${toSuperscript(s.electrons)}`)
    .join(' ');

  // Condensed configuration
  const nobleGas = getNobleGasCore(totalElectrons);
  let condensedConfigHtml = '';
  let condensedConfigText = '';
  let condensedNote: string | undefined = undefined;

  if (!nobleGas) {
    condensedConfigHtml = fullConfigHtml;
    condensedConfigText = fullConfigText;
    condensedNote = 'H và He (hoặc ion có ≤ 2 electron) không có dạng rút gọn vì không có khí hiếm đứng trước.';
  } else {
    // Get subshells of the noble gas core
    const nobleSubshells = getNeutralAtomSubshells(nobleGas.z, exceptionMode);

    // Remaining subshells: compare counts
    const remainingStates: SubshellState[] = [];
    for (const sub of sortedSubshells) {
      const key = `${sub.n}${sub.l}`;
      const coreElectrons = nobleSubshells.get(key) || 0;
      const valenceElectrons = sub.electrons - coreElectrons;
      if (valenceElectrons > 0) {
        remainingStates.push({
          ...sub,
          electrons: valenceElectrons
        });
      }
    }

    if (remainingStates.length === 0) {
      condensedConfigHtml = `[${nobleGas.symbol}]`;
      condensedConfigText = `[${nobleGas.symbol}]`;
    } else {
      const remHtml = remainingStates
        .map(s => `${s.n}${s.l}<sup>${s.electrons}</sup>`)
        .join(' ');
      const remText = remainingStates
        .map(s => `${s.n}${s.l}${toSuperscript(s.electrons)}`)
        .join(' ');
      condensedConfigHtml = `[${nobleGas.symbol}] ${remHtml}`;
      condensedConfigText = `[${nobleGas.symbol}] ${remText}`;
    }
  }

  // Shell counts (K, L, M, N, O, P, Q)
  const shells = {
    K: 0,
    L: 0,
    M: 0,
    N: 0,
    O: 0,
    P: 0,
    Q: 0
  };
  const shellMap: Record<number, keyof typeof shells> = {
    1: 'K',
    2: 'L',
    3: 'M',
    4: 'N',
    5: 'O',
    6: 'P',
    7: 'Q'
  };

  for (const sub of sortedSubshells) {
    const shellKey = shellMap[sub.n];
    if (shellKey) {
      shells[shellKey] += sub.electrons;
    }
  }

  // Subshell totals
  const subshellTotals = { s: 0, p: 0, d: 0, f: 0 };
  for (const sub of sortedSubshells) {
    subshellTotals[sub.l] += sub.electrons;
  }

  // Unpaired electrons
  let unpairedElectrons = 0;
  const unpairedSubshells: string[] = [];
  for (const sub of sortedSubshells) {
    const unp = getUnpairedInSubshell(sub.l, sub.electrons);
    if (unp > 0) {
      unpairedElectrons += unp;
      unpairedSubshells.push(`${sub.n}${sub.l}${toSuperscript(sub.electrons)} (${unp} e độc thân)`);
    }
  }

  const magneticProperty: 'paramagnetic' | 'diamagnetic' = unpairedElectrons > 0 ? 'paramagnetic' : 'diamagnetic';
  const magneticPropertyVi = unpairedElectrons > 0 ? 'Thuận từ' : 'Nghịch từ';
  const magneticExplanation =
    unpairedElectrons > 0
      ? `Có ${unpairedElectrons} electron độc thân chưa ghép đôi, tạo mômen từ nguyên tử nên bị hút bởi từ trường bên ngoài.`
      : `Tất cả các electron đều đã ghép đôi hoàn toàn (spin đối song ↑↓), tổng mômen từ triệt tiêu nên bị đẩy nhẹ bởi từ trường bên ngoài.`;

  // Valence electrons
  const isIon = charge !== 0;
  const { count: valenceElectrons, explanation: valenceExplanation } = calculateValenceElectrons(
    element,
    sortedSubshells,
    isIon
  );

  // Exception handling
  const rawException = EXCEPTIONS[element.z];
  const isException =
    Boolean(rawException) &&
    (exceptionMode === 'full' || (exceptionMode === 'thpt' && rawException.isTHPT));
  const exceptionReason = isException ? rawException.reason : undefined;

  // Predicted flag for elements >= 104
  const isPredicted = element.z >= 104;

  // Ion formula
  const ionFormula = formatIonFormula(element.symbol, charge);

  // Warning check
  let warning: string | undefined = undefined;
  if (Math.abs(charge) > 4) {
    warning = `Cảnh báo: Ion có điện tích |q| = ${Math.abs(charge)} > 4 là trạng thái ion hóa cực đoan (chỉ xuất hiện trong điều kiện plasma hoặc máy gia tốc hạt), không phổ biến trong hóa học THPT.`;
  }

  return {
    element,
    charge,
    totalElectrons,
    ionFormula,
    isIon,
    subshells: sortedSubshells,
    fullConfigHtml,
    fullConfigText,
    condensedConfigHtml,
    condensedConfigText,
    condensedNobleGas: nobleGas?.symbol,
    condensedNote,
    shells,
    subshellTotals,
    unpairedElectrons,
    unpairedSubshells,
    magneticProperty,
    magneticPropertyVi,
    magneticExplanation,
    valenceElectrons,
    valenceExplanation,
    isException,
    exceptionReason,
    isPredicted,
    warning
  };
}

/**
 * Normalization helper for Vietnamese search strings
 */
export function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Parse input string for element and charge
 * Supports:
 * - "Fe", "fe", "26", "Sat", "Sắt", "Iron"
 * - "Fe3+", "Fe+3", "Fe+++", "Fe2+", "Fe++", "Cl-", "O2-", "O--", "Na+", "Cu2+"
 */
export function parseInput(rawInput: string, defaultCharge: number = 0): {
  element: ChemicalElement | null;
  charge: number;
  error?: string;
} {
  const input = rawInput.trim();
  if (!input) {
    return { element: null, charge: defaultCharge };
  }

  // Check if string contains ion notation like Fe3+, Fe+3, Fe++, Cl-, O2-, O--
  // Regex to detect ion tail
  let baseStr = input;
  let charge = defaultCharge;

  // Patterns:
  // 1. Symbol/Name followed by number then + or - (e.g. Fe3+, O2-)
  // 2. Symbol/Name followed by + or - then number (e.g. Fe+3, O-2)
  // 3. Symbol/Name followed by multiple + or - (e.g. Fe+++, Fe++, O--, Cl-)
  // 4. Symbol/Name followed by single + or - (e.g. Na+, Cl-)

  const numSignMatch = input.match(/^(.*?)([1-8])([+-])$/i);
  const signNumMatch = input.match(/^(.*?)([+-])([1-8])$/i);
  const multiPlusMatch = input.match(/^(.*?)(\+{1,8})$/);
  const multiMinusMatch = input.match(/^(.*?)(-{1,4})$/);

  if (numSignMatch) {
    baseStr = numSignMatch[1].trim();
    const val = parseInt(numSignMatch[2], 10);
    charge = numSignMatch[3] === '+' ? val : -val;
  } else if (signNumMatch) {
    baseStr = signNumMatch[1].trim();
    const val = parseInt(signNumMatch[3], 10);
    charge = signNumMatch[2] === '+' ? val : -val;
  } else if (multiPlusMatch && multiPlusMatch[1].length > 0) {
    baseStr = multiPlusMatch[1].trim();
    charge = multiPlusMatch[2].length;
  } else if (multiMinusMatch && multiMinusMatch[1].length > 0) {
    baseStr = multiMinusMatch[1].trim();
    charge = -multiMinusMatch[2].length;
  }

  // Find element
  const element = findElement(baseStr);
  if (!element) {
    return {
      element: null,
      charge,
      error: `Không tìm thấy nguyên tố nào phù hợp với "${baseStr}". Vui lòng nhập số Z (1-118), ký hiệu (Fe, Cu...) hoặc tên (Sắt, Đồng...).`
    };
  }

  // Validate charge
  if (charge > element.z) {
    return {
      element,
      charge,
      error: `Điện tích ion dương (+${charge}) không thể lớn hơn số hiệu nguyên tử Z (${element.z}) của ${element.nameVi}!`
    };
  }

  return { element, charge };
}

/**
 * Search element by Z, symbol, nameVi, nameEn
 */
export function findElement(query: string): ChemicalElement | null {
  const q = query.trim();
  if (!q) return null;

  // Try parsing as integer Z
  const z = parseInt(q, 10);
  if (!isNaN(z) && String(z) === q) {
    if (z >= 1 && z <= 118) {
      return ELEMENTS_DATA[z - 1] || null;
    }
    return null;
  }

  const lowerQ = q.toLowerCase();
  const normQ = removeVietnameseAccents(q);

  // Exact symbol match (case insensitive)
  const exactSymbol = ELEMENTS_DATA.find(e => e.symbol.toLowerCase() === lowerQ);
  if (exactSymbol) return exactSymbol;

  // Exact Vietnamese name match (case insensitive)
  const exactVi = ELEMENTS_DATA.find(e => e.nameVi.toLowerCase() === lowerQ);
  if (exactVi) return exactVi;

  // Exact English name match (case insensitive)
  const exactEn = ELEMENTS_DATA.find(e => e.nameEn.toLowerCase() === lowerQ);
  if (exactEn) return exactEn;

  // Normalized Vietnamese name match
  const normVi = ELEMENTS_DATA.find(e => removeVietnameseAccents(e.nameVi) === normQ);
  if (normVi) return normVi;

  return null;
}

/**
 * Autocomplete suggestions for search input
 */
export function getSuggestions(query: string, maxResults: number = 8): ChemicalElement[] {
  const q = query.trim();
  if (!q) return [];

  const lowerQ = q.toLowerCase();
  const normQ = removeVietnameseAccents(q);
  const zNum = parseInt(q, 10);

  const results: ChemicalElement[] = [];

  for (const element of ELEMENTS_DATA) {
    // Check Z match
    if (!isNaN(zNum) && element.z === zNum) {
      results.push(element);
      continue;
    }

    // Check symbol start
    if (element.symbol.toLowerCase().startsWith(lowerQ)) {
      results.push(element);
      continue;
    }

    // Check Vietnamese name start or normalized start
    const nameViLower = element.nameVi.toLowerCase();
    const nameViNorm = removeVietnameseAccents(element.nameVi);
    if (nameViLower.startsWith(lowerQ) || nameViNorm.startsWith(normQ)) {
      results.push(element);
      continue;
    }

    // Check English name start
    if (element.nameEn.toLowerCase().startsWith(lowerQ)) {
      results.push(element);
      continue;
    }

    // Partial contains
    if (
      nameViLower.includes(lowerQ) ||
      nameViNorm.includes(normQ) ||
      element.nameEn.toLowerCase().includes(lowerQ)
    ) {
      results.push(element);
    }
  }

  return results.slice(0, maxResults);
}
