export default {
  markdownParse
}

/**
 * markdown解析
 * @param str
 */
function markdownParse (str) {
  //  document.write("<h1>hello</h1>")
  // 以换行符作为标准方式分割每一行存到数组中
  let arry = str.split('\n')
  let html = ''
  let singleLine = ''

  /**
   * 封装代码块
   * @param currentIndex
   * @param fullArray
   * @returns {*}
   */
  function wrapMultiCode (currentIndex, fullArray) {
    // 如果判断到代码开始的标记，则传入判断结束的函数和解析所用函数给wrapMulti, wrapMulti负责收集, 第三个参数(parseFunction)用于解析
    if (/^\s*```/g.test(fullArray[currentIndex])) {
      return wrapMulti(currentIndex,
        function (currentIndex, currentLine) {
          return (currentLine.match(/^\s*```/g))
        },
        function (arr) {
          return parseMultiLineArr(arr, true)
        })
    }
    return currentIndex
  }

  /**
   * 一个解析多行代码的接口
   * @param currentIndex 当前解析到的行数
   * @param isMultiEndDetectFunction 判断结束的方法，要求外界调用者传入
   * @param parseFunction 调用哪个解析的方法
   */
  function wrapMulti (currentIndex, isMultiEndDetectFunction, parseFunction) {
    // 解析后的html
    let afterParsedIndex = currentIndex

    // 待解析的数组
    let preArr = []

    // 结尾的冗余行数量
    let emptyLineCountOfEnding = 0

    /* 把第一行存入，因为可能有一些必要的信息，比如```java中的java */
    preArr.push(arry[currentIndex])

    // 进入多行解析的表直
    for (let i = currentIndex + 1; i < arry.length; i++) {
      // 当前行
      let currentBlockLine = arry[i]

      // 调用回调函数判断是否结束行
      let isEndLine = isMultiEndDetectFunction(i, currentBlockLine, arry)

      // 判断是否为空行
      // 如果是空行，说明是冗余行, 冗余行计数器自增；如果当前行是结束行且为空行，则不需要自增
      //  if (currentBlockLine.trim().length === 0 && !isEndLine) {
      if (currentBlockLine.trim().length === 0) {
        emptyLineCountOfEnding++
      } else {
        if (!isEndLine) {
          emptyLineCountOfEnding = 0
        }
      }

      // 如果检测到结束了，就把数组送到相应的方法去解析
      if (isEndLine) {
        // 去掉冗余的行
        for (let j = 0; j < emptyLineCountOfEnding; j++) {
          preArr.pop()
        }
        preArr.push(currentBlockLine)
        html += parseFunction(preArr)
        afterParsedIndex = i + 1
        break
      }
      preArr.push(currentBlockLine)
    }
    return afterParsedIndex
  }

  /**
   * 封装多行block
   * 连续两行空白
   * @param currentIndex
   * @param fullArray
   */
  function wrapMutliBlock (currentIndex, fullArray) {
    function isStartLineOfBlock () {
      // 检测是否为空行
      let emptyLineReg = /^\s*$/g
      /**
       * 开头必须有四个空格以上，后面必须跟着一个任意字符（处理空格之外)
       * @type {RegExp}
       */
      let hasSpaceFirstWithAnyContent = /^\s{4,}.[^ ]/g
      return emptyLineReg.test(fullArray[currentIndex]) && hasSpaceFirstWithAnyContent.test(fullArray[currentIndex + 1])
    }

    if (isStartLineOfBlock()) {
      let afterIndex = wrapMulti(
        currentIndex,
        function (currentIndex, currentLine, fullArray) {
          /** 判断是否为Block的结束行
           * 判断方法：
           *  当前行首四个字符是空格以外的其它字符（也就是没有Tab缩进
           *  但是无法做到一个正则可以判断首行前面四个字符是否有空格以外的字符，因此需要转换思路
           *      1. 利用search方法搜索空格以外的字符[^ ]，搜到的任意一字符如果其位置<4,说明它是结束行
           *      2. 需要注意的是，这个方法搜索到空字符是返-1
           *
           * @param currentLine 当前遍历行
           * @param fullArray 整篇文章的数组
           * @param currentIndex 当前遍历到的下标
           */
          //  function isEndingLineOfBlock(line, fullArray, currentIndex) {
          //       function isEndingLineOfBlock(line, fullArray, currentIndex) {
          // 如果判断到当前行已经是文章的最后一行，则认为结束
          if (fullArray.length - 1 === currentIndex) {
            return true
          }

          let randomCharButNotEmptyReg = /[^ ]/g
          // 寻找整行的第一个非空白字符，如果该非空白字符位置<4, 认为不足一个Tab, 则结束之, 除非当前行为空白行
          let charIndex = currentLine.search(randomCharButNotEmptyReg)
          if (charIndex < 4 && currentLine.trim().length !== 0) {
            return true
          }
          return false
        },
        function (arr) {
          return parseBlock(arr)
        }
      )
      /*  不处理最后一行  */
      return afterIndex - 1
    }
    return currentIndex
  }

  function wrapMultiQuote (currentIndex, fullArray) {
    function isQuoteStart () {
      // 空白行退出
      return /^\s{0,}([>]{1,})(.*)/g.test(fullArray[currentIndex])
    }

    if (isQuoteStart()) {
      return wrapMulti(
        currentIndex,
        function (currentIndex, currentLine) {
          return /^\s{0,}$/g.test(currentLine)
        },
        function (arr) {
          return parseQuote(arr)
        }
      )
    }
    return currentIndex
  }

  for (let i = 0; i < arry.length; i++) {
    /**
     * 自定义解析多行类型示例
     */
    if (/^abc-/g.test(arry[i])) {
      i = wrapMulti(
        i,
        /*  传入一个判断结束的函数  */
        function (currentIndex, currentLine) {
          let startRegex = /^abc-/g
          if (startRegex.test(currentLine)) {
            return true
          }
          return false
        },
        /*  传入一个解析器  */
        function (arr) {
          //  let afterParsedHtml = "<button onclick='toggle(document.getElementById(\"custom\"))'>收缩</button>";
          let afterParsedHtml = ''
          afterParsedHtml += '<div id=\'custom\' style=\'background-color: grey\'>'
          for (let j = 0; j < arr.length; j++) {
            let currentLine = arr[j]
            currentLine = currentLine.trim().length === 0 ? '&nbsp' : currentLine
            afterParsedHtml += '<p>' + currentLine + '</p>'
          }
          afterParsedHtml += '</div>'
          return afterParsedHtml
        }
      )
    }

    // ====================处理多行==========开始
    // 代码
    i = wrapMultiCode(i, arry)

    // 跳过检测到为空行+缩进 block的文本
    i = wrapMutliBlock(i, arry)

    // 引用
    i = wrapMultiQuote(i, arry)
    // ====================处理多行==========结束

    // 处理单行
    singleLine = arry[i]
    singleLine = parseLine(singleLine)
    html += singleLine
  }

// 解析完成，返回MarkedHtml对象
// markedHtml.indicator = indicator;
  return html
}

// 检测多行空行变成一行
parseLine.emptyLineCount = 0

//  有序列表递增用
// parseLine.orderedListCount = 0;
//  有序列表递增符号
parseLine.orderedListCountByLevelMap = new Map()

// 多行解析路由============================开始
/**
 * 解析Mardown代码块
 * 注意：防止xml被解析！需要转义 > <
 */
function parseMultiLineArr (arr) {
  let codeParse = new CodeParser(arr)
  return codeParse.getCodeEle()
}

function parseBlock (arr) {
  let blockParser = new BlockParser(arr)
  return blockParser.getBlockEle()
}

function parseQuote (arr) {
  let quoteParse = new QuoteParser(arr)
  return quoteParse.getQuoteEle()
}

// 多行解析路由============================结束

// 单行解析============================开始
/**
 * 分类单行代码
 * @param singleLine
 * @returns {string|*}
 */
