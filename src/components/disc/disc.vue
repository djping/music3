<template>
  <div class="disc">
    <MusicList :title="disc.dissname" 
      :bgImg="disc.imgurl"
      :songs="discSong"
    >
    </MusicList>
  </div>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { getSongList } from 'api/recommend'
import { mapGetters } from 'vuex'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'

export default {
  data () {
    return {
      discSong: []
    }
  },
  props: {
    title: {
      type: String,
      default: null
    },
    bgImg: {
      type: String,
      default: null
    }
  },
  components: {
    MusicList
  },
  created () {
   this. _getSongList()
  },
  methods: {
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
      }
      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          // this.discSong = res.data.list
          let formatSongs = this._normallizeSong(res.cdlist[0].songlist)
          processSongsUrl(formatSongs).then(songs => {
            this.discSong = songs
          })
          console.log(res.cdlist[0].songlist)
        }
      })
    },
    _normallizeSong (list) {
      let ret = []
      list.forEach((musicData) => {
        ret.push(createSong(musicData))
      })
      return ret
    }
  },
  computed: {
    ...mapGetters([
      'disc'
    ])
  }
}
</script>

<style scoped lang="stylus">
  .disc
    color red
    z-index 10000
</style>
