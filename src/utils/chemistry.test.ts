import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateElectronConfig, findElement, parseInput } from './chemistry';

test('Verification Case 1: Fe (Sắt, Z=26)', () => {
  const fe = findElement('Fe')!;
  assert.ok(fe, 'Found Fe');
  
  // By shell (default THPT)
  const resShell = calculateElectronConfig(fe, 0, 'shell', 'thpt');
  assert.equal(resShell.fullConfigText, '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²');
  assert.equal(resShell.condensedConfigText, '[Ar] 3d⁶ 4s²');
  assert.equal(resShell.unpairedElectrons, 4);
  assert.equal(resShell.valenceElectrons, 8);
  assert.equal(resShell.magneticProperty, 'paramagnetic');

  // By energy order
  const resEnergy = calculateElectronConfig(fe, 0, 'energy', 'thpt');
  assert.equal(resEnergy.fullConfigText, '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶');
  assert.equal(resEnergy.condensedConfigText, '[Ar] 4s² 3d⁶');
});

test('Verification Case 2: Cr (Crom, Z=24)', () => {
  const cr = findElement('Cr')!;
  assert.ok(cr, 'Found Cr');
  const res = calculateElectronConfig(cr, 0, 'shell', 'thpt');
  assert.equal(res.condensedConfigText, '[Ar] 3d⁵ 4s¹');
  assert.equal(res.unpairedElectrons, 6);
  assert.equal(res.isException, true);
});

test('Verification Case 3: Cu (Đồng, Z=29)', () => {
  const cu = findElement('Cu')!;
  assert.ok(cu, 'Found Cu');
  const res = calculateElectronConfig(cu, 0, 'shell', 'thpt');
  assert.equal(res.condensedConfigText, '[Ar] 3d¹⁰ 4s¹');
  assert.equal(res.unpairedElectrons, 1);
  assert.equal(res.isException, true);
});

test('Verification Case 4: Fe²⁺ (Z=26, charge=+2)', () => {
  const fe = findElement('Fe')!;
  const res = calculateElectronConfig(fe, 2, 'shell', 'thpt');
  assert.equal(res.condensedConfigText, '[Ar] 3d⁶');
  assert.equal(res.unpairedElectrons, 4);
  assert.equal(res.valenceElectrons, 6);
  assert.equal(res.ionFormula, 'Fe²⁺');
});

test('Verification Case 5: Fe³⁺ (Z=26, charge=+3)', () => {
  const fe = findElement('Fe')!;
  const res = calculateElectronConfig(fe, 3, 'shell', 'thpt');
  assert.equal(res.condensedConfigText, '[Ar] 3d⁵');
  assert.equal(res.unpairedElectrons, 5);
  assert.equal(res.valenceElectrons, 5);
  assert.equal(res.ionFormula, 'Fe³⁺');
});

test('Verification Case 6: Cl⁻ (Z=17, charge=-1)', () => {
  const cl = findElement('Cl')!;
  const res = calculateElectronConfig(cl, -1, 'shell', 'thpt');
  assert.equal(res.condensedConfigText, '[Ne] 3s² 3p⁶');
  assert.equal(res.unpairedElectrons, 0);
  assert.equal(res.magneticProperty, 'diamagnetic');
  assert.equal(res.ionFormula, 'Cl⁻');
});

test('Verification Case 7: Na⁺ (Z=11, charge=+1)', () => {
  const na = findElement('Na')!;
  const res = calculateElectronConfig(na, 1, 'shell', 'thpt');
  assert.equal(res.fullConfigText, '1s² 2s² 2p⁶');
  assert.equal(res.condensedConfigText, '[He] 2s² 2p⁶');
  assert.equal(res.unpairedElectrons, 0);
});

test('Verification Case 8: O (Oxi, Z=8)', () => {
  const o = findElement('O')!;
  const res = calculateElectronConfig(o, 0, 'shell', 'thpt');
  assert.equal(res.unpairedElectrons, 2);
  assert.equal(res.valenceElectrons, 6);
});

test('Verification Case 9: Ne (Neon, Z=10)', () => {
  const ne = findElement('Ne')!;
  const res = calculateElectronConfig(ne, 0, 'shell', 'thpt');
  assert.equal(res.condensedConfigText, '[He] 2s² 2p⁶');
});

test('Verification Case 10: H (Hiđro, Z=1)', () => {
  const h = findElement('H')!;
  const res = calculateElectronConfig(h, 0, 'shell', 'thpt');
  assert.equal(res.fullConfigText, '1s¹');
  assert.ok(res.condensedNote?.includes('không có dạng rút gọn'));
});

test('Input parsing test cases: Fe3+, Cl-, 26, Sat, Iron', () => {
  const p1 = parseInput('Fe3+');
  assert.equal(p1.element?.symbol, 'Fe');
  assert.equal(p1.charge, 3);

  const p2 = parseInput('Cl-');
  assert.equal(p2.element?.symbol, 'Cl');
  assert.equal(p2.charge, -1);

  const p3 = parseInput('O2-');
  assert.equal(p3.element?.symbol, 'O');
  assert.equal(p3.charge, -2);

  const p4 = parseInput('26');
  assert.equal(p4.element?.symbol, 'Fe');

  const p5 = parseInput('Sat');
  assert.equal(p5.element?.symbol, 'Fe');

  const p6 = parseInput('Copper');
  assert.equal(p6.element?.symbol, 'Cu');
});
