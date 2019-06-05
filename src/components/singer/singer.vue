<template>
  <div class="singer">
    <Listview :data="singers" @select="selectSinger"></Listview>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import Listview from 'base/listview/listview'
import { mapMutations } from 'vuex'

const HOT_NAME = "热门"
const HOT_SINGER_LEN = 10
export default {
  data () {
    return {
      singers: []
    }
  },
  components: {
    Listview
  },
  created () {
    this._getSingerList()
  },
  methods: {
    // 此处要接收！！！！！！！！！！！！！
    selectSinger (singer) {
      this.$router.push({path: `/singer/${singer.id}`})
      console.log(singer)
      this.setSinger(singer)
    },
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          // let singers = res.data.list
          let allSinger = this._normalizeSinger(res.data.list)
          this.singers = allSinger
          console.log('singers ', allSinger)
          // console.log('singer map ', this._normalizeSinger(this.singers))
        }
      }).catch(e => console.log(e))
    },
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map['hot'].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
          }))
        }
        //根据字母分类
        let key = item.Findex
        if(!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
          }))
      })
      //get sorted data strcture 排序
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === "热门") {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style scoped lang="stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
