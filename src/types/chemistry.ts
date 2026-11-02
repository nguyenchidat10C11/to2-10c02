/**
 * Data structures and types for Chemistry Electron Configuration
 */

export type BlockType = 's' | 'p' | 'd' | 'f';

export type CategoryType = 'metal' | 'nonmetal' | 'metalloid' | 'noble_gas';

export interface ChemicalElement {
  z: number;
  symbol: string;
  nameVi: string;
  nameEn: string;
  atomicMass: number | string;
  period: number;
  group: number; // 1 to 18
  groupIUPAC: string; // e.g. "VIIIB", "IA", "0 / VIIIA"
  block: BlockType;
  category: CategoryType;
  // Periodic table visual coordinates
  tableRow: number; // 1-7 for main, 8 for Lanthanides (57-71), 9 for Actinides (89-103)
  tableCol: number; // 1-18
  isLanthanide?: boolean;
  isActinide?: boolean;
}

export type OrderMode = 'shell' | 'energy'; // 'shell' (theo lớp n) or 'energy' (theo mức năng lượng)
export type ExceptionMode = 'thpt' | 'full'; // 'thpt' (chỉ Cr, Cu) or 'full' (đầy đủ các ngoại lệ thực nghiệm)

export interface SubshellState {
  n: number;
  l: BlockType;
  electrons: number;
  maxElectrons: number;
  orbitals: Array<{
    spinUp: boolean;
    spinDown: boolean;
  }>;
}

export interface ElectronConfigResult {
  element: ChemicalElement;
  charge: number; // e.g. 0, +2, -1
  totalElectrons: number;
  ionFormula: string; // e.g. "Fe³⁺", "Cl⁻", "Na⁺", "Fe"
  isIon: boolean;
  
  // Subshells according to current order
  subshells: SubshellState[];
  
  // Configurations
  fullConfigHtml: string; // with <sup> e.g. 1s<sup>2</sup> 2s<sup>2</sup>
  fullConfigText: string; // pure text e.g. 1s² 2s²
  condensedConfigHtml: string; // e.g. [Ar] 3d<sup>6</sup>
  condensedConfigText: string; // e.g. [Ar] 3d⁶
  condensedNobleGas?: string;
  condensedNote?: string;
  
  // Electron counts
  shells: {
    K: number;
    L: number;
    M: number;
    N: number;
    O: number;
    P: number;
    Q: number;
  };
  subshellTotals: {
    s: number;
    p: number;
    d: number;
    f: number;
  };
  
  // Quantum & magnetic properties
  unpairedElectrons: number;
  unpairedSubshells: string[]; // e.g. ["3d⁶ (4 e độc thân)"]
  magneticProperty: 'paramagnetic' | 'diamagnetic';
  magneticPropertyVi: string; // "Thuận từ" | "Nghịch từ"
  magneticExplanation: string;
  
  // Valence electrons
  valenceElectrons: number;
  valenceExplanation: string;
  
  // Exception info
  isException: boolean;
  exceptionReason?: string;
  isPredicted?: boolean;
  
  // Warning for high charge or unusual state
  warning?: string;
}

export interface HistoryItem {
  id: string;
  input: string;
  symbol: string;
  nameVi: string;
  z: number;
  charge: number;
  ionFormula: string;
  timestamp: number;
}
