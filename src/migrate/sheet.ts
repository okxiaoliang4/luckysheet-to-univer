import type {
  BooleanNumber,
  IColumnData,
  IFreeze,
  IObjectArrayPrimitiveType,
  IRange,
  IRowData,
  IWorksheetData,
} from '@univerjs/core'
import { isVaildVal } from '../utils/is'
import { migrateCellData } from './cell'
import { LuckySheet } from './types'

/**
 * 将LuckySheet工作表数据转换为Univer工作表数据
 * @param sheet - LuckySheet工作表数据
 * @returns Univer工作表数据
 */
export function migrateSheet(
  sheet: LuckySheet.WorkSheet,
): Partial<IWorksheetData> {
  const cellData = migrateCellData(sheet.celldata!)
  return {
    id: sheet.index!, // TODO: 使用工作表index作为id
    name: sheet.name!,
    mergeData: sheet.config?.merge
      ? migrateMerge(sheet.config.merge)
      : undefined,
    tabColor: sheet.color,
    hidden: sheet.hide,
    freeze: sheet.frozen && migrateFrozen(sheet.frozen),
    cellData: cellData,
    rowData:
      sheet.config?.rowlen &&
      migrateRowInfo(sheet.config.rowlen, sheet.config.rowhidden),
    columnData:
      sheet.config?.columnlen &&
      migrateColumnInfo(sheet.config.columnlen, sheet.config.colhidden),
    rowCount: sheet.row,
    columnCount: sheet.column,
    zoomRatio: sheet.zoomRatio,
    scrollTop: sheet.scrollTop,
    scrollLeft: sheet.scrollLeft,
    defaultColumnWidth: sheet.defaultColWidth,
    defaultRowHeight: sheet.defaultRowHeight,
    showGridlines: sheet.showGridLines,
  }
}

export function migrateRowInfo(
  rowLen: Record<`${number}`, number>,
  rowHidden?: Record<`${number}`, 0>,
): IObjectArrayPrimitiveType<Partial<IRowData>> {
  const result: IObjectArrayPrimitiveType<Partial<IRowData>> = {}
  Object.entries(rowLen).forEach(([key, value]) => {
    result[Number(key)] = {
      h: value,
      hd: isVaildVal(rowHidden?.[key as `${number}`]) ? 1 : 0,
    }
  })
  return result
}

export function migrateColumnInfo(
  columnLen: Record<`${number}`, number>,
  columnHidden?: Record<`${number}`, 0>,
): IObjectArrayPrimitiveType<Partial<IColumnData>> {
  const result: IObjectArrayPrimitiveType<Partial<IColumnData>> = {}
  Object.entries(columnLen).forEach(([key, value]) => {
    result[Number(key)] = {
      w: value,
      hd: isVaildVal(columnHidden?.[key as `${number}`]) ? 1 : 0,
    }
  })
  return result
}

export function migrateMerge(
  mergeData: Record<`${number}_${number}`, LuckySheet.Merge>,
): IRange[] {
  const result: IRange[] = []
  Object.entries(mergeData).forEach(([key, value]) => {
    const [row, column] = key.split('_').map(Number)
    result.push({
      startRow: row,
      startColumn: column,
      endRow: row + value.rs,
      endColumn: column + value.cs,
    })
  })
  return result
}

export function migrateFrozen(frozen: LuckySheet.Frozen): IFreeze {
  switch (frozen.type) {
    case LuckySheet.FrozenType.ROW:
      return {
        xSplit: 1,
        ySplit: 0,
        startRow: 1,
        startColumn: 0,
      }
    case LuckySheet.FrozenType.COLUMN:
      return {
        xSplit: 0,
        ySplit: 1,
        startRow: 0,
        startColumn: 1,
      }
    case LuckySheet.FrozenType.BOTH:
      return {
        xSplit: 1,
        ySplit: 1,
        startRow: 1,
        startColumn: 1,
      }
    case LuckySheet.FrozenType.RANGE_ROW:
      return {
        xSplit: frozen.range?.row_focus || 1,
        ySplit: 0,
        startRow: 1,
        startColumn: 0,
      }
    case LuckySheet.FrozenType.RANGE_COLUMN:
      return {
        xSplit: 0,
        ySplit: frozen.range?.column_focus || 1,
        startRow: 0,
        startColumn: 1,
      }
    case LuckySheet.FrozenType.RANGE_BOTH:
      return {
        xSplit: frozen.range?.row_focus || 1,
        ySplit: frozen.range?.column_focus || 1,
        startRow: 1,
        startColumn: 1,
      }
    case LuckySheet.FrozenType.CANCEL:
      return {
        xSplit: 0,
        ySplit: 0,
        startRow: 0,
        startColumn: 0,
      }
  }
}
