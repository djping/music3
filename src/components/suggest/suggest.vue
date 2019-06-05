<template>
  <Scroll class="suggest" 
    :data="result"
    :pullup="pullup"
    @scrollToEnd="searchMore"
  >
    <ul class="suggest-list">
      <li v-for="(item, index) in result" :key="index" 
        class="suggest-item"
        @click="selectItem(item)"
      >
        <div class="icon">
          <i class="icon" :class='bindIncoClass(item)'></i>
        </div>
        <div class="name">
          <p class="text" v-html="displayText(item)"></p>
        </div>
      </li>
    </ul>
    <div>
      <Loading ></Loading>
    </div>
  </Scroll>
</template>

<script type="text/ecmascript-6">
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import Scroll from 'base/scroll/scroll'
import { createSong, processSongsUrl } from 'common/js/song'
// import { filterSinger } from 'common/js/song'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import { mapMutations, mapActions } from 'vuex'

const perpage = 20
const TYPE_SINGER = 'singer'
export default {
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      total: 0
    }
  },
  components: {
    Scroll,
    Loading
  },
  props: {
    query: {
      type: String,
      default: null
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  created () {
  },
  watch: {
    query (newQuery) {
      console.log(newQuery)
      this._search()
    }
  },
  methods: {
    _search () {
      this.page = 1
      search(this.query, this.page, this.showSinger, perpage)
        .then(res => {
         console.log(res)
        //  this.result = this._genResult(res.data)
        //  console.log('this.result',  this.result)
         // check whether has rest songs
         this.total = res.data.song.totalnum
         console.log(this.total)
         var newSongs = []
         processSongsUrl(this._normalizeSons(res.data.song.list))
            .then(songs => {
              newSongs = songs
              console.log('newSongs', newSongs)
              this.result = this._genResult(res.data, newSongs)
              console.log('this result', this.result)
         })
      })
    },
    _genResult (data, songs) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{type: TYPE_SINGER} })
      }
      ret = ret.concat(songs)
      return ret
    },
    _normalizeSons (list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      console.log('ret', ret)
      return ret
    },
    hasMore () {
      let isMore = perpage * 20 > this.total
      return isMore
    },
    searchMore () {
      // if (this.hasMore()) {
      //   return
      // }
      console.log('scroll to end now')
      this.page++
      search(this.query, this.page, this.showSinger, perpage)
        .then(res => {
          // this.result = this.result.concat(this._genResult(res.data))
          // this.total = res.data.song.totalnum
          var newSongs = []
          processSongsUrl(this._normalizeSons(res.data.song.list))
            .then(songs => {
              newSongs = songs
              console.log('newSongs', newSongs)
              this.result = this.result.concat(this._genResult(res.data, newSongs))
              console.log('this result', this.result)
          })
        })
    },
    bindIncoClass (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    displayText (item) {
      if (item.type === TYPE_SINGER) {
        return `${item.singername}`
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    selectItem (item) {
      if (item.type) {
        this.$router.push({
          path: `/singer/${item.singermid}`
        })
        this.setSinger(new Singer({
          id: item.singermid,
          name: item.singername
        }))
      } else {
        this.insertSong(item)
      }
      this.$emit('select', this.query)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