function parseLine (singleLine) {
  if (singleLine === undefined || singleLine === null) {
    return ''
  }

  // 标题#
  let headerReg = /^\s*#/g
  if (headerReg.test(singleLine)) {
    let sharpLen = /^\s*(#*)/g.exec(singleLine)[1].length
    if (sharpLen >= 7) {
      sharpLen = 6
    }
    //  let sstr = "<h" + sharpLen + " class='header header-" + sharpLen+ "'>" + singleLine.replace(/^\s*#*(.*)/g, "$1") + "</h" + sharpLen+ ">";
    singleLine = '<h' + sharpLen + ' class=\'header header-' + sharpLen + '\'>' + singleLine.trim().substring(sharpLen) + '</h' + sharpLen + '>'
  }
  // 转义
  singleLine = singleLine.replace(/\\#/g, '#')

  //  todo 清单
  //  - [ ]
  //  - [x]
  // 清单需要自动换行
  let todoReg = /^\s{0,3}-\s\[\s\](.*)/g
  if (todoReg.test(singleLine)) {
    singleLine = singleLine.replace(todoReg, '<input class=\'md-todo-uncheck\' type=\'checkbox\' disabled />$1<br/>')
  }

  let todoFinishedReg = /^\s{0,3}-\s\[x\](.*)/g
  if (todoFinishedReg.test(singleLine)) {
    singleLine = singleLine.replace(todoFinishedReg, '<input class=\'md-todo-checked\' type=\'checkbox\' disabled  checked/>$1<br/>')
  }

  // 无序列表
  // \s任意空格加-开头, Tab加-格式化无需列表
  //  let unOrderedListReg = /^\s*\\?-(?!-)/g;
  /**
   * 任意空白开头，前面不能有转义
   * @type {RegExp}
   */
    //  let unOrderedListReg = /^\s*([-*+])(?!\1)/g;
  let unOrderedListReg = /^\s*([-*+])\s(?!\1)/g
  if (unOrderedListReg.test(singleLine)) {
    // 判断前面是否有转义符号
    //  let styles = ["\t&#8226;",  "\t&#9830;","\t&#9674;"]
    // 字符大区
    // https://www.cnblogs.com/mengmengi/p/10137167.html
    // TODO 更换字符
    // https://www.w3school.com.cn/tiy/t.asp?f=csse_list-style

    //  • &bull;
    //  ° &deg;
    //  ♦ &diams;    不推荐, 不同浏览器显示效果不一样
    //  ◊ &loz;
    //
    let styles = ['&bull;', '&deg;']
    //  let styles = ["&bull;", "&deg;", "&diams;", "&loz;"];
    //  let spaceLen = singleLine.substring(0, singleLine.indexOf("-")).length;
    // 搜索第一个非空白字符
    let spaceLen = singleLine.search(/[^\s]/g)
    // 获取样式
    let style = styles[Math.floor(spaceLen / 4) % styles.length]
    // 填充物的宽度
    let retractEle = '<span class=\'unordered-list-indicator\' style=\'padding-left: ' + ((spaceLen / 4) * 20) + 'px;\'>' + style + '</span>'

    singleLine = '<p class=\'unordered-list\'>' + retractEle + singleLine.substring(spaceLen + 1) + '</p>'
  }
  //  singleLine = singleLine.replace(/(\\\-|\\\+|\\\*)/g, "$1");
  singleLine = singleLine.replace(/\\(\\-)/g, '$1')

  // TODO 有序列表
  //  let orderedListReg = /^\s*\?-(?!-)/g;
  let orderedListReg = /^\s*(\d+)\./g
  if (orderedListReg.test(singleLine)) {
    //  let styles = ["1", "i", "a"];
    //  let styles = ["&bull;", "&deg;", "&diams;", "&loz;"];
    // 搜索第一个 数字.
    let spaceLen = singleLine.search(/\d+\./g)

    // 当前缩进级别
    let level = Math.floor(spaceLen / 4)

    // 拿到当前缩进级别的序号
    let levelCount = parseLine.orderedListCountByLevelMap.get(level)
    // 如果发现为未定义，则需要从1开始计算
    if (levelCount === undefined) {
      levelCount = 1
      parseLine.orderedListCountByLevelMap.set(level, levelCount)
    }

    let style = getPrefix(level) + levelCount

    // 填充物的宽度
    let retractEle = '<span class=\'ordered-list-indicator\' style=\'padding-left: ' + ((spaceLen / 4) * 20) + 'px;\'>' + style + '</span>'

    //  singleLine = "<li class='ordered-list'>" + retractEle + singleLine.substring(spaceLen + 1) + "</li>";
    //  singleLine = "<span class='ordered-list'>" + retractEle + singleLine.substring(spaceLen + 1) + "</span><br/>";
    singleLine = '<p class=\'ordered-list\'>' + retractEle + singleLine.substring(spaceLen + 1) + '</p>'

    // 当前level递增
    parseLine.orderedListCountByLevelMap.set(level, levelCount + 1)
    // 将该级别以下的清空避免污染下一次同级别有序列表
    // 比如
    //  1. 一级
    //       1.1 二级
    //       1.2 二级
    //       1.3 二级
    //  2. 一级
    //       4. 二级   这里被污染
    for (let i = level + 1; i < parseLine.orderedListCountByLevelMap.size; i++) {
      parseLine.orderedListCountByLevelMap.set(i, 1)
    }
  } else {
    // 如果出现空白行，就清空
    if (singleLine.trim().length === 0) {
      parseLine.orderedListCountByLevelMap.clear()
    }
  }

  // 图像
  //  let teststr = "![abc](http://img.wszjl.com/images/background/jpg/22.jpg)";
  let reg = /!\[(.*)\]\((.*)\)/g
  let obj = reg.exec(singleLine.trim())
  if (obj != null) {
    let altText = obj[1]
    let url = obj[2]
    let imgEle = '<span>' + '<img style="width: 100%" alt="' + altText + '" src=' + url.trim() + ' />' + '</span>'

    singleLine = imgEle
  }

  //  br
  let brReg = /^\s{0,}---/g
  if (brReg.test(singleLine)) {
    singleLine = '<hr/>' + singleLine.substring(singleLine.indexOf('---') + 3)
  }

  // 链接[]()
  //  let lnReg = /(.*)\[(.*)\]\((.*)\)(.*)/g;
  let lnReg = /\[([^\]]*?)\]\((.*?)\)/g
  if (lnReg.test(singleLine)) {
    singleLine = singleLine.replace(lnReg, '<a href=\'$2\' >$1</a>')
  }

  // 高亮==
  let hlReg = /(^|[^\\])==([^=]*?)==/g
  if (hlReg.test(singleLine)) {
    singleLine = singleLine.replace(hlReg, '$1<span class="md-highlight" >$2</span>')
    //  singleLine = singleLine.replace(/\\=/g, "=");
  }
  singleLine = singleLine.replace(/\\=/g, '=')

  // 斜体*
  // 正则的断言
  // IE不支持负向先行断言
  //  try {
  //      let emReg = /(?<!\*)\*([^*]{1,})\*(?!\*)/g;
  //      singleLine = singleLine.replace(emReg, "<em>$1</em>");
  //  } catch (e) {
  //      console.error("you browser unsupport !")
  //  }

  // 兼容方法，斜体和粗体
  if (/\*([^*]{1,})\*/g.test(singleLine)) {
    // 粗体
    singleLine = singleLine.replace(/(^|[^\\])\*\*([^* ])(.*?)\*\*/g, '$1<span class=\'md-strong\'>$2$3</span>')

    // 斜体
    let emReg = /(^|[^\\])\*([^ ])([^*]*?)(\*)/g
    //  let emReg = /(^|[^\\])\*([^ ])(.*?)\*([^*]|$)/g;
    singleLine = singleLine.replace(emReg, '$1<span class=\'md-italic\'>$2$3</span>')

    // 把反义符号去掉
    //  singleLine = singleLine.replace(/(\\\*)/g, "*");
    //  singleLine = singleLine.replace(/(\\\*)/g, "*");
  }
  singleLine = singleLine.replace(/(\\\*)/g, '*')

  let delReg = /(^|[^\\])~~(.*?)~~/g
  if (delReg.test(singleLine)) {
    singleLine = singleLine.replace(delReg, '$1<span class=\'md-del\'>$2</span>')

    /*  把反义符号去掉  */
    //  singleLine = singleLine.replace(/\\~/g, "~");
  }
  singleLine = singleLine.replace(/\\~/g, '~')

  // 下划线++
  let undReg = /(^|[^\\])\+\+(.*?)\+\+/g
  if (undReg.test(singleLine)) {
    singleLine = singleLine.replace(undReg, '$1<span class=\'md-underline\'>$2</span>')

    /*  把反义符号去掉  */
    //  singleLine = singleLine.replace(/\\\+/g, "+");
  }
  singleLine = singleLine.replace(/\\\+/g, '+')

  // // 单行代码解析``
  //  let regSingleCode = /[^\\]`[^`]/g;
  //  if (singleLine.trim().match(regSingleCode) != null) {
  //      singleLine = parseMultiLineArr([singleLine], false);
  //  }
  //  let regSingleCode = /(^|[^\\])`([^ ])(.*?)([^ ])`/g;

  /**
   * 要求
   * 1. 不能以转义符号开头
   * 2. 反引号里面不能以空白开头，不能以空白结尾，中间不得出现反引号
   *
   * 写法解释
   * (^|[^\\])(`[^\s`]+`)|(`([^ ])([^`]*?)([^ ])`)
   * (^|[^\\]) : 开头可以是非反引号的任意字符
   *
   * 组合1: 解决中间出现空白的情况
   * (^|[^\\])(`[^\s`]+`) : 任意非反引号字符开始, 以`开头，中间不得出现任何空白字符或者反引号字符, 以`结束
   * 组合2: 解决两边不得出现空白的情况
   * (^|[^\\])(`([^ ])([^`]*?)([^ ])` :任意非反引号字符开始, 紧跟后面不能出现空白，占位1个，中间不能出现反引号之外的符号，后面一个反引号前面第一个字符不能是空白
   *
   * 组合1 | 组合2  = 要求
   * @type {RegExp}
   */

  let regSingleCode = /(^|[^\\])(`[^\s]`)|(^|[^\\])(`([^\s])([^`]*?)([^\s])`)/g
  if (singleLine.trim().match(regSingleCode) != null) {
    //  singleLine = parseMultiLineArr([singleLine], false);
    //  singleLine = singleLine.replace(regSingleCode, "$1<span class='code code-single-frame'>$2$3$4</span>")
    singleLine = singleLine.replace(regSingleCode, function (ch) {
      // 第一个符号被捕获了，需要切割出来, 比如 "test`echo hello`"，其中会拿到 "t`echo hello`, 前面的t就是我们需要单独提取的内容。
      let firstChar = ch.charAt(0)
      ch = ch.replace(/``?(.*)`/g, '$1')

      // 如果是`开头的，就不会获取到第一个字符
      if (firstChar !== '`') {
        ch = ch.substring(1)
      }

      ch = escapeCode(ch, false)
      ch = highlightCode(ch, 'singleline')
      //  return "<span class='code code-single-frame'>" + escapeCode(ch, false) + "</span>";
      return firstChar + '<span class=\'code code-single-frame\'>' + ch + '</span>'
    })
    //  singleLine = singleLine.replace(/\\`/g, "`");
  }

  singleLine = singleLine.replace(/\\`/g, '`')

  // 转义\\成为\
  singleLine = singleLine.replace(/\\\\/g, '\\')

  //  检测多行空行变成一行
  if (singleLine.trim().length === 0 && parseLine.emptyLineCount <= 1) {
    parseLine.emptyLineCount++
    return '<br/>'
  }

  /**
   * 没有被标签封装，说明是纯文本
   * @type {RegExp}
   */
  let plainTextReg = /^\s*</g
  let temLine = singleLine.trim()
  if (temLine.length > 0 && !plainTextReg.test(temLine)) {
    parseLine.emptyLineCount = 0
    //  singleLine = "<p class='plain-text'>" + singleLine + "</p>";
    singleLine = '<span class=\'plain-text\'>' + singleLine + '</span>'
  }
  return singleLine
}

