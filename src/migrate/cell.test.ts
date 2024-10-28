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

  expect(migrateCell(cell)).toEqual({
    custom: {
      mc: {
        c: 1,
        cs: 1,
        r: 1,
        rs: 1,
      },
      ps: {
        height: 48,
        isshow: true,
        left: 92,
        top: 10,
        value: 'I am a comment',
        width: 91,
      },
      tr: 2,
    },
    f: '=SUM(233)',
    s: {
      bg: {
        rgb: '#f6b26b',
      },
      bl: 1,
      cl: {
        rgb: '#990000',
      },
      ff: 'Arial',
      fs: 9,
      ht: 2,
      it: 1,
      st: {
        s: 1,
      },
      tb: 3,
      tr: {
        a: 2,
      },
      ul: {
        s: 1,
      },
      vt: 2,
    },
    t: 2,
    v: 233,
  })
})
