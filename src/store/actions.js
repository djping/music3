import * as types from './mutation-types'
import { shuffle } from 'common/js/util'
import { playMode } from 'common/js/config'
import {
  saveSearch,
  deleteOneSearch,
  clearSearch
} from 'common/js/cache'
// import { type } from 'os';
// import { deleteOneSearch } from 'common/js/cache'

function findSongIndex (list, song) {
  let index = list.findIndex(item => {
    return item.id === song.id
  })
  return index
}
export const selectPlay = ({ commit, state }, { list, index }) => {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findSongIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = ({ commit }, { list }) => {
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAY_MODE, playMode.random)
}

export const insertSong = ({ commit, state }, song) => {
  let playlist = state.playlist.slice()
  let currentIndex = state.currentIndex
  // let sequenceList = state.sequenceList.slice()
  let fsIndex = findSongIndex(playlist, song)
  if (fsIndex < 0) {
    playlist.splice(0, 0, song)
  } else {
    // playlist.
    currentIndex = fsIndex
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, playlist)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const storageHistory = ({ commit }, query) => {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearch = ({ commit }, query) => {
  commit(types.SET_SEARCH_HISTORY, deleteOneSearch(query))
}

export const clearAllSearch = ({ commit }) => {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}