// 获取字符的开头
//  let charCodeStarter = styles[level % styles.length];
// 获取递增后的字符
//  let style = charCodeStarter;

// 显示格式为：
//  1.2
//       1.2.1
//       1.2.2
//  需要满足的条件
//  获取缩进级别
//  获取前面所有缩进级别的号数
function getPrefix (level) {
  let prefix = ''
  let m = parseLine.orderedListCountByLevelMap
  for (let i = 0; i < level; i++) {
    let preCount = m.get(i)
    // 因为上一级别的递增了，所以我们要减去1, 如果上一级没有存数，则设置为1
    preCount = preCount === undefined ? 1 : preCount - 1
    prefix += preCount + '.'
  }
  return prefix
}

// 单行解析============================结束

//  多行解析============================
/**
 * 解析代码
 * @param arr
 * @constructor
 */
function CodeParser (arr) {
  if (arr == null) {
    throw new Error('传入的code数组不能为空！')
  }
  // 解析前的代码数组
  this.codeArr = arr
  // 解析后的html对象
  this.codeEle = ''
  // 代码类型
  this.type = initType(arr[0]).trim()

  /**
   * 获取代码类型
   * @param arrElement
   */
  function initType (arrElement) {
    if (arrElement == null || arrElement === '') {
      return 'default'
    }
    let index = arrElement.indexOf('```')
    return index === -1 ? 'default' : arrElement.substring(index + 3)
  }

  this.initMultiLineCode = function () {
    // pre标签可以保留空格
    this.codeEle = '<pre>'
    //  this.codeEle += "<div class='code code-multi-frame'>";
    this.codeEle += '<div class=\'code code-multi-frame\'>'
    //  this.codeEle += "<div class='md-code-bar'  >" +
    //      "<span onclick='toggleCode(this, this.parentElement.nextSibling)'  class='md-code-fold'>+</span>" +
    //      "</div>";
    this.codeEle += '<ol>'
    // 如果是多行代码去掉第一行和最后一行，因为它们都包含了```
    for (let i = 1; i < this.codeArr.length - 1; i++) {
      let singleCodeLine = this.codeArr[i]

      // 代码高亮
      singleCodeLine = highlightCode(singleCodeLine, this.type)

      let singleCodeLineEle = '<li class=\'code-multi-frame-line\'>' + singleCodeLine + '</li>'
      this.codeEle += singleCodeLineEle
    }
    this.codeEle += '</ol>'
    this.codeEle += '</div>'
    this.codeEle += '</pre>'
  }

  this.initMultiLineCode()

  this.getCodeEle = function () {
    return this.codeEle
  }
}

/**
 * 解析  空格 + Tab 形成的block
 */
