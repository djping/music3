<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" 
        @query="onQueryChange"
      >
      </search-box>
    </div>
    <div class="shortcut-wrapper">
      <div class="shortcut">
        <div class="hot-key" v-show="!query">
          <ul>
            <h1 class="title">热门搜索</h1>
            <li v-for="(key, index) in hotkey" 
              :key="index" class="item"
              @click="setQuery(key.k)"
            >
              <span>{{key.k}}</span>
            </li>
          </ul>
       </div>
       <div class="search-history" 
         v-show="searchHistory.length && !query"
       >
         <div class="title">
           <h1 class="text">搜索历史</h1>
           <div class="clear" @click="clearSearch">
             <i class="icon-clear"></i>
           </div>
         </div>
         <search-list 
          :searches="searchHistory"
          @select="setQuery"
          @delete="deleteSearch"
         >
        </search-list>
       </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <Suggest :query="query" @select="setHistory"></Suggest>
    </div>
    <div>
      <!-- <Confirm @clear="chooseCancle" :show="show"></Confirm> -->
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import { mapActions, mapGetters } from 'vuex'
import Confirm from 'base/confirm/confirm'
export default {
  data () {
    return {
      hotkey: [],
      query: null,
      show: false
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm
  },
  created () {
    this._getHotKey()
  },
  methods: {
    _getHotKey () {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          console.log('getHotKey', res)
          this.hotkey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    setQuery (key) {
      this.$refs.searchBox.addQuery(key)
    },
    onQueryChange (query) {
      this.query = query
    },
    setHistory (item) {
      this.storageHistory(item)
    },
    chooseCancle () {
      console.log('clear search')
      this.clearAllSearch()
    },
    clearSearch () {
      this.show = true
    },
    ...mapActions([
      'storageHistory',
      'deleteSearch',
      'clearAllSearch'
    ])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
