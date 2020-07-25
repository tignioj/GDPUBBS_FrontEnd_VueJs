<template>
  <div>
    BlockBigUpdate
    {{id}}
  </div>
</template>

<script>
  export default {
    name: 'BlockBigUpdate',
    data () {
      return {
        id: ''
      }
    },
    mounted () {
      const id = this.$route.params.id
      this.id = id
    }
  }
</script>

<style scoped>

</style>
