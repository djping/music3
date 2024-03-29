<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" ref="plyBtn">
        <div ref="playBtn" class="play" v-show="songs.length">
          <i class="icon-play"></i>
          <span class="text" @click="random">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <Scroll :data="songs" class="list" ref="list" 
      @scroll="scroll" :probe-type="probeType"
      :listenScroll="listenScroll"
    >
      <div class="song-list-wrapper">
        <Songlist 
          :songs="songs" @select="selectItem"
          :rank="rank"
        >
        </Songlist>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <Loading></Loading>
      </div>
    </Scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Songlist from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { mapActions } from 'vuex'

const RESOVERED_HEIGHT = 40

export default {
  props: {
    title: {
      type: String,
      default: null
    },
    bgImg: {
      type: String,
      default: null
    },
    songs: {
      type: Array,
      default: []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scrollY: -1
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  components: {
    Songlist,
    Scroll,
    Loading
  },
  computed: {
    bgStyle () {
      return `background-image: url(${this.bgImg})`
    }
  },
  methods: {
    random () {
      this.randomPlay({list: this.songs})
    },
    back () {
      this.$router.back()
    },
    scroll (pos) {
      this.scrollY = pos.y
      // console.log('scrollY', scrollY)
    },
    selectItem (song, index) {
      console.log('song index', song)
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY (newY) {
      let translateY = Math.max(this.minTranslateY, newY)
      this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px, 0`
      console.log('scrollY', newY)
      
      // use z-index to handle pic
      let zIndex = 0
      let scale = 0
      let persent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        scale = 1 + persent
        this.$refs.bgImage.style['transform'] = `scale(${scale})`
        zIndex = 10
      }
      if (this.imageHeight + newY < RESOVERED_HEIGHT) {
        zIndex = 10
        this.$refs.bgImage.style.height = RESOVERED_HEIGHT + 'px'
        this.$refs.bgImage.style.paddingTop = 0 + 'px'
        this.$refs.plyBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.height = 0 + 'px'
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.plyBtn.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex
    }
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + RESOVERED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      // overflow hidden
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
