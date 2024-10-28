import type { BooleanNumber } from '@univerjs/core'

export namespace LuckySheet {
  export enum FrozenType {
    ROW = 'row',
    COLUMN = 'column',
    BOTH = 'both',
    RANGE_ROW = 'rangeRow',
    RANGE_COLUMN = 'rangeColumn',
    RANGE_BOTH = 'rangeBoth',
    CANCEL = 'cancel',
  }

  export type Frozen = {
    type: FrozenType
    range?: { row_focus: number; column_focus: number }
  }

  export type Cell = Partial<{
    /** 单元格值格式：文本、时间等 */
    ct: {
      fa: string
      t: string
    }
    /** 原始值 */
    v: number
    /** 显示值 */
    m: number
    /** 背景色 */
    bg: string
    /** 字体 */
    ff: string
    /** 字体颜色 */
    fc: string
    /** 粗体 */
    bl: BooleanNumber
    /** 斜体 */
    it: BooleanNumber
    /** 字体大小 */
    fs: number
    /** 删除线 */
    cl: BooleanNumber
    /** 下划线 */
    un: BooleanNumber
    /** 垂直对其方式 0 中间、1 上、2下 */
    vt: 0 | 1 | 2
    /** 水平对齐方式 0 居中、1 左、2右 */
    ht: 0 | 1 | 2
    /** 合并单元格 */
    mc: LuckySheet.Merge
    /** 竖排文字 */
    tr: number
    /** 文字旋转角度 介于0~180之间的整数，包含0和180 */
    rt: number
    /** 文本换行 0 截断、1溢出、2 自动换行 */
    tb: 0 | 1 | 2
    /** 批注 */
    ps: {
      left: number
      top: number
      width: number
      height: number
      value: string
      isshow: boolean
    }
    /** 公式 */
    f: string
  }>

  export interface Merge {
    r: number
    c: number
    rs: number
    cs: number
  }
}
