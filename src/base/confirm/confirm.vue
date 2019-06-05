<template>
  <div class="confirm" v-show="show">
    <div class="text"></div>
    <div class="choose">
      <span class="left" @click="cancle">取消</span>
      <span class="right" @click="clear">清空</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    cancle () {
      this.show = false
    },
    clear () {
      this.show = false
      this.$emit('clear')
    }
  }
}
</script>

<style scoped lang="stylus">
  .confirm
    position fixed
    top 50%
    left 50%
    transform translate(-50%, -50%)
    background white
    width 80%
    height  100px
    color black
    .text
    .choose
      position absolute
      bottom 20px
      .left, .right
        margin 20px
        backgorund-color #eee
</style>
