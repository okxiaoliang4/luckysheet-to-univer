import { expect, test } from 'bun:test'
import { migrateCell } from './cell'
import type { LuckySheet } from './types'

test('migrate cell', () => {
  const cell = {
    ct: {
      fa: 'General',
      t: 'n',
    },
    v: 233,
    m: 233,
    bg: '#f6b26b',
    ff: 'Arial',
    fc: '#990000',
    bl: 1,
    it: 1,
    fs: 9,
    cl: 1,
    ht: 0,
    vt: 0,
    tr: 2,
    rt: 2,
    un: 1,
    tb: 2,
    ps: {
      left: 92,
      top: 10,
      width: 91,
      height: 48,
      value: 'I am a comment',
      isshow: true,
    },
    mc: { r: 1, c: 1, rs: 1, cs: 1 },
    f: '=SUM(233)',
  } satisfies LuckySheet.Cell

  expect(migrateCell(cell)).toMatchSnapshot()
})
