import { expect, test } from 'bun:test'
import { migrateCell } from '.'
import type { LuckySheetCell } from '.'

test('migrate cell', () => {
  const cell = {
    ct: { // 单元格值格式
      fa: 'General', // 格式名称为自动格式
      t: 'n', // 格式类型为数字类型
    },
    v: 233, // 内容的原始值为 233
    m: 233, // 内容的显示值为 233
    bg: '#f6b26b', // 背景为 "#f6b26b"
    ff: 'Arial', // 字体为 "Arial"
    fc: '#990000', // 字体颜色为 "#990000"
    bl: 1, // 字体加粗
    it: 1, // 字体斜体
    fs: 9, // 字体大小为 9px
    cl: 1, // 启用删除线
    ht: 0, // 水平居中
    vt: 0, // 垂直居中
    tr: 2, // 文字旋转 -45°
    rt: 2, // 文字旋转 -45°
    un: 1, // 文字旋转 -45°
    tb: 2, // 文本自动换行
    ps: { // 批注
      left: 92, // 批注框左边距
      top: 10, // 批注框上边距
      width: 91, // 批注框宽度
      height: 48, // 批注框高度
      value: 'I am a comment', // 批注内容
      isshow: true, // 批注框为显示状态
    },
    mc: { r: 1, c: 1, rs: 1, cs: 1 },
    f: '=SUM(233)', // 单元格是一个求和公式
  } satisfies LuckySheetCell

  expect(migrateCell(cell)).toMatchSnapshot()
})
