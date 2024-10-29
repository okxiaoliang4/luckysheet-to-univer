import type { BooleanNumber } from '@univerjs/core'

export namespace LuckySheet {
  type IObject = Record<string, unknown>
  type IFunc = (...args: unknown[]) => unknown

  export type Workbook = Partial<{
    /**
     * @default "luckysheet"
     * @description 容器的ID
     */
    container: string
    /**
     * @default "Luckysheet Demo"
     * @description 工作簿名称
     */
    title: string
    /**
     * @default "en"
     * @description 国际化设置，允许设置表格的语言，支持简体中文(\"zh\")、英文(\"en\")、繁体中文(\"zh_tw\")和西班牙文(\"es\")
     */
    lang: 'zh' | 'zh_tw' | 'en' | 'es'
    /**
     * @default ""
     * @description 表格唯一标识符
     */
    gridkey: string
    /**
     * @default ""
     * @description 配置loadUrl接口地址，加载所有工作表的配置，并包含当前页单元格数据，与loadSheetUrl配合使用。参数为gridKey（表格主键）。\n\n源码的请求写法是：\n\n$.post(loadurl, {\"gridKey\" : server.gridKey}, function (d) {})\n\n \n\n        Copied!\n    \n\n参见源码 src/core.js\n(opens new window)\n\nLuckysheet会通过ajax请求（POST）整个表格的数据，默认载入status为1的sheet数据中的celldata，其余的sheet载入除celldata字段外的所有配置字段。特别是在数据量大的时候，loadUrl只负责当前页单元格数据，配置loadSheetUrl作为其它工作表异步加载单元格数据的接口，可以提高性能。\n\n一个合格的接口返回的json字符串数据为：\n\n\"[\t\n\t//status为1的sheet页，重点是需要提供初始化的数据celldata\n\t{\n\t\t\"name\": \"Cell\",\n\t\t\"index\": \"sheet_01\",\n\t\t\"order\":  0,\n\t\t\"status\": 1,\n\t\t\"celldata\": [{\"r\":0,\"c\":0,\"v\":{\"v\":1,\"m\":\"1\",\"ct\":{\"fa\":\"General\",\"t\":\"n\"}}}]\n\t},\n\t//其他status为0的sheet页，无需提供celldata，只需要配置项即可\n\t{\n\t\t\"name\": \"Data\",\n\t\t\"index\": \"sheet_02\",\n\t\t\"order\":  1,\n\t\t\"status\": 0\n\t},\n\t{\n\t\t\"name\": \"Picture\",\n\t\t\"index\": \"sheet_03\",\n\t\t\"order\":  2,\n\t\t\"status\": 0\n\t}\n]\"\n\n \n\n        Copied!\n    \n\n有几个注意点\n\n这是一个字符串，类似于JSON.stringify()处理后的json数据，压缩后的数据便于传输\nloadUrl是一个post请求，也是为了支持大数据量\n考虑到一些公式、图表及数据透视表会引用其他sheet的数据，所以前台会加一个判断，如果该当前sheet引用了其他sheet的数据则会通过loadSheetUrl配置的接口地址请求数据，把引用到的sheet的数据一并补全，而不用等切换到其它页的时候再请求\n当数据量小的时候，也可以不用Luckysheet提供的此接口，直接使用data参数可以提前准备好所有表格数据用于初始化
     */
    loadurl: string
    /**
     * @default ""
     * @description 配置loadSheetUrl接口地址，用于异步加载其它单元格数据。参数为gridKey（表格主键） 和 index（sheet主键合集，格式为[\"sheet_01\",\"sheet_02\",\"sheet_03\"]）。\n\n源码的请求写法是：\n\n$.post(loadSheetUrl, {\"gridKey\" : server.gridKey, \"index\": sheetindex.join(\",\")}, function (d) {})\n\n \n\n        Copied!\n    \n\n参见源码 src/controllers/sheetmanage.js\n(opens new window)\n\n返回的数据为sheet的celldata字段数据集合。\n\n一个合格的接口返回的json字符串数据为：\n\n\"{\n\t\"sheet_01\": [\n\t\t{\n\t\t\t\"r\": 0,\n\t\t\t\"c\": 0,\n\t\t\t\"v\": { \"v\": 1, \"m\": \"1\", \"ct\": { \"fa\": \"General\", \"t\": \"n\" } }\n\t\t}\n\t],\n\t\"sheet_02\": [\n\t\t{\n\t\t\t\"r\": 0,\n\t\t\t\"c\": 0,\n\t\t\t\"v\": { \"v\": 1, \"m\": \"1\", \"ct\": { \"fa\": \"General\", \"t\": \"n\" } }\n\t\t}\n\t],\n\t\"sheet_03\": [\n\t\t{\n\t\t\t\"r\": 0,\n\t\t\t\"c\": 0,\n\t\t\t\"v\": { \"v\": 1, \"m\": \"1\", \"ct\": { \"fa\": \"General\", \"t\": \"n\" } }\n\t\t}\n\t]\n}\"\n\n \n\n        Copied!\n    \n\n同loadUrl类似，loadSheetUrl也要注意这几点：\n\n这是一个字符串格式数据\n这是一个post请求\n这个接口会在两种情况下自动调用，一是在loadUrl加载的当前页数据时发现当前工作表引用了其他工作表，二是切换到一个未曾加载过数据的工作表时
     */
    loadsheeturl: string
    /**
     * @default false
     * @description 是否允许操作表格后的后台更新，与updateUrl配合使用。如果要开启共享编辑，此参数必须设置为true。
     */
    allowupdate: boolean
    /**
     * @default ""
     * @description 操作表格后，实时保存数据的websocket地址，此接口也是共享编辑的接口地址。\n\n有个注意点，要想开启共享编辑，必须满足以下3个条件：\n\nallowUpdate为true\n配置了loadUrl\n配置了updateUrl\n\n注意，发送给后端的数据默认是经过pako压缩过后的。后台拿到数据需要先解压。\n\n通过共享编辑功能，可以实现Luckysheet实时保存数据和多人同步数据，每一次操作都会发送不同的参数到后台，具体的操作类型和参数参见表格操作
     */
    updateurl: string
    /**
     * @default ""
     * @description 缩略图的更新地址
     */
    updateimageurl: string
    /**
     * @default [{ "name": "Sheet1", color: "", "status": "1", "order": "0", "data": [], "config": {}, "index":0 }, { "name": "Sheet2", color: "", "status": "0", "order": "1", "data": [], "config": {}, "index":1 }, { "name": "Sheet3", color: "", "status": "0", "order": "2", "data": [], "config": {}, "index":2 }]
     * @description 当未配置loadUrl和loadSheetUrl的时候，需要手动配置传入整个客户端所有sheet数据[shee1, sheet2, sheet3]，详细参数设置参见工作表配置
     */
    data: WorkSheet[]
    /**
     * @default []
     * @description 配置插件，支持图表：\"chart\"
     */
    plugins: unknown[]
    /**
     * @default 60
     * @description 空表格默认的列数量
     */
    column: number
    /**
     * @default 84
     * @description 空表格默认的行数据量
     */
    row: number
    /**
     * @default false
     * @description 自动格式化超过4位数的数字为‘亿万格式’，例：true or \"true\" or \"TRUE\"
     */
    autoformatw: boolean
    /**
     * @default undefined
     * @description 设置精度，小数点后的位数。传参数为数字或数字字符串，例： \"0\" 或 0
     */
    accuracy: number
    /**
     * @default true
     * @description 是否允许拷贝
     */
    allowcopy: boolean
    /**
     * @default true
     * @description 是否显示工具栏
     */
    showtoolbar: boolean
    /**
     * @default {}
     * @description 自定义配置工具栏，可以与showtoolbar配合使用，showtoolbarConfig拥有更高的优先级。
     */
    showtoolbarconfig: IObject
    /**
     * @default true
     * @description 是否显示顶部信息栏
     */
    showinfobar: boolean
    /**
     * @default true
     * @description 是否显示底部sheet页按钮
     */
    showsheetbar: boolean
    /**
     * @default {}
     * @description 自定义配置底部sheet页按钮，可以与showsheetbar配合使用，showsheetbarConfig拥有更高的优先级。
     */
    showsheetbarconfig: IObject
    /**
     * @default true
     * @description 是否显示底部计数栏
     */
    showstatisticbar: boolean
    /**
     * @default {}
     * @description 自定义配置底部计数栏，可以与showstatisticBar配合使用，showstatisticBarConfig拥有更高的优先级。
     */
    showstatisticbarconfig: IObject
    /**
     * @default true
     * @description 允许添加行
     */
    enableaddrow: boolean
    /**
     * @default 100
     * @description 配置新增行处默认新增的行数目
     */
    addrowcount: number
    /**
     * @default true
     * @description 允许回到顶部
     */
    enableaddbacktop: boolean
    /**
     * @default false
     * @description 右上角的用户信息展示样式，支持以下三种形式\n\nHTML模板字符串，如：\noptions:{\n\t// 其他配置\n\tuserInfo:'<i style=\"font-size:16px;color:#ff6a00;\" class=\"fa fa-taxi\" aria-hidden=\"true\"></i> Lucky',\n}\n\n \n\n        Copied!\n    \n\n或者一个普通字符串，如：\n\noptions:{\n\t// 其他配置\n\tuserInfo:'Lucky',\n}\n\n \n\n        Copied!\n    \nBoolean类型，如：\n\nfalse:不展示\n\noptions:{\n\t// 其他配置\n\tuserInfo:false, // 不展示用户信息\n}\n\n\n \n\n        Copied!\n    \n\ntrue:展示默认的字符串\n\noptions:{\n\t// 其他配置\n\tuserInfo:true, // 展示HTML:'<i style=\"font-size:16px;color:#ff6a00;\" class=\"fa fa-taxi\" aria-hidden=\"true\"></i> Lucky'\n}\n\n\n \n\n        Copied!\n    \n对象格式，设置 userImage：用户头像地址 和 userName：用户名，如：\noptions:{\n\t// 其他配置\n\tuserInfo: {\n\t\tuserImage:'https://cdn.jsdelivr.net/npm/luckyresources@1.0.3/assets/img/logo/logo.png', // 头像url\n\t\tuserName:'Lucky' // 用户名\n\t}\n}\n\n \n\n        Copied!\n    \n注意，设置为undefined或者不设置，同设置false
     */
    userinfo: string | boolean | object
    /**
     * @default [{url:"www.baidu.com", "icon":'<i class="fa fa-folder" aria-hidden="true"></i>', "name":"我的表格"}, {url:"www.baidu.com", "icon":'<i class="fa fa-sign-out" aria-hidden="true"></i>', "name":"退出登陆"}]
     * @description 点击右上角的用户信息弹出的菜单
     */
    usermenuitem: unknown[]
    /**
     * @default www.baidu.co
     * @description 左上角<返回按钮的链接
     */
    myfolderurl: string
    /**
     * @default window.devicePixelRatio
     * @description 设备比例，比例越大表格分辨率越高
     */
    devicepixelratio: number
    /**
     * @default ""
     * @description 右上角功能按钮，例如'<button id=\"\" class=\"btn btn-primary\" style=\"padding:3px 6px;font-size: 12px;margin-right: 10px;\">下载</button> <button id=\"\" class=\"btn btn-primary btn-danger\" style=\" padding:3px 6px; font-size: 12px; margin-right: 10px;\">分享</button> <button id=\"luckysheet-share-btn-title\" class=\"btn btn-primary btn-danger\" style=\" padding:3px 6px; font-size: 12px; margin-right: 10px;\">秀数据</button>'
     */
    functionbutton: string
    /**
     * @default true
     * @description 图表或数据透视表的配置会在右侧弹出，设置弹出后表格是否会自动缩进
     */
    showconfigwindowresize: boolean
    /**
     * @default false
     * @description 强制刷新公式。\n\n默认情况下，为提高加载性能，表格初始化的时候，含有公式的单元格会默认直接取得v和m作为数据结果，而不做实时计算。\n\n如果公式关联到的单元格数据已经变化，或者公式所在的单元格数据结果改变了，则会导致关联单元格应该计算得出的结果和实际显示结果不一致，这是就需要开启公式刷新，保证数据实时计算的准确性。\n\n⚠️提醒，公式较多时会有性能问题，慎用！
     */
    forcecalculation: boolean
    /**
     * @default {}
     * @description 自定义配置单元格右击菜单
     */
    cellrightclickconfig: IObject
    /**
     * @default {}
     * @description 自定义配置sheet页右击菜单
     */
    sheetrightclickconfig: IObject
    /**
     * @default 46
     * @description 行标题区域的宽度，如果设置为0，则表示隐藏行标题
     */
    rowheaderwidth: number
    /**
     * @default 20
     * @description 列标题区域的高度，如果设置为0，则表示隐藏列标题
     */
    columnheaderheight: number
    /**
     * @default true
     * @description 是否显示公式栏
     */
    sheetformulabar: boolean
    /**
     * @default 11
     * @description 初始化默认字体大小
     */
    defaultfontsize: number
    /**
     * @default true
     * @description 工作表重命名等场景下是否限制工作表名称的长度
     */
    limitsheetnamelength: boolean
    /**
     * @default 31
     * @description 默认允许的工作表名最大长度
     */
    defaultsheetnamemaxlength: number
    /**
     * @default null
     * @description 分页器按钮设置，初版方案是直接使用的jquery插件 sPage \n(opens new window)\n点击分页按钮会触发钩子函数 onTogglePager，返回当前页码，同sPage的backFun方法，此分页器设置只负责UI部分，具体切换分页后的数据请求和数据渲染，请在onTogglePager钩子行数里自定义处理。\npager: {\n\tpageIndex: 1, //当前页码，必填\n\ttotal: 100, //数据总条数，必填\n\tselectOption: [10, 20, 30], // 选择每页的行数，\n\tpageSize: 10, //每页显示多少条数据，默认10条\n\tshowTotal: false, // 是否显示总数，默认关闭：false\n\tshowSkip: false, //是否显示跳页，默认关闭：false\n\tshowPN: false, //是否显示上下翻页，默认开启：true\n\tprevPage: '', //上翻页文字描述，默认\"上一页\"\n\tnextPage: '', //下翻页文字描述，默认\"下一页\"\n\ttotalTxt: '', // 数据总条数文字描述，默认\"总共：{total}\"\n}\n\n \n\n        Copied!\n
     */
    pager: IObject
    /**
     * @default undefined
     * @description 类型： function (string) => string，接受原始路径，返回新路径"
     */
    uploadimage: IFunc
    /**
     * @default undefined
     * @description 作用，处理图片显示时的路径。\n如上传返回地址为接口地址，如： rest/attach/[fileguid]， 则需要处理为 http://localhost:8080/xxx/rest/attach/[fileguid] 才能显示，但将前面域名信息写入数据，后续使用可能会有问题，因此可使用此方法处理路径，全路径仅在展示使用，数据内仅存储 rest/attach/[fileguid]
     */
    imageurlhandle: IFunc
    /**
     * @default null
     * @description 进入单元格编辑模式之前触发。在选中了某个单元格且在非编辑状态下，通常有以下三种常规方法触发进入编辑模式\n\n双击单元格\n敲Enter键\n使用API：enterEditMode
     */
    celleditbefore: IFunc
    /**
     * @default null
     * @description 更新这个单元格值之前触发，return false 则不执行后续的更新。在编辑状态下修改了单元格之后，退出编辑模式并进行数据更新之前触发这个钩子。
     */
    cellupdatebefore: IFunc
    /**
     * @default null
     * @description 更新这个单元格后触发
     */
    cellupdated: IFunc
    /**
     * @default null
     * @description 单元格渲染前触发，return false 则不渲染该单元格
     */
    cellrenderbefore: IFunc
    /**
     * @default null
     * @description 单元格渲染结束后触发，return false 则不渲染该单元格
     */
    cellrenderafter: IFunc
    /**
     * @default null
     * @description 所有单元格渲染之前执行的方法。在内部，这个方法加在了luckysheetDrawMain渲染表格之前。
     */
    cellallrenderbefore: IFunc
    /**
     * @default null
     * @description 行标题单元格渲染前触发，return false 则不渲染行标题
     */
    rowtitlecellrenderbefore: IFunc
    /**
     * @default null
     * @description 行标题单元格渲染后触发，return false 则不渲染行标题
     */
    rowtitlecellrenderafter: IFunc
    /**
     * @default null
     * @description 列标题单元格渲染前触发，return false 则不渲染列标题
     */
    columntitlecellrenderbefore: IFunc
    /**
     * @default null
     * @description 列标题单元格渲染后触发，return false 则不渲染列标题
     */
    columntitlecellrenderafter: IFunc
    /**
     * @default null
     * @description 单元格点击前的事件，return false则终止之后的点击操作
     */
    cellmousedownbefore: IFunc
    /**
     * @default null
     * @description 单元格点击后的事件，return false则终止之后的点击操作
     */
    cellmousedown: IFunc
    /**
     * @default null
     * @description 鼠标移动事件，可通过cell判断鼠标停留在哪个单元格
     */
    sheetmousemove: IFunc
    /**
     * @default null
     * @description 鼠标按钮释放事件，可通过cell判断鼠标停留在哪个单元格
     */
    sheetmouseup: IFunc
    /**
     * @default null
     * @description 鼠标滚动事件
     */
    scroll: IFunc
    /**
     * @default null
     * @description 鼠标拖拽文件到Luckysheet内部的结束事件
     */
    celldragstop: IFunc
    /**
     * @default null
     * @description 框选或者设置选区后触发
     */
    rangeselect: IFunc
    /**
     * @default null
     * @description 移动选区前，包括单个单元格
     */
    rangemovebefore: IFunc
    /**
     * @default null
     * @description 移动选区后，包括单个单元格
     */
    rangemoveafter: IFunc
    /**
     * @default null
     * @description 选区修改前
     */
    rangeeditbefore: IFunc
    /**
     * @default null
     * @description 选区修改后
     */
    rangeeditafter: IFunc
    /**
     * @default null
     * @description 选区复制前
     */
    rangecopybefore: IFunc
    /**
     * @default null
     * @description 选区复制后
     */
    rangecopyafter: IFunc
    /**
     * @default null
     * @description 选区粘贴前
     */
    rangepastebefore: IFunc
    /**
     * @default null
     * @description 选区粘贴后
     */
    rangepasteafter: IFunc
    /**
     * @default null
     * @description 选区剪切前
     */
    rangecutbefore: IFunc
    /**
     * @default null
     * @description 选区剪切后
     */
    rangecutafter: IFunc
    /**
     * @default null
     * @description 选区删除前
     */
    rangedeletebefore: IFunc
    /**
     * @default null
     * @description 选区删除后
     */
    rangedeleteafter: IFunc
    /**
     * @default null
     * @description 选区清除前
     */
    rangeclearbefore: IFunc
    /**
     * @default null
     * @description 选区清除后
     */
    rangeclearafter: IFunc
    /**
     * @default null
     * @description 选区下拉前
     */
    rangepullbefore: IFunc
    /**
     * @default null
     * @description 选区下拉后
     */
    rangepullafter: IFunc
    /**
     * @default null
     * @description 创建sheet页前触发，sheet页新建也包含数据透视表新建
     */
    sheetcreatebefore: IFunc
    /**
     * @default null
     * @description 创建sheet页后触发，sheet页新建也包含数据透视表新建
     */
    sheetcreateafter: IFunc
    /**
     * @default null
     * @description 拷贝创建sheet页前触发，sheet页新建也包含数据透视表新建
     */
    sheetcopybefore: IFunc
    /**
     * @default null
     * @description 拷贝创建sheet页后触发，sheet页新建也包含数据透视表新建
     */
    sheetcopyafter: IFunc
    /**
     * @default null
     * @description 隐藏sheet页前触发
     */
    sheethidebefore: IFunc
    /**
     * @default null
     * @description 隐藏sheet页后触发
     */
    sheethideafter: IFunc
    /**
     * @default null
     * @description 显示sheet页前触发
     */
    sheetshowbefore: IFunc
    /**
     * @default null
     * @description 显示sheet页后触发
     */
    sheetshowafter: IFunc
    /**
     * @default null
     * @description sheet移动前
     */
    sheetmovebefore: IFunc
    /**
     * @default null
     * @description sheet移动后
     */
    sheetmoveafter: IFunc
    /**
     * @default null
     * @description sheet删除前
     */
    sheetdeletebefore: IFunc
    /**
     * @default null
     * @description sheet删除后
     */
    sheetdeleteafter: IFunc
    /**
     * @default null
     * @description sheet修改名称前
     */
    sheeteditnamebefore: IFunc
    /**
     * @default null
     * @description sheet修改名称后
     */
    sheeteditnameafter: IFunc
    /**
     * @default null
     * @description sheet修改颜色前
     */
    sheeteditcolorbefore: IFunc
    /**
     * @default null
     * @description sheet修改颜色后
     */
    sheeteditcolorafter: IFunc
    /**
     * @default null
     * @description sheet缩放前
     */
    sheetzoombefore: IFunc
    /**
     * @default null
     * @description sheet缩放后
     */
    sheetzoomafter: IFunc
    /**
     * @default null
     * @description 激活工作表前
     */
    sheetactivate: IFunc
    /**
     * @default null
     * @description 工作表从活动状态转为非活动状态前
     */
    sheetdeactivatebefore: IFunc
    /**
     * @default null
     * @description 工作表从活动状态转为非活动状态后
     */
    sheetdeactivateafter: IFunc
    /**
     * @default null
     * @description 图片删除前触发
     */
    imagedeletebefore: IFunc
    /**
     * @default null
     * @description 图片删除后触发，如果自定义了图片上传，可在此处发请求删除图片
     */
    imagedeleteafter: IFunc
    /**
     * @default null
     * @description 表格创建之前触发。旧的钩子函数叫做beforeCreateDom
     */
    workbookcreatebefore: IFunc
    /**
     * @default null
     * @description 表格创建之后触发
     */
    workbookcreateafter: IFunc
    /**
     * @default null
     * @description 表格销毁之前触发
     */
    workbookdestroybefore: IFunc
    /**
     * @default null
     * @description 表格销毁之后触发
     */
    workbookdestroyafter: IFunc
    /**
     * @default null
     * @description 协同编辑中的每次操作后执行的方法，监听表格内容变化，即客户端每执行一次表格操作，Luckysheet将这次操作存到历史记录中后触发，撤销重做时因为也算一次操作，也会触发此钩子函数。
     */
    updated: IFunc
    /**
     * @default null
     * @description resize执行之后
     */
    resized: IFunc
    /**
     * @default null
     * @description 监听表格滚动值
     */
    'scroll-2': IFunc
    /**
     * @default null
     * @description 接受协作消息，二次开发。拓展协作消息指令集
     */
    cooperativemessage: IFunc
    /**
     * @default null
     * @description 图片插入之前
     */
    imageinsertbefore: IFunc
    /**
     * @default null
     * @description 图片插入之后
     */
    imageinsertafter: IFunc
    /**
     * @default null
     * @description 图片修改之前，修改的内容包括宽高、位置、裁剪等操作
     */
    imageupdatebefore: IFunc
    /**
     * @default null
     * @description 图片修改之后，修改的内容包括宽高、位置、裁剪等操作
     */
    imageupdateafter: IFunc
    /**
     * @default null
     * @description 图片删除之前
     */
    'imagedeletebefore-2': IFunc
    /**
     * @default null
     * @description 图片删除之后
     */
    'imagedeleteafter-2': IFunc
    /**
     * @default null
     * @description 插入批注之前，return false 则不插入批注
     */
    commentinsertbefore: IFunc
    /**
     * @default null
     * @description 插入批注之后
     */
    commentinsertafter: IFunc
    /**
     * @default null
     * @description 删除批注之前，return false 则不删除批注
     */
    commentdeletebefore: IFunc
    /**
     * @default null
     * @description 删除批注之后
     */
    commentdeleteafter: IFunc
    /**
     * @default null
     * @description 修改批注之前，return false 则不修改批注
     */
    commentupdatebefore: IFunc
    /**
     * @default null
     * @description 修改批注之后
     */
    commentupdateafter: IFunc
    /**
     * @default null
     * @description 修改数据透视表之前，操作如：拖动字段等
     */
    pivottableeditbefore: IFunc
    /**
     * @default null
     * @description 修改数据透视表之后，操作如：拖动字段等
     */
    pivottableeditafter: IFunc
    /**
     * @default null
     * @description 设置冻结前
     */
    frozencreatebefore: IFunc
    /**
     * @default null
     * @description 设置冻结后
     */
    frozencreateafter: IFunc
    /**
     * @default null
     * @description 取消冻结前
     */
    frozencancelbefore: IFunc
    /**
     * @default null
     * @description 取消冻结后
     */
    frozencancelafter: IFunc
    /**
     * @default null
     * @description 打印前
     */
    printbefore: IFunc
    /**
     * @default null
     * @description 单元格数据下钻自定义方法，注意此钩子函数是挂载在options下：options.fireMousedown
     */
    firemousedown: IFunc
    /**
     * @default null
     * @description 点击分页按钮回调函数，返回当前页码，具体参数参照sPage backFun\n(opens new window)
     */
    ontogglepager: IFunc
  }>

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
