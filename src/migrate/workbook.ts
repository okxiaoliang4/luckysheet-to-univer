import { LocaleType } from '@univerjs/core'
import type { IWorkbookData } from '@univerjs/core'
import { removeNil } from '../utils'
import { getSheetInfo } from './sheet'
import type { LuckySheet } from './types'

export function migrateWorkbook(
  workbook: LuckySheet.Workbook,
): Partial<IWorkbookData> {
  const { sheetOrder, sheets } = getSheetInfo(workbook.data ?? [])
  const result = {
    id: workbook.gridkey,
    name: workbook.title,
    appVersion: '1.0.0',
    locale: workbook.lang === 'zh' ? LocaleType.ZH_CN : LocaleType.EN_US,
    styles: {},
    sheetOrder,
    sheets,
    resources: [],
  } satisfies Partial<IWorkbookData>
  return removeNil(result)
}
