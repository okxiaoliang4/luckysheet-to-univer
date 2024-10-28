import { LocaleType } from '@univerjs/core'
import type { IWorkbookData } from '@univerjs/core'
import type { PartialDeep } from 'type-fest'

export type LuckySheetWorkbook = PartialDeep<{
  name: string
  color: string
  index: number
  status: number
  order: number
  hide: number
  row: number
  column: number
  defaultRowHeight: number
  defaultColWidth: number
  celldata: Array<unknown>
  config: {
    merge: Record<string, unknown>
    rowlen: Record<string, unknown>
    columnlen: Record<string, unknown>
    rowhidden: Record<string, unknown>
    colhidden: Record<string, unknown>
    borderInfo: Record<string, unknown>
    authority: Record<string, unknown>
  }
  scrollLeft: number
  scrollTop: number
  luckysheet_select_save: Array<unknown>
  calcChain: Array<unknown>
  isPivotTable: boolean
  pivotTable: Record<string, unknown>
  filter_select: Record<string, unknown>
  filter: unknown
  luckysheet_alternateformat_save: Array<unknown>
  luckysheet_alternateformat_save_modelCustom: Array<unknown>
  luckysheet_conditionformat_save: Record<string, unknown>
  frozen: Record<string, unknown>
  chart: Array<unknown>
  zoomRatio: number
  image: Array<unknown>
  showGridLines: number
  dataVerification: Record<string, unknown>
}>

export function migrateWorkbook(workbook: LuckySheetWorkbook): IWorkbookData {
  return {
    id: '',
    name: '',
    appVersion: '',
    locale: LocaleType.EN_US,
    styles: {},
    sheetOrder: [],
    sheets: {},
    resources: [],
  }
}
