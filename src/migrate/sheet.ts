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
import type { LuckySheet } from './types'

/**
 * LuckySheet工作表的类型定义
 * 包含了工作表的基本属性和配置信息
 */
export type LuckySheetWorkSheet = Partial<{
  /** 名称 */
  name: string
  /** 工作表颜色 */
  color: string
  /** 索引 */
  index: string
  /** 状态 */
  status: BooleanNumber
  /** 顺序 */
  order: number
  /** 隐藏 */
  hide: BooleanNumber
  /** 行数量 */
  row: number
  /** 列数量 */
  column: number
  /** 默认行高 */
  defaultRowHeight: number
  /** 默认列宽 */
  defaultColWidth: number
  /** 单元格数据 */
  celldata: LuckySheet.Cell[][]
  /** 工作表配置信息 */
  config: Partial<{
    /** 合并单元格信息，key格式为"行号_列号" */
    merge: Record<`${number}_${number}`, LuckySheet.Merge>
    /** 自定义行高，key为行号 */
    rowlen: Record<`${number}`, number>
    /** 自定义列宽，key为列号 */
    columnlen: Record<`${number}`, number>
    /** 隐藏行信息，key为行号，值永远为0 */
    rowhidden: Record<`${number}`, 0>
    /** 隐藏列信息，key为列号，值永远为0 */
    colhidden: Record<`${number}`, 0>
    // borderInfo: Record<string, unknown>
    // authority: Record<string, unknown>
  }>
  /** 水平滚动条位置 */
  scrollLeft: number
  /** 垂直滚动条位置 */
  scrollTop: number
  // luckysheet_select_save: Array<unknown>
  // calcChain: Array<unknown>
  // isPivotTable: boolean
  // pivotTable: Record<string, unknown>
  // filter_select: Record<string, unknown>
  // filter: unknown
  // luckysheet_alternateformat_save: Array<unknown>
  // luckysheet_alternateformat_save_modelCustom: Array<unknown>
  // luckysheet_conditionformat_save: Record<string, unknown>
  /** 冻结行列设置 */
  frozen: Record<string, unknown>[]
  // chart: Array<unknown>
  /** 缩放比例 */
  zoomRatio: number
  // image: Array<unknown>
  /** 是否显示网格线：1显示，0隐藏 */
  showGridLines: BooleanNumber
  // dataVerification: Record<string, unknown>
}>

/**
 * 将LuckySheet工作表数据转换为Univer工作表数据
 * @param sheet - LuckySheet工作表数据
 * @returns Univer工作表数据
 */
export function migrateSheet(
  sheet: LuckySheetWorkSheet,
): Partial<IWorksheetData> {
  const cellData = migrateCellData(sheet.celldata!)
  return {
    id: sheet.index!, // TODO: 使用工作表index作为id
    name: sheet.name!,
    mergeData: sheet.config?.merge
      ? migrateMerge(sheet.config.merge)
      : undefined,
    // tabColor: '', // NOTE: 新增属性
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

export function migrateFrozen(frozen: Record<string, unknown>[]): IFreeze {
  const result: IFreeze = {
    xSplit: 0,
    ySplit: 0,
    startRow: 0,
    startColumn: 0,
  }
  // TODO:
  return result
}
