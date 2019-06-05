// shuffle: get random playlist

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
// map list, switch list[i] and list[j]
export function shuffle (list) {
  let newList = list.slice()
  for (let i = 0; i < newList.length; i++) {
    let j = getRandomInt(0, i)
    let t = newList[j]
    newList[j] = newList[i]
    newList[i] = t
  }
  return newList
}

export function debounce (func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
