import { describe, expect, it } from 'bun:test'
import { LocaleType } from '@univerjs/core'
import type { LuckySheet } from './types'
import { migrateWorkbook } from './workbook'

describe('migrateWorkbook', () => {
  it('should migrate workbook correctly', () => {
    const mockWorkbook: LuckySheet.Workbook = {
      gridkey: 'test-workbook-id',
      title: 'Test Workbook',
      lang: 'zh',
      data: [
        {
          name: 'Sheet1',
          index: '0',
          status: 1,
          order: 0,
          celldata: [],
        },
        {
          name: 'Sheet2',
          index: '1',
          status: 0,
          order: 1,
          celldata: [],
        },
      ],
    }

    expect(migrateWorkbook(mockWorkbook)).toEqual({
      id: 'test-workbook-id',
      name: 'Test Workbook',
      appVersion: '1.0.0',
      locale: LocaleType.ZH_CN,
      styles: {},
      sheetOrder: ['0', '1'],
      sheets: {
        '0': {
          id: '0',
          name: 'Sheet1',
          cellData: {},
        },
        '1': {
          id: '1',
          name: 'Sheet2',
          cellData: {},
        },
      },
      resources: [],
    })
  })

  it('should handle empty data array', () => {
    const mockWorkbook: LuckySheet.Workbook = {
      gridkey: 'empty-workbook',
      title: 'Empty Workbook',
      lang: 'en',
      data: [],
    }

    expect(migrateWorkbook(mockWorkbook)).toEqual({
      id: 'empty-workbook',
      name: 'Empty Workbook',
      appVersion: '1.0.0',
      locale: LocaleType.EN_US,
      styles: {},
      sheetOrder: [],
      sheets: {},
      resources: [],
    })
  })

  it('should handle undefined data', () => {
    const mockWorkbook: LuckySheet.Workbook = {
      gridkey: 'undefined-data-workbook',
      title: 'Undefined Data Workbook',
      lang: 'en',
    }

    expect(migrateWorkbook(mockWorkbook)).toEqual({
      id: 'undefined-data-workbook',
      name: 'Undefined Data Workbook',
      appVersion: '1.0.0',
      locale: LocaleType.EN_US,
      styles: {},
      sheetOrder: [],
      sheets: {},
      resources: [],
    })
  })

  it('should handle english locale', () => {
    const mockWorkbook: LuckySheet.Workbook = {
      gridkey: 'english-workbook',
      title: 'English Workbook',
      lang: 'en',
      data: [
        {
          name: 'Sheet1',
          index: '0',
          status: 1,
          order: 0,
          celldata: [],
        },
      ],
    }

    expect(migrateWorkbook(mockWorkbook)).toEqual({
      id: 'english-workbook',
      name: 'English Workbook',
      appVersion: '1.0.0',
      locale: LocaleType.EN_US,
      styles: {},
      sheetOrder: ['0'],
      sheets: {
        '0': {
          id: '0',
          name: 'Sheet1',
          cellData: {},
        },
      },
      resources: [],
    })
  })
})