function BlockParser (arr) {
  this.blockEle = ''
  this.blockEle += '<div class=\'block-frame\' >'
  this.blockEle += '<ol>'
  // 不需要第一行的空行 所以let i = 1;
  // 不处理最后一行, 所以arr.length-1
  for (let i = 1; i < arr.length - 1; i++) {
    let line = arr[i]
    // 去掉缩进的四个空格，并进行转换
    line = line.substring(4).replace(/ /g, '&nbsp;')

    // 转义特殊字符
    line = escapeCode(line, false)

    // 高亮字符串
    line = line.replace(/&quot;(.*)&quot;/g, '<span style=\'color: darkgoldenrod\'>"$1"</span>')
    line = line.replace(/&#39;(.*)&#39;/g, '<span style=\'color: darkgoldenrod\'>\'$1\'</span>')
    //  line = higlightCode(line, "default");

    let lineEle = ''
    // 显示空行的li标签
    if (line.trim().length === 0) {
      lineEle = '<li class=\'block-line\' style=\'visibility: hidden\'>&nbsp</li>'
    } else {
      lineEle = '<li class=\'block-line\'>' + line + '</li>'
    }
    this.blockEle += lineEle
  }
  this.blockEle += '</ol>'
  this.blockEle += '</div>'
  //  let lastLine = arr[arr.length - 1];
  // 最后一行不处理
  //  this.blockEle += parseLine(lastLine);

  this.getBlockEle = function () {
    return this.blockEle
  }
}

/***
 * 解析引用框框 >
 */
function QuoteParser (arr) {
  this.quoteEle = ''
  this.quoteEle += '<div class=\'quote-frame\'>'
  this.quoteEle += '<ol>'
  for (let i = 0; i < arr.length; i++) {
    let line = arr[i]
    // 去掉缩进的四个空格，并进行转换
    //  line = line.substring(4).replace(/ /g, "&nbsp;");
    // 转义特殊字符
    //  line = escapeCode(line, false);

    // 高亮字符串
    //  line = line.replace(/&quot;(.*)&quot;/g, "<span style='color: darkgoldenrod'>\"$1\"</span>")
    //  line = line.replace(/&#39;(.*)&#39;/g, "<span style='color: darkgoldenrod'>\'$1\'</span>")

    let prefixRegex = /\s*[>]*/g

    // 把 > 保留，其它的先拿去解析
    let prefix = prefixRegex.exec(line)[0]
    let noQuoteLine = line.substring(prefix.length)

    prefix = prefix.replace(/>/g, '<span  class=\'quote-line-filler\'></span>')
    noQuoteLine = parseLine(noQuoteLine)
    line = prefix + noQuoteLine

    let lineEle = '<li class=\'quote-line\'>' + line + '</li>' + '\n\n'
    this.quoteEle += lineEle
  }
  this.quoteEle += '</ol>'
  this.quoteEle += '</div>'
  this.getQuoteEle = function () {
    return this.quoteEle
  }
}

// ==========================================

// 代码高亮===================================
/**
 * 高亮代码
 * 原理：给一行代码, 按关键字进行高亮
 * @param rawCode 未高亮的一行代码
 * @param language 语言
 */

// 判断java是否进入了多行注释
let isStartComment = false

// 判断html是否为多行注释
let isStartMultiLineHtmlComment = false

/**
 * 高亮代码
 * @param rawCode
 * @param language
 * @returns {string|void|*}
 */
function highlightCode (rawCode, language) {
  // 代码缩进把空格替换成 &nbsp;

  //  rawCode = rawCode.replace(/ /g, "&nbsp;")
  //  singleCodeLine = singleCodeLine.replace(/ /g, "&nbsp;&nbsp;")

  if (language == null || language === '') {
    language = 'default'
  }
  language = language.toLowerCase()

// TODO 编写高亮css，添加到code组件
  switch (language) {
    case 'singleline':
      return parseSingleLine(rawCode)
    case 'java':
      return parseJava(rawCode)
    //  return parseDefault(rawCode);
    case 'html':
      return parseXML(rawCode)
    case 'javascript':
      return parseDefault(rawCode)
    case 'json':
      return parseJSON(rawCode)
    case 'sql':
      return parseSQL(rawCode)
    case 'default':
      return parseDefault(rawCode)
    default:
      return rawCode
  }

  function parseSQL (rawCode) {
    let nCode = escapeCode(rawCode, false)
    const keywords = [
      /* 关键字 */
      'primary', 'foreign', 'not', 'null', 'references',
      'index',
      /* DQL | DML  */
      'select', 'delete', 'update', 'insert',
      'from', 'into', 'on',
      'group by', 'having', 'order by', 'desc', 'asc', 'in',
      'where', 'inner', 'outer', 'join', 'or', 'and',
      'like', 'limit',

      /* DDL 数据操定义语言 */
      'create', 'alter', 'drop',

      /* 常用对象 */
      'date', 'timestamp',

      /* 其它 */
      'is null', 'default', 'constraint', 'case', 'between', 'as',
      'any', 'add', 'exists', 'set', 'union', 'values', 'value',
      'is', 'no',

      /* DCL 数据控制语言 */
      'grant', 'rollback', 'commit', 'autocommit',

      /* 空间 */
      'tablespace'
    ]

    //  获取开头的缩进内容
    let indentSize = rawCode.search(/[^\s]/g)
    let indentEle = ''
    if (indentSize !== -1) {
      // 缩进的单位
      //  indentEle = "<span class='code-indent' style='padding-left: " + (Math.floor((indentSize / 4) * 20) + "px'></span>");
      indentEle = rawCode.substring(0, indentSize)
    }

    // 高亮注释--
    let commentReg = /^(\s*--\s*)(.*)/g
    if (commentReg.test(nCode)) {
      nCode = nCode.replace(commentReg, '<span class=\'hl-code-one-line-comment\'>$1$2</span>')
    }

    nCode = starTypeCommentSpliter(nCode, keywords)

    return indentEle + nCode
  }

  /***
   * 斜杠**斜杠 类型的注释切割器接口
   * 将注释和代码切割便于高亮，切割方法：正则的match(REGEX)
   * Array arr = string.match(REGEX)
   * @param nCode 一行待切割的代码
   * @param keywords 需要高亮哪些关键字
   * @param customParser 自定义高亮方法
   * @returns {*}
   */
  function starTypeCommentSpliter (nCode, keywords, customParser) {
    let commentSeparatorReg = /.*?\/\*((?!\*\/).)*\*\//g

    // 2. 拿到正则无法获取最后面的一小段的边界
    //  比如 代码1 /* 注释*/ 代码2 /*注释 */ 代码3
    // 上面的代码3用上面的正则是无法获取的
    let codeAfterCommentIndex = nCode.lastIndexOf('*/')

    // 3. 拿到正则无法获取最后面的一小段
    // 文本1  /* 注释1 */ 文本 2
    // 切割方法只能拿到注释和注释前面的文本，所有后面的文本2需要我们手动处理
    let codeAfterLastComment = nCode.substring(codeAfterCommentIndex + 2)

    // 4. 获取注释和注释前面的内容
    // 比如    文本1 /* 注释1 */
    // 这里我们就获取到了
    //         文本1 /*注释1
    // 但是注释的闭合*/ 需要我们自己添加上去
    let codeBeforeCommentAndComment = nCode.substring(0, codeAfterCommentIndex) + '*/'

    // 比如：切割  abc /* 注释1*/ def /**注释2*/ ghi /*注释3 */ jkl
    //  /**
    //    [
    //         "abc /* 注释1 */",
    //         "def /* 注释2 */",
    //         "ghi /* 注释3 */"
    //    ]
    //    这里的jkl用这种切割方法是无法获取到的，我们上面第3步的时候已经单独提取处理
    // 注：由于第三步已经把jkl提取出来，所以实际上任何的 */ 后面的文本都不会在这里出现
    let arrSplitByComment = codeBeforeCommentAndComment.match(commentSeparatorReg)

    // 临时拼接处理后的的ELE,
    // 比如拼接 <span class="高亮"> System.out.println("ok") </span> <span class="注释"> /* 注释 */ </span>
    let temEleWithCommentAndCode = ''
    if (arrSplitByComment !== null) {
      for (let i = 0; i < arrSplitByComment.length; i++) {
        // "abc /* 注释1 */
        let codeAndComment = arrSplitByComment[i]

        // "abc | /* 注释2 */  这里的|表示我们要获取的位置
        let codeAndCommentBoundaryIndex = codeAndComment.search(/\/\*.*\*\//g)

        // 比如获取 "abc | /* 注释 */ 中的 abc
        let rawCode = codeAndComment.substring(0, codeAndCommentBoundaryIndex)

        // 比如获取 "abc | /* 注释*/ 中的 /*注释 */
        let rawComment = codeAndComment.substring(codeAndCommentBoundaryIndex)

        // 处理code , 即处理  "abc ", 其中abc是非注释的内容，比如System.out.println("ok");
        let code = parseSingleCode(rawCode)

        // 处理comment, 即处理  "/* 注释  */"
        let comment = parseDefaultComment(rawComment)

        // 拼接处理后的tag 和 comment
        temEleWithCommentAndCode += code + comment
      }
      // 拼接上面提取的jkl
      nCode = temEleWithCommentAndCode + parseSingleCode(codeAfterLastComment)
    } else {
      nCode = parseSingleCode(nCode)
    }
    return nCode

    /***
     * 处理被正则分割后，非全注释部分
     * 比如
     */
    //  (空白) /* 注释1*/  System.out.println("ok")  /*注释2*/ public /*注释3 */ 文本4  /* 半个注释
    // 这里处理的包括
    //   1. 开头的空白
    //   2.  System.out.println("ok")
    //   3. public
    //   4. 文本4
    //   5. /* 半个注释
    function parseSingleCode (nCode) {
      let commentStartReg = /\/\*/g
      let commentEndReg = /\*\//g

      if (commentStartReg.test(nCode)) {
        /**
         * 单行有注释的开头，没有注释结尾
         * 这时候不解析后面的任何字符，直接返回，进入下一行的解析
         * 比如
         *      /* 开始注释
         * 但是没有结束，不用说后面的肯定是灰色的
         * 但是前面的需要单独拿出来解析
         */
        if (!isStartComment && /\/\*/g.test(nCode) && !/\*\//g.test(nCode)) {
          // 分割注释和前面非注释的内容
          // 比如  System.out.println("ok")      |/*  注释1
          //  这里的的|就是分割的地方
          let lastCommentStartIndex = nCode.lastIndexOf('/*')
          // 获取注释,即获取 /* 注释1
          let afterIndexOfComment = nCode.substring(lastCommentStartIndex)

          // 获取注释前面的字符串，即System.out.println("ok")      |
          let stringBeforeLastCommentStartIndex = nCode.substring(0, lastCommentStartIndex)

          //
          afterIndexOfComment = '<span class=\'hl-code-multi-line-comment\'>' + afterIndexOfComment + '</span>'
          let tempEle = praseDefaultWithNoComplexCommentSurrounded(stringBeforeLastCommentStartIndex) + afterIndexOfComment
          isStartComment = true
          return tempEle
        }

        //  let singleCommentReg = /(\/\*.*\*\/)/g;
        // 检测是否为单行注释, 中间不能有其它内容
        let singleCommentReg = /^\s*?(\/\*((?!\*\/|\/\*).)+\*\/)\s*?$/g
        if (singleCommentReg.test(rawCode)) {
          nCode = rawCode.replace(singleCommentReg, '<span class=\'hl-code-one-line-comment\'>$1</span>')
          return nCode
        }
      }
      return praseDefaultWithNoComplexCommentSurrounded(nCode)

      /**
       * 因为上面已将复杂包围的注释切割成 内容 + 注释的形式,
       * 这里处理的就是
       * 1. 内容 + 注释
       * 2. 内容 + 多行注释开头
       * 3. 多行注释结尾 + 内容
       * @param nCode
       * @returns {string}
       */
      function praseDefaultWithNoComplexCommentSurrounded (nCode) {
        // 进入了多行注释，但是注释还没结束, 直接返回,
        if (isStartComment && !commentEndReg.test(nCode)) {
          nCode = '<span class=\'hl-code-multi-line-comment\'>' + nCode + '</span>'
          return nCode
        }
        // 进入了多行注释，判断到结束字符, 把注释前面的内容全部注释掉
        // 比如
        //  (被注释掉的内容)  */  没有被注释掉的内容
        // 这里处理的就是把 '(被注释掉的内容)  */' 这部分处理，剩余的没有被注释掉的内容由下面接着
        if (isStartComment && /\*\//g.test(nCode)) {
          let commentStartToEndReg = /(.*\*\/)/g
          isStartComment = false
          nCode = nCode.replace(commentStartToEndReg, '<span class=\'hl-code-multi-line-comment\'>$1</span>')
        }

        if (customParser !== undefined) {
          nCode = customParser(nCode)
        } else {
          nCode = highlightDefault(nCode)
        }
        return nCode
      }

      /**
       * 默认的高亮方法
       * @param nCode
       * @returns {string}
       */
      function highlightDefault (nCode) {
        //  高亮字符串
        /**
         * 解释：
         * (&quot;)     引号开头
         * (.*?[^\\])   任意内容，不贪婪匹配，直到遇到非转义符号(\)的时候停止
         * (&quot;)     在转义符号后面必须有&quot;才匹配
         * @type {RegExp}
         */
        let strReg = /(&quot;)(.*?[^\\])(&quot;)/g
        if (strReg.test(nCode)) {
          nCode = nCode.replace(strReg, '<span class=\'hl-code-string\'>$1$2$3</span>')
        }

        // 高亮字符
        let str1Reg = /&#39;(((?!hl-code-string).)*?)&#39;/g
        //  let str1Reg = /&#39;(.*?)&#39;/g;
        if (str1Reg.test(nCode)) {
          nCode = nCode.replace(str1Reg, '<span class=\'hl-code-string\'>\'$1\'</span>')
        }

        // 高亮数字
        // \b表示非字母数字与字母数字的边界。
        // 由于'会被转义成&#39, 我们不能高亮这个数字，否则会将&#39分割成 &#<span...>39</span> 网页就无法正确显示了
        let numberReg = /([^#]|^)\b(\d+)\b/g
        nCode = nCode.replace(numberReg, '$1<span class=\'hl-code-number\'>$2</span>')

        // 高亮注解
        let annoReg = /(@\b\w+\b)(\()?/g
        nCode = nCode.replace(annoReg, '<span class=\'hl-code-annotation\'>$1</span>$2')

        // 高亮关键字
        for (let i = 0; i < keywords.length; i++) {
          if (nCode.trim().length === 0) {
            break
          }
          // \\b边界限定
          // 为防止标签内的class和java关键字冲突，需要用[^=]排除class=的字段
          let keyWordReg = new RegExp('\\b(' + keywords[i] + ')\\b([^=])', 'gi')

          nCode = nCode.replace(keyWordReg, '<span class=\'hl-code-keyword\'>$1</span>$2')
        }

        // 高亮方法
        let funReg = /\b([\w]+)\b(\s*)\(/g
        let obj = funReg.exec(nCode)
        if (obj) {
          nCode = nCode.replace(funReg, '<span class=\'hl-code-function\'>$1</span>$2(')
        }

        // 高亮this后面的属性
        let thisFieldReg = /(this<\/span>).([\w]+)/
        // 如果不是方法, 则需要处理
        nCode = nCode.replace(thisFieldReg, '$1.<span class=\'hl-code-field\'>$2</span>')
        //  nCode = nCode.replace(thisFieldReg, "$1.<span class='hl-code-field'>$2</span>");

        // 高亮单行注释
        // 形式//
        let singleCommentReg = /\/\/(.*)/g
        if (singleCommentReg.test(nCode)) {
          // 获取注释的字串
          nCode = nCode.substring(0, nCode.indexOf('//')) + getTrimedHtml(nCode.substring(nCode.indexOf('//')))
          nCode = nCode.replace(singleCommentReg, '<span class=\'hl-code-one-line-comment\'>//$1</span>')
          return nCode
        }
        return nCode
      }
    }

    /**
     * 处理单行的注释
     * @param nCode
     * @returns {void | string | *}
     */
    function parseDefaultComment (nCode) {
      // 检测是否为单行注释
      /**
       * 单行有注释的开头，有注释结尾
       */
      let singleCommentReg = /(\/\*.*\*\/)/g
      if (singleCommentReg.test(nCode)) {
        nCode = nCode.replace(singleCommentReg, '<span class=\'hl-code-one-line-comment\'>$1</span>')
      }
      return nCode
    }
  }

  function parseJSON (rawCode) {
    let nCode = escapeCode(rawCode, false)
    // // 高亮KEY""
    //  let keyReg = /(&quot;)(.*?[^\\])(&quot;)/g;
    let keyReg = /(&quot;)(.*?[^\\])(&quot;)\s*:/g
    if (keyReg.test(nCode)) {
      //  nCode = nCode.replace(strReg, "<span class='hl-code-string'>\"$1\"</span>");
      //  nCode = nCode.replace(strReg, "$1<span class='hl-code-string'>$2</span>$3");
      nCode = nCode.replace(keyReg, '<span class=\'hl-code-json-key\'>$1$2$3</span>:')
    }

    let valueReg = /\s*:\s*(&quot;)(.*?[^\\])(&quot;)/g
    if (valueReg.test(nCode)) {
      //  nCode = nCode.replace(strReg, "<span class='hl-code-string'>\"$1\"</span>");
      //  nCode = nCode.replace(strReg, "$1<span class='hl-code-string'>$2</span>$3");
      nCode = nCode.replace(valueReg, ':<span class=\'hl-code-json-value\'>$1$2$3</span>')
    }

    // 高亮字符串''
    //  let str1Reg = /'([^']+)'/g;
    let str1Reg = /&#39;(.*?)&#39;/g
    if (str1Reg.test(nCode)) {
      nCode = nCode.replace(str1Reg, '<span class=\'hl-code-html-string\'>\'$1\'</span>')
    }

    // 高亮数字
    // \b表示非字母数字与字母数字的边界。
    // 由于'会被转义成&#39, 我们不能高亮这个数字，否则会将&#39分割成 &#<span...>39</span> 网页就无法正确显示了
    let numberReg = /([^#])\b(\d+)\b/g
    nCode = nCode.replace(numberReg, '$1<span class=\'hl-code-number\'>$2</span>')

    return nCode
  }

  /**
   * 高亮单行代码
   * @param rawCode
   */
  function parseSingleLine (rawCode) {
    // 检测是否为html
    let htmlReg = /&lt;.*&gt;/g
    if (htmlReg.test(rawCode)) {
      return parseXML(rawCode)
    } else {
      return parseDefault(rawCode)
    }
  }

  function parseXML (rawCode) {
    /**
     * 单独处理每个XML标签, 不能闭合，不能有其他任何东西
     * 参数举例 ： <a href="example.com" >
     * 参数举例 ： <span class="ok">
     * 参数举例 ： <span>
     * 参数举例 ： <!DOCTYPE html>
     *
     * 错误参数举例： <a href="example.com"></a>
     * 错误参数举例2: <a href="example.com"> abc </a>
     * 错误参数举例3: <a href="example.com">
     * @param rawXML
     * @returns {string}
     */
    function parseOneTagOfXML (rawXML) {
      let nCode = rawXML

      // 2. 处理多行简单的多行html注释
      /**
       *      <!--
       *          abc -->
       * 或者
       * <!--
       *  abc
       * -->
       * @type {RegExp}
       */
      let startComent = /(&lt;!--.*)/g
      let endComment = /(--&gt;)/g
      if (!isStartMultiLineHtmlComment && startComent.test(nCode) && !endComment.test(nCode)) {
        isStartMultiLineHtmlComment = true
        let lastCommentIndex = nCode.lastIndexOf('&lt;!--')
        //  return indentEle + nCode.replace(startComent, "<span class='hl-code-html-comment'>$1</span>");
        return indentEle + nCode.substring(0, lastCommentIndex) + '<span class=\'hl-code-html-comment\'>' + nCode.substring(lastCommentIndex + 7) + '</span>'
      }

      // 进入了注释
      if (isStartMultiLineHtmlComment) {
        // 判断结束
        if (!startComent.test(nCode) && endComment.test(nCode)) {
          isStartMultiLineHtmlComment = false
          return indentEle + nCode.replace(endComment, '<span class=\'hl-code-html-comment\'>$1</span>')
        }
        nCode = '<span class=\'hl-code-html-comment\'>' + nCode + '</span>'
      }

      //                 1<  2/ 3标签名称 4属性 5> 6内容    7</ 8标签名称
      //  let tagNameReg = /(<)(\/?)([\w]+)(.*)(>)([^>]+)(\1\/)(\3)/g;
      // 单行闭合标签
      //  let singleLineTag = /(&lt;)(\/?)([\w]+)(.*)(&gt;)([^&gt;]*)(\1\/)(\3)/g;
      //  let singleLineTag = /(&lt;)(\/?)([\w]+)(.*)(&gt;)([^&;]*)(\1\/)(\3)/g;
      let singleLineTag = /(&lt;)(\/?)([\w]+)(.*)(&gt;)(.*)(\1\/)(\3)/g
      // "<a > b</a>".replace(/(<)(\/?)([\w]+)(.*)(>)([^>]+)(\1\/)(\3)/g, "#1$1# ^2$2^ (3$3) @4$4@ (5$5) @6$6@ (7$7)  #8$8#")
      //  nCode = nCode.replace(tagNameReg, "$1$2<span style='color: red'>$3</span>$4$5$6$7$8$9$10$11");
      nCode = nCode.replace(singleLineTag,
        /* 1.2 <或者</ */
        '$1$2' +
        /* 3 标签名称 */
        '<span style=\'color: red\'>$3</span>' +
        /* 4. 属性 */
        '<span style=\'color: orange\'>$4</span>' +
        /* 5. > */
        '$5' +
        /* 6. 内容 */
        '<span style=\'color: grey\'>$6</span>' +
        /* 7. </ */
        '$7' +
        /* 8. 标签名称 */
        '<span style=\'color: red\'>$8</span>'
      )

      // 未闭合标签
      //                   1<  2/ 3标签名称 4属性 5> 6内容
      let noCloseTag = /(&lt;)(\/?)([\w]+)(.*)(&gt;)/g
      nCode = nCode.replace(noCloseTag,
        /* 1.2 <或者</ */
        '$1$2' +
        /* 3 标签名称 */
        '<span class=\'hl-code-html-tag\'>$3</span>' +
        /* 4. 属性 */
        '<span class=\'hl-code-html-prop\'>$4</span>' +
        /* 5. > */
        '$5'
      )

      // // 高亮字符串""
      let strReg = /(&quot;)(.*?[^\\])(&quot;)/g
      if (strReg.test(nCode)) {
        //  nCode = nCode.replace(strReg, "<span class='hl-code-string'>\"$1\"</span>");
        //  nCode = nCode.replace(strReg, "$1<span class='hl-code-string'>$2</span>$3");
        nCode = nCode.replace(strReg, '<span class=\'hl-code-html-string\'>$1$2$3</span>')
      }

      // 高亮字符串''
      //  let str1Reg = /'([^']+)'/g;
      let str1Reg = /&#39;(.*?)&#39;/g
      if (str1Reg.test(nCode)) {
        nCode = nCode.replace(str1Reg, '<span class=\'hl-code-html-string\'>\'$1\'</span>')
      }

      // 什么也没有
      if (nCode.trim().substring(0, 1) !== '&') {
        return parsePlainTextOfXML(nCode)
      }

      return nCode
    }

    /**
     * 处理非注释以外的xml标签
     * 比如
     * <a></a>
     * <span class="abc"> test </span>
     * @param nCode
     * @returns {string}
     */
    function parseNoneCommentXML (nCode) {
      /**
       *      <!--
       *          abc -->
       * 或者
       * <!--
       *  abc
       * -->
       * @type {RegExp}
       */
      let endComment = /(--&gt;)/g
      let afterComment = ''
      let beforeComment = ''
      //  if (!isStartMultiLineHtmlComment && startComent.test(nCode) && !endComment.test(nCode)) {
      //  if (!isStartMultiLineHtmlComment && /&lt;!--.*(?!--&gt;)$/g.test(nCode)) {
      //  if (!isStartMultiLineHtmlComment && /<!--((?!-->).)*$/g.test(nCode)) {
      if (/&lt;!--((?!--&gt;).)*$/g.test(nCode)) {
        isStartMultiLineHtmlComment = true
        let lastCommentIndex = nCode.lastIndexOf('&lt;!--')
        //  return indentEle + nCode.replace(startComent, "<span class='hl-code-html-comment'>$1</span>");
        afterComment = '<span class=\'hl-code-html-comment\'>' + nCode.substring(lastCommentIndex) + '</span>'
        nCode = nCode.substring(0, lastCommentIndex)

        // 检测前面是否有注释
        if (/--&gt;/g.test(nCode)) {
          let index = nCode.indexOf('--&gt;')
          beforeComment = '<span class=\'hl-code-html-comment\'>' + nCode.substring(0, index + 6) + '</span>'
          nCode = nCode.substring(index + 6)
        }
      } else if (isStartMultiLineHtmlComment) {
        // 进入了注释
        // 判断结束
        if (endComment.test(nCode)) {
          isStartMultiLineHtmlComment = false
          //  beforeComment = nCode.replace(/^(.*?--&gt;)/g, "<span class='hl-code-html-comment'>$1</span>");
          beforeComment = nCode.replace(/^(.*?--&gt;).*/g, '<span class=\'hl-code-html-comment\'>$1</span>')
          let index = nCode.lastIndexOf('--&gt;')
          nCode = nCode.substring(index + 6)
        } else {
          nCode = '<span class=\'hl-code-html-comment\'>' + nCode + '</span>'
          return nCode
        }
      }

      // 判断纯文本
      if (!/&lt;\/?\w+.*&gt/.test(nCode)) {
        return beforeComment + parsePlainTextOfXML(nCode) + afterComment
      }

      /**
       * 方法2
       */
        //  let tagSeparatorReg2 = /.*?<[^>]+>/g;
      let tagSeparatorReg2 = /.*?&lt;((?!&gt;).)+&gt;/g

      // 获取标签后面的字符串
      let textAfterIndex = nCode.lastIndexOf('&gt;')
      let textAfter = nCode.substring(textAfterIndex + 4)

      // 获取标签前面的字符串
      let textBeforeIndex = nCode.search(/&lt;\w+.*&gt;/g)
      let textBefore = nCode.substring(0, textBeforeIndex)

      // 获取去掉两边字符串的标签
      let tagEle = nCode.substring(textBeforeIndex, textAfterIndex) + '&gt;'

      // 将标签分割成标签组
      let tagArr2 = tagEle.match(tagSeparatorReg2)
      if (tagArr2 !== null) {
        let tempEle = ''
        for (let i = 0; i < tagArr2.length; i++) {
          let plainTextWithTag = tagArr2[i]
          let textAndTagBoundaryReg = /&lt;\/\w+.*&gt;/g
          let textAndTagBoundary = plainTextWithTag.search(textAndTagBoundaryReg)
          let plainText = plainTextWithTag.substring(0, textAndTagBoundary)
          let tag = plainTextWithTag.substring(textAndTagBoundary)
          tempEle += parsePlainTextOfXML(plainText) + parseOneTagOfXML(tag)
        }
        return beforeComment + parsePlainTextOfXML(textBefore) + tempEle + parsePlainTextOfXML(textAfter) + afterComment
      } else {
        return beforeComment + parsePlainTextOfXML(nCode) + afterComment
      }
    }

    /**
     * 处理XML的纯文本
     * @param plainText
     * @returns {string}
     */
    function parsePlainTextOfXML (plainText) {
      if (plainText !== null && plainText !== undefined && plainText.length !== 0) {
        return '<span class=\'hl-code-html-plain-text\'>' + plainText + '</span>'
      }
      return ''
    }

    /**
     * 处理XML注释
     * @param rawComment
     * @returns {void | string | *}
     */
    function parseXMLComment (rawComment) {
      let xmlComment = /(^\s?&lt;!--.*?--&gt;)/g
      if (xmlComment.test(rawComment)) {
        return rawComment.replace(xmlComment, '<span class=\'hl-code-html-comment\'>$1</span>')
      }
    }

    let nCode = escapeCode(rawCode.trim(), false)

    //  获取开头的缩进内容
    let indentSize = rawCode.search(/[^\s]/g)
    let indentEle = ''
    if (indentSize !== -1) {
      // 缩进的单位
      //  indentEle = "<span class='code-indent' style='padding-left: " + (Math.floor((indentSize / 4) * 20) + "px'></span>");
      indentEle = rawCode.substring(0, indentSize)
    }

    // 判断实体
    // 高亮XML声明
    let docTypeReg = /(&lt;)(![\w]+)(\s+)(.*)(&gt;)/g
    if (docTypeReg.test(nCode)) {
      return indentEle + nCode.replace(docTypeReg, '$1<span class=\'hl-code-html-declare-tag\'>$2</span>$3<span class=\'hl-code-html-declare-type\'>$4</span>$5')
    }

    //
    // // 2. 处理多行简单的多行html注释
    //  /**
    //   *      <!--
    //   *          abc -->
    //   * 或者
    //   * <!--
    //   *  abc
    //   * -->
    //   * @type {RegExp}
    //   */
    //  let startComent = /(&lt;!--.*)/g;
    //  let endComment = /(.*--&gt;)/g;
    //  if (!isStartMultiLineHtmlComment && startComent.test(nCode) && !endComment.test(nCode)) {
    //      isStartMultiLineHtmlComment = true;
    //      let lastCommentIndex = nCode.lastIndexOf("&lt;!--");
    //     //  return indentEle + nCode.replace(startComent, "<span class='hl-code-html-comment'>$1</span>");
    //      return indentEle + "<span class='hl-code-html-comment'>" + nCode.substring(lastCommentIndex+7) + "</span>";
    //  }
    //
    // // 进入了注释
    //  if (isStartMultiLineHtmlComment) {
    //     // 判断结束
    //      if (!startComent.test(nCode) && endComment.test(nCode)) {
    //          isStartMultiLineHtmlComment = false;
    //          return indentEle + nCode.replace(endComment, "<span class='hl-code-html-comment'>$1</span>");
    //      }
    //      return indentEle + "<span class='hl-code-html-comment'>" + nCode + "</span>";
    //  }

    /**
     * 比如
     * <!--注释1--> <a>不是注释</a> <!--注释2--> <a>不是注释</a>
     */
    /**
     * 切割注释和标签
     * @type {RegExp}
     */
      //  let tagSeparatorReg = /.*?<[^>]+>/g;
    let commentSeparatorReg = /.*?&lt;!--((?!--&gt;).)+--&gt;/g
    // 1. 处理单行注释
    //  let xmlComment = /<!--(.*)-->/g

    // 2. 拿到正则无法获取最后面的一小段的边界 比如 <!--xx-->边界(此处正则无法获取的内容)
    let tagAfterCommentIndex = nCode.lastIndexOf('--&gt;')

    // 3. 拿到正则无法获取最后面的一小段
    // 文本1  <!--xx--> 文本 2
    // 切割方法只能拿到注释和注释前面的文本，所有后面的文本2需要我们手动处理
    let tagAfterComment = nCode.substring(tagAfterCommentIndex + 6)

    // 4. 获取注释和注释前面的内容
    // 比如    文本1 <!--xxx-->
    // 这里我们就获取到了
    //         文本1 <!--xxx--
    // 但是--> 需要我们自己添加上去
    let tagCommentBefore = nCode.substring(0, tagAfterCommentIndex) + '--&gt;'

    // 比如：切割  abc <!--aa--> def <!--bb--> ghi <!--cc--> jkl
    /**
     * [
     *      "abc <!--aa-->",
     *      "def <!--bb-->",
     *      "ghi <!--cc-->"
     * ]
     * 这里的jkl用这种切割方法是无法获取到的，我们上面低3步的时候已经单独提取处理
     */
      // 注：由于第三步已经把jkl提取出来，所以实际上任何的 --> 后面的文本都不会在这里出现
    let commentTagArr = tagCommentBefore.match(commentSeparatorReg)

    // 临时拼接处理后的的ELE,
    // 比如拼接 <span class="高亮"> &lt;a&gt;&lt;/a&gt; + </span> <span class="注释"> &lt;!--xxx--&gt;</span>
    let temEleWithCommentAndTag = ''
    if (commentTagArr !== null) {
      for (let i = 0; i < commentTagArr.length; i++) {
        // "abc <!--aa-->
        let commentWithTag = commentTagArr[i]

        // "abc | <!--aa-->  这里的|表示我们要获取的位置
        let commentAndTagBoundaryIndex = commentWithTag.search(/&lt;!--.*&gt;/g)

        // 比如获取 "abc | <!--aa--> 中的 abc
        let tagBeforeComment = commentWithTag.substring(0, commentAndTagBoundaryIndex)

        // 比如获取 "abc | <!--aa--> 中的 <!--aa-->
        let comment = commentWithTag.substring(commentAndTagBoundaryIndex)

        // 处理tagBeforeComment , 即处理  "abc ", 其中abc可能是标签
        let tagBeforeCommentHighlighted = parseNoneCommentXML(tagBeforeComment)

        // 处理comment, 即处理 <!--aa-->
        let commentHighlighted = parseXMLComment(comment)

        // 拼接处理后的tag 和 comment
        temEleWithCommentAndTag += tagBeforeCommentHighlighted + commentHighlighted
      }
      // 拼接上面提取的jkl
      tagAfterComment = parseNoneCommentXML(tagAfterComment)
      nCode = temEleWithCommentAndTag + tagAfterComment
    } else {
      nCode = parseNoneCommentXML(nCode)
    }

    // 拼接 缩进 换行
    nCode = indentEle + nCode
    return nCode
  }

  /**
   * 默认的解析方法
   * @param rawCode
   * @returns {string | void | *}
   */
  function parseDefault (rawCode) {
    const keywords = [
      /* =====javascript===== */
      'function',
      'var', 'let',
      'document',

      /* =====java======= */
      /* 包 */
      'import', 'package',
      /* 类 */
      'new',
      'class', 'abstract', 'interface',
      'extends', 'implements',
      'this', 'instanceof', 'super',

      /* 流程 */
      'try', 'catch', 'finally',
      /* 必须按照这个顺序，否则会解析throw后插入<span>就无法再次解析throws了 */
      'throws',
      'throw',
      'if', 'else', 'while', 'for', 'do',
      'switch', 'case',
      'continue', 'break', 'goto',

      /* 断言 */
      'assert',

      /* 方法/修饰 */
      'void', 'protected', 'public', 'default', 'private',
      'synchronized', 'static',
      'return',

      /* 语言类型 */
      'null',
      'byte',
      'true', 'false',
      'shot', 'int', 'long',
      'float', 'double',
      'char',
      'enum'
    ]

    function highlightDoubleSlashComment (nCode) {
      let singleCommentReg = /\/\/(.*)/g
      if (singleCommentReg.test(nCode)) {
        // 获取注释的字串
        nCode = nCode.substring(0, nCode.indexOf('//')) + getTrimedHtml(nCode.substring(nCode.indexOf('//')))
        nCode = nCode.replace(singleCommentReg, '<span class=\'hl-code-one-line-comment\'>//$1</span>')
      }
      return nCode
    }

    //  获取开头的缩进内容
    function getIndentEle (rawCode) {
      let indentSize = rawCode.search(/[^\s]/g)
      let indentEle = ''
      if (indentSize > 0) {
        indentEle = rawCode.substr(0, indentSize)
      }
      return indentEle
    }

    let indentEle = getIndentEle(rawCode)

    let nCode = escapeCode(rawCode.trim(), false)

    // 单行注释
    nCode = highlightDoubleSlashComment(nCode)

    nCode = starTypeCommentSpliter(nCode, keywords)

    return indentEle + nCode
  }

  /**
   * 解析java代码
   * @param rawCode
   * @returns {string|*}
   */
  function parseJava (rawCode) {
    const keywords = [
      /* 包 */
      'import', 'package',
      /* 类 */
      'new',
      'class', 'abstract', 'interface',
      'extends', 'implements',
      'this', 'instanceof', 'super',

      /* 流程 */
      'try', 'catch', 'finally',
      /* 必须按照这个顺序，否则会解析throw后插入<span>就无法再次解析throws了 */
      'throws',
      'throw',
      'if', 'else', 'while', 'for', 'do',
      'switch', 'case',
      'continue', 'break', 'goto',

      /* 断言 */
      'assert',

      /* 方法/修饰 */
      'void', 'protected', 'public', 'default', 'private',
      'synchronized', 'static',
      'return',

      /* 语言类型 */
      'null',
      'byte',
      'true', 'false',
      'shot', 'int', 'long',
      'float', 'double',
      'char',
      'enum'
    ]

    //  '"': '&quot;',
    //      "'": '&#39;'
    let nCode = escapeCode(rawCode.trim(), false)

    /**
     * 为了防止字符‘和html标签的字符重合，我们先把原生的'转义
     * @type {number | *}
     */

    //  获取开头的缩进内容
    function getIndentEle (rawCode) {
      let indentSize = rawCode.search(/[^\s]/g)
      let indentEle = ''
      if (indentSize > 0) {
        indentEle = rawCode.substr(0, indentSize)
      }
      return indentEle
    }

    let indentEle = getIndentEle(rawCode)

    nCode = starTypeCommentSpliter(
      nCode,
      /* 需要高亮的关键字 */
      keywords,
      /* 自定义高亮方法(除了多行注释不能自定义) */
      javaParser
    )

    function javaParser (nCode) {
      //  高亮字符串
      /**
       * 解释：
       * (&quot;)     引号开头
       * (.*?[^\\])   任意内容，不贪婪匹配，直到遇到非转义符号(\)的时候停止
       * (&quot;)     在转义符号后面必须有&quot;才匹配
       * @type {RegExp}
       */
      let strReg = /(&quot;)(.*?[^\\])(&quot;)/g
      if (strReg.test(nCode)) {
        nCode = nCode.replace(strReg, '<span class=\'hl-code-string\'>$1$2$3</span>')
      }

      // 高亮字符
      let str1Reg = /&#39;(((?!hl-code-string).)*?)&#39;/g
      //  let str1Reg = /&#39;(.*?)&#39;/g;
      if (str1Reg.test(nCode)) {
        nCode = nCode.replace(str1Reg, '<span class=\'hl-code-string\'>\'$1\'</span>')
      }

      // 高亮数字
      // \b表示非字母数字与字母数字的边界。
      // 由于'会被转义成&#39, 我们不能高亮这个数字，否则会将&#39分割成 &#<span...>39</span> 网页就无法正确显示了
      let numberReg = /([^#])\b(\d+)\b/g
      nCode = nCode.replace(numberReg, '$1<span class=\'hl-code-number\'>$2</span>')

      // 高亮注解
      let annoReg = /(@\b\w+\b)(\()?/g
      nCode = nCode.replace(annoReg, '<span class=\'hl-code-annotation\'>$1</span>$2')

      // 高亮关键字
      for (let i = 0; i < keywords.length; i++) {
        if (nCode.trim().length === 0) {
          break
        }
        // \\b边界限定
        // 为防止标签内的class和java关键字冲突，需要用[^=]排除class=的字段
        let keyWordReg = new RegExp('\\b(' + keywords[i] + ')\\b([^=])', 'gi')

        nCode = nCode.replace(keyWordReg, '<span class=\'hl-code-keyword\'>$1</span>$2')
      }

      // 高亮方法
      let funReg = /\b([\w]+)\b(\s*)\(/g
      let obj = funReg.exec(nCode)
      if (obj) {
        nCode = nCode.replace(funReg, '<span class=\'hl-code-function\'>$1</span>$2(')
      }

      // 高亮this后面的属性
      let thisFieldReg = /(this<\/span>).([\w]+)/
      // 如果不是方法, 则需要处理
      nCode = nCode.replace(thisFieldReg, '$1.<span class=\'hl-code-field\'>$2</span>')
      //  nCode = nCode.replace(thisFieldReg, "$1.<span class='hl-code-field'>$2</span>");

      // 高亮单行注释
      // 形式//
      let singleCommentReg = /\/\/(.*)/g
      if (singleCommentReg.test(nCode)) {
        // 获取注释的字串
        nCode = nCode.substring(0, nCode.indexOf('//')) + getTrimedHtml(nCode.substring(nCode.indexOf('//')))
        nCode = nCode.replace(singleCommentReg, '<span class=\'hl-code-one-line-comment\'>//$1</span>')
        return nCode
      }
      return nCode
    }

    return indentEle + nCode
  }

  /**
   * 获取去掉html标签后的文本
   * @param html
   * @returns {void | string | *}
   */
  function getTrimedHtml (html) {
    let trimHtmlReg = /<[^>]+>/g
    return html.replace(trimHtmlReg, '')
  }
}

// 转义特殊字符以免被浏览器解析
escapeCode.escapeTest = /[&<>"']/
escapeCode.escapeReplace = /[&<>"']/g
escapeCode.replacements = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;'
}
escapeCode.escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/
escapeCode.escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g

function escapeCode (html, encode) {
  if (encode) {
    if (escapeCode.escapeTest.test(html)) {
      return html.replace(escapeCode.escapeReplace, function (ch) {
        return escapeCode.replacements[ch]
      })
    }
  } else {
    if (escapeCode.escapeTestNoEncode.test(html)) {
      return html.replace(escapeCode.escapeReplaceNoEncode, function (ch) {
        return escapeCode.replacements[ch]
      })
    }
  }
  return html
}

// ===================================
