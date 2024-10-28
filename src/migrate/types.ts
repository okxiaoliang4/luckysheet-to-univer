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
    range?: { row_focus?: number; column_focus?: number }
  }

  /**
   * LuckySheet工作表的类型定义
   * 包含了工作表的基本属性和配置信息
   */
  export type WorkSheet = Partial<{
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
    celldata: Cell[][]
    /** 工作表配置信息 */
    config: Partial<{
      /** 合并单元格信息，key格式为"行号_列号" */
      merge: Record<`${number}_${number}`, Merge>
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
    frozen: Frozen
    // chart: Array<unknown>
    /** 缩放比例 */
    zoomRatio: number
    // image: Array<unknown>
    /** 是否显示网格线：1显示，0隐藏 */
    showGridLines: BooleanNumber
    // dataVerification: Record<string, unknown>
  }>

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
