<template>
  <transition name="slider">
    <Musiclist :title="title" :bg-img="avatar" :songs="songs">
    </Musiclist>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import Musiclist from 'components/music-list/music-list'
export default {
  data () {
    return {
      songs: []
    }
  },
  components: {
    Musiclist
  },
  computed: {
    // get getters.js singer--use this.singer to use
    ...mapGetters(['singer']),
    title () {
      return this.singer.name
    },
    avatar () {
      return this.singer.avatar
    }
  },
  created () {
    console.log('single singer data', this.singer)
    this._getSingerDetail(this.singer.id)
  },
  methods: {
    _getSingerDetail (singerId) {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(singerId).then(res => {
        // singer ID -- > get song's list
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
              this.songs = songs
          })
          // this.songs = this._normalizeSong(res.data.list)
          // console.log(res.data.list)
          // console.log('this.songs', this.songs)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        let { musicData } = item
        if (isValidMusic(musicData)) {
          let song = createSong(musicData)
          ret.push(song)
        }
      })
      return ret
    }
  }
}
</script>

<style scoped lang="stylus">
  .slider-enter-active, .slider-leave-active
    transition: all 1.5s
  .slider-enter-to, .slider-leave-to
    transform: translate3d(100%, 0, 0)
</style>
