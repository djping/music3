import storage from 'good-storage'
// import { SERVFAIL } from 'dns';

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

function insertArray (arr, val, compare) {
  let index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (arr.length > SEARCH_MAX_LEN) {
    arr.pop()
  }
  return arr
}

export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

 function deleteArray (arr, compare) {
   let index = arr.findIndex(compare)
   arr.splice(index, 1)
   return arr
 }
export function deleteOneSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch () {
  let arr = []
  storage.remove(SEARCH_KEY)
  return arr
}