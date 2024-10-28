import { describe, expect, it } from 'bun:test'
import {
  migrateColumnInfo,
  migrateFrozen,
  migrateMerge,
  migrateRowInfo,
  migrateSheet,
} from './sheet'
import { LuckySheet } from './types'

describe('sheet migration', () => {
  describe('migrateSheet', () => {
    it('should migrate basic sheet data correctly', () => {
      const mockSheet: LuckySheet.WorkSheet = {
        name: 'Sheet1',
        index: '0',
        row: 100,
        column: 26,
        celldata: [],
        defaultRowHeight: 25,
        defaultColWidth: 100,
        scrollLeft: 0,
        scrollTop: 0,
        zoomRatio: 1,
        showGridLines: 1,
      }

      const result = migrateSheet(mockSheet)

      expect(result).toEqual({
        cellData: {},
        columnCount: 26,
        columnData: undefined,
        defaultColumnWidth: 100,
        defaultRowHeight: 25,
        freeze: undefined,
        hidden: undefined,
        id: '0',
        mergeData: undefined,
        name: 'Sheet1',
        rowCount: 100,
        rowData: undefined,
        scrollLeft: 0,
        scrollTop: 0,
        showGridlines: 1,
        zoomRatio: 1,
      })
    })
  })

  describe('migrateRowInfo', () => {
    it('should migrate row info correctly', () => {
      const rowLen = {
        '0': 50,
        '1': 75,
      }
      const rowHidden: Record<`${number}`, 0> = {
        '1': 0,
      }

      const result = migrateRowInfo(rowLen, rowHidden)

      expect(result).toEqual({
        0: { h: 50, hd: 0 },
        1: { h: 75, hd: 1 },
      })
    })
  })

  describe('migrateColumnInfo', () => {
    it('should migrate column info correctly', () => {
      const columnLen = {
        '0': 100,
        '1': 150,
      }
      const columnHidden: Record<`${number}`, 0> = {
        '1': 0,
      }

      const result = migrateColumnInfo(columnLen, columnHidden)

      expect(result).toEqual({
        0: { w: 100, hd: 0 },
        1: { w: 150, hd: 1 },
      })
    })
  })

  describe('migrateMerge', () => {
    it('should migrate merge data correctly', () => {
      const mergeData: Record<`${number}_${number}`, LuckySheet.Merge> = {
        '0_0': { rs: 2, cs: 3, r: 0, c: 0 },
        '4_2': { rs: 1, cs: 2, r: 4, c: 2 },
      }

      const result = migrateMerge(mergeData)

      expect(result).toEqual([
        {
          startRow: 0,
          startColumn: 0,
          endRow: 2,
          endColumn: 3,
        },
        {
          startRow: 4,
          startColumn: 2,
          endRow: 5,
          endColumn: 4,
        },
      ])
    })
  })

  describe('migrateFrozen', () => {
    it('should migrate ROW frozen data correctly', () => {
      const frozen: LuckySheet.Frozen = { type: LuckySheet.FrozenType.ROW }

      const result = migrateFrozen(frozen)

      expect(result).toEqual({
        xSplit: 1,
        ySplit: 0,
        startRow: 1,
        startColumn: 0,
      })
    })

    it('should migrate COLUMN frozen data correctly', () => {
      const frozen: LuckySheet.Frozen = { type: LuckySheet.FrozenType.COLUMN }

      const result = migrateFrozen(frozen)

      expect(result).toEqual({
        xSplit: 0,
        ySplit: 1,
        startRow: 0,
        startColumn: 1,
      })
    })

    it('should migrate BOTH frozen data correctly', () => {
      const frozen: LuckySheet.Frozen = { type: LuckySheet.FrozenType.BOTH }

      const result = migrateFrozen(frozen)

      expect(result).toEqual({
        xSplit: 1,
        ySplit: 1,
        startRow: 1,
        startColumn: 1,
      })
    })

    it('should migrate RANGE_ROW frozen data correctly', () => {
      const frozen: LuckySheet.Frozen = {
        type: LuckySheet.FrozenType.RANGE_ROW,
        range: { row_focus: 3 },
      }

      const result = migrateFrozen(frozen)

      expect(result).toEqual({
        xSplit: 3,
        ySplit: 0,
        startRow: 1,
        startColumn: 0,
      })
    })

    it('should migrate RANGE_COLUMN frozen data correctly', () => {
      const frozen: LuckySheet.Frozen = {
        type: LuckySheet.FrozenType.RANGE_COLUMN,
        range: { column_focus: 3 },
      }

      const result = migrateFrozen(frozen)

      expect(result).toEqual({
        xSplit: 0,
        ySplit: 3,
        startRow: 0,
        startColumn: 1,
      })
    })

    it('should migrate RANGE_BOTH frozen data correctly', () => {
      const frozen: LuckySheet.Frozen = {
        type: LuckySheet.FrozenType.RANGE_BOTH,
        range: { row_focus: 3, column_focus: 4 },
      }

      const result = migrateFrozen(frozen)

      expect(result).toEqual({
        xSplit: 3,
        ySplit: 4,
        startRow: 1,
        startColumn: 1,
      })
    })

    it('should migrate CANCEL frozen data correctly', () => {
      const frozen: LuckySheet.Frozen = { type: LuckySheet.FrozenType.CANCEL }

      const result = migrateFrozen(frozen)

      expect(result).toEqual({
        xSplit: 0,
        ySplit: 0,
        startRow: 0,
        startColumn: 0,
      })
    })

    it('should use default values when range is not provided', () => {
      const frozen: LuckySheet.Frozen = {
        type: LuckySheet.FrozenType.RANGE_BOTH,
      }

      const result = migrateFrozen(frozen)

      expect(result).toEqual({
        xSplit: 1,
        ySplit: 1,
        startRow: 1,
        startColumn: 1,
      })
    })
  })
})
