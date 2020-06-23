<template>
  <div class="mdui-container">
    <h1 v-text="this.$route.params.title"></h1>
    <!-- 内容 -->
    <div id="postContent" class="mdui-card mdui-hoverable mdui-m-t-1 mdui-p-x-3 mdui-p-y-1" v-html="this.content">
    </div>

  </div>
</template>

<script>
  import marked from 'marked'
  import hljs from 'highlight.js'

  export default {
    name: 'PostAddPreview',
    data () {
      return {
        content: ''
      }
    },
    activated () {
      let html = this.parseMd(this.$route.params.content)
      this.content = html
    },
    methods: {
      /**
       * 解析markDown文字成html
       */
      parseMd (mdText) {
        this.initMarkDownOption()
        return marked(mdText)
      },
      /**
       * 初始化MarkDown和higlightjs配置
       */
      initMarkDownOption () {
        const myRender = new marked.Renderer()
        myRender.heading = function (text, level) {
          const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')
          return `
          <h${level}>
            <a name="${escapedText}" class="anchor" href="#${escapedText}">
              <span class="header-link"></span>
            </a>
            ${text}
          </h${level}>`
        }
        // 自定义代码高亮，直接把源码复制过来，在pre标签加入了hljs的class，这样才能使得背景颜色生效
        myRender.code = function (code, infostring, escaped) {
          let lang = (infostring || '').match(/\S*/)[0]
          if (this.options.highlight) {
            let out = this.options.highlight(code, lang)
            if (out != null && out !== code) {
              escaped = true
              code = out
            }
          }
          if (!lang) {
            return '<pre  class="hljs markdown-code"><code>' +
              (escaped ? code : escape(code, true)) +
              '</code></pre>'
          }

          return '<pre class="hljs markdown-code"><code class="' +
            // marked.langPrefix +
            'language-' +
            escape(lang, true) +
            '">' +
            (escaped ? code : escape(code, true)) +
            '</code></pre>\n'
        }

        // https://marked.js.org/#/USING_ADVANCED.md#highlight
        // `highlight` example uses `highlight.js`
        marked.setOptions({
          renderer: myRender,
          highlight: function (code, language) {
            const validLanguage = hljs.getLanguage(language) ? language : 'plaintext'
            return hljs.highlight(validLanguage, code).value
          },

          pedantic: false,
          gfm: true,
          breaks: true,
          sanitize: false,
          smartLists: true,
          smartypants: false,
          xhtml: false
        })
      }
    }
  }
</script>

<style scoped>

</style>
