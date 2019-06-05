<template>
  <div class="progress-bar" ref="progressBar" @click="progressBarClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchmove"
        @touchend="progressTouchend"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const BUTTON_WIDTH = 16
export default {
  props: {
    persent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    progressTouchStart (e) {
      this.touch.initiaed = true
      let t = e.touches[0]
      this.touch.startX = t.pageX
      this.touch.left = this.$refs.progress.clientWidth
      console.log(t)
    },
    progressTouchmove (e) {
      let t = e.touches[0]
      let endX = t.pageX
      const deltatWidth = endX - this.touch.startX
      // let progressWidth = this.$refs.progress.clientWidth
      // 偏移的位置不能超过进度条的长度
      let barWidth = this.$refs.progressBar.clientWidth
      const offsetWidth = Math.max(0, Math.min(deltatWidth + this.touch.left, 
        barWidth - BUTTON_WIDTH))
      // 进度条的偏移
      this._offset(offsetWidth)
    },
    progressTouchend () {
      this.touch.initiaed = false
      this._triggerPersent()
    },
    _triggerPersent () {
      let barWidth = this.$refs.progressBar.clientWidth - BUTTON_WIDTH
      let progressWidth = this.$refs.progress.clientWidth
      const persent = progressWidth / barWidth
      console.log('persent', persent)
      this.$emit('persentChange', persent)
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = offsetWidth + 'px'
      this.$refs.progressBtn.style['transform'] = `translate(${offsetWidth}px, 0)`
    },
    progressBarClick (e) {
      this._offset(e.offsetX)
      console.log(e)
      console.log('X', e.offsetX)
      console.log('Y', e.offsetX)
      this._triggerPersent()
    }
  },
  watch: {
    persent (newVal) {
      if (newVal >= 0 && !this.touch.initiaed) {
        let restWidth = this.$refs.progressBar.clientWidth - BUTTON_WIDTH
        let offsetWidth = restWidth * newVal
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
