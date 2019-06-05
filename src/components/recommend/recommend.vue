<template>
  <div class="recommend">
    <Scroll tag="div" class="recommend-content">
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <Slider>
            <div v-for="(item,index) in recommends"
              :key="index">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" @load="loadImg">
                <!-- <img v-lazy="item.picUrl" @load="loadImg"> -->
              </a>
            </div>
          </Slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="item in discList" 
              :key="item.dissid"
              @click="clickDisc(item)"
            >
              <div class="icon">
                <!-- <img width="60" height="60" :src="item.imgurl"> -->
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name">{{item.creator.name}}</h2>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <Loading></Loading>
      </div>
      <router-view></router-view>
    </Scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
// import Disc from '@/base/disc/disc'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      recommends: [],
      discList: [],
      checkLoad: false
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created () {
    // setTimeout(() => {
    //   this._getDiscList()
    // }, 2000)
    this._getRecommend()
    this._getDiscList()
  },
  destroyed () {
    clearTimeout(this.timer)
  },
  methods: {
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data)
          this.discList = res.data.list
          console.log('discList', this.discList)
        }
      })
    },
    loadImg () {
      //make sure only load img once
      if (!this.checkLoad) {
        console.log("img onload"),
        this.checkLoad = true
      }
    },
    clickDisc (item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
