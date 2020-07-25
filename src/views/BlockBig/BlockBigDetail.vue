<template>
  <div>
    BlockBig Detail
  </div>
</template>

<script>
  import {reqBlockDetail} from '../../api'

  export default {
    name: 'BlockBigDetail',
    data () {
      return {
        blockbigDetail: null
      }
    },
    mounted () {
      const id = this.$route.params.id
      this.loadBlockBigDetails(id)
    },
    methods: {
      loadBlockBigDetails (uid) {
        reqBlockDetail(uid).then(re => {
          console.log(re)
        }).catch(e => {
          console.error(e)
        })
      }
    }
  }
</script>

<style scoped>

</style>
