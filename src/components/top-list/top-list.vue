<template>
  <div class="top-list">
    <MusicList 
      :songs="songs"
      :title="title"
      :bgImg="bgImg"
      :rank="rank"
    >
    </MusicList>
  </div>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song' 
import { processSongsUrl } from 'common/js/song'

export default {
  data () {
    return {
      songs: [],
      rank: true
    }
  },
  components: {
    MusicList
  },
  computed: {
    bgImg () {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return this.topList.picUrl
    },
    title () {
      return this.topList.topTitle
    },
    ...mapGetters([
      'topList'
    ])
  },
  created () {
    if (!this.topList.id) {
      this.$router.push('/rank')
    }
    this._getMusicList()
    console.log('this is selected topList', this.topList)
  },
  methods: {
    _getMusicList () {
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          console.log('toplist songs', res)
          let fomatList = this._normalizeSong(res.songlist)
          processSongsUrl(fomatList).then(songs => {
            this.songs = songs
          })
        }
      })
    },
    _normalizeSong (list) {
      let ret = []
      list.forEach(item => {
        let musicData = item.data
        // songid and albumid
        ret.push(createSong(musicData))
      })
      return ret
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
