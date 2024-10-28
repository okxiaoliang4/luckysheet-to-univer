import { type BooleanNumber, CellValueType, type ICellData } from '@univerjs/core'
import type { PartialDeep } from 'type-fest'

export type LuckySheetCell = PartialDeep<{
  ct: {
    fa: string;
    t: string;
  };
  v: number;
  m: number;
  bg: string;
  ff: string;
  fc: string;
  bl: BooleanNumber;
  it: BooleanNumber;
  fs: number;
  cl: BooleanNumber;
  un: BooleanNumber;
  vt: 0 | 1 | 2;
  ht: 0 | 1 | 2;
  mc: { r: number, c: number, rs: number, cs: number };
  tr: number;
  rt: number;
  tb: 0 | 1 | 2;
  ps: {
    left: number;
    top: number;
    width: number;
    height: number;
    value: string;
    isshow: boolean;
  };
  f: string;
}>

export type UniverCell = PartialDeep<{
  custom: Record<string, unknown>
}>;

const isVaildVal = (val: unknown) => val !== null && val !== undefined

export function migrateCell(cell: LuckySheetCell): ICellData {
  const cellTypeMap = {
    s: CellValueType.STRING,
    n: CellValueType.NUMBER,
    b: CellValueType.BOOLEAN,
  }
  const vtMap = {
    0: 2,
    1: 1,
    2: 3,
  }
  const htMap = {
    0: 2,
    1: 1,
    2: 3,
  }
  const tbMap = {
    0: 2,
    1: 1,
    2: 3,
  }
  return {
    s: {
      bg: isVaildVal(cell.bg) ? { rgb: cell.bg } : undefined,
      ff: cell.ff,
      cl: isVaildVal(cell.fc) ? { rgb: cell.fc } : undefined,
      bl: cell.bl,
      it: cell.it,
      fs: cell.fs,
      st: isVaildVal(cell.cl) ? { s: cell.cl } : undefined,
      ul: isVaildVal(cell.un) ? { s: cell.un } : undefined,
      vt: isVaildVal(cell.vt) ? vtMap[cell.vt] : undefined,
      ht: isVaildVal(cell.ht) ? htMap[cell.ht] : undefined,
      // mc: cell.mc, // TODO: 确认合并属性迁移
      // tr: cell.tr, // TODO: 确认竖排文字迁移属性
      tr: isVaildVal(cell.rt) ? { a: cell.rt } : undefined,
      tb: isVaildVal(cell.tb) ? tbMap[cell.tb] : undefined,
      // ps: cell.ps, // TODO: 确认批注属性迁移
    },
    v: cell.v,
    t: isVaildVal(cell.ct?.t) ? cellTypeMap[cell.ct.t as keyof typeof cellTypeMap] : undefined,
    f: cell.f,
    custom: {
      mc: cell.mc,
      tr: cell.tr,
      ps: cell.ps
    },
  }
}
