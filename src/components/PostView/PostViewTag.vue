<template>
    <div>
      <div class="mdui-chip" v-for="(tag, index) in tags" :key="index" @click.prevent="goTagCategories(tag.tagId)">
        <span class="mdui-chip-title">{{tag.tagName}}</span>
      </div>
    </div>
</template>

<script>
  export default {
    props: ['tags'],
    name: 'PostViewTag',
    data () {
      return {
        taglist: []
      }
    },
    created () {
      this.taglist = this.tags
    },
    methods: {
      /**
       * 去往tag分类
       * @param id
       */
      goTagCategories (id) {
        console.log(id)
      }
    }
  }
</script>

<style scoped>

</style>
