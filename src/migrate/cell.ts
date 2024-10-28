import { CellValueType } from '@univerjs/core'
import type { ICellData, IObjectMatrixPrimitiveType } from '@univerjs/core'
import { isVaildVal } from '../utils/is'
import type { LuckySheet } from './types'

export function migrateCellData(
  cellData: LuckySheet.Cell[][],
): IObjectMatrixPrimitiveType<ICellData> {
  const result: IObjectMatrixPrimitiveType<ICellData> = {}
  // 二维数组索引
  for (let rowIndex = 0; rowIndex < cellData.length; rowIndex++) {
    result[rowIndex] = []
    for (let colIndex = 0; colIndex < cellData.length; colIndex++) {
      const cell = cellData[rowIndex][colIndex]
      result[rowIndex][colIndex] = cell
    }
  }
  return result
}

export function migrateCell(cell: LuckySheet.Cell): ICellData {
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
      // mc: cell.mc, //   TODO: 确认合并属性迁移
      // tr: cell.tr, // TODO: 确认竖排文字迁移属性
      tr: isVaildVal(cell.rt) ? { a: cell.rt } : undefined,
      tb: isVaildVal(cell.tb) ? tbMap[cell.tb] : undefined,
      // ps: cell.ps, // TODO: 确认批注属性迁移
    },
    v: cell.v,
    t: isVaildVal(cell.ct?.t)
      ? cellTypeMap[cell.ct.t as keyof typeof cellTypeMap]
      : undefined,
    f: cell.f,
    custom: {
      mc: cell.mc,
      tr: cell.tr,
      ps: cell.ps,
    },
  }
}
