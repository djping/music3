import originJSONP from 'jsonp'

export default function jsonp (url, data, option) {
  let c = (url.indexOf('?') < 0) ? '?' : '&'
  url += c + param(data)
  // why below statement wrong?
  // url += (url.indexOf('?') < 0) ? '?' : '&' + param(data)
  // console.log('test data', param(data))
  // console.log('test singer', url + param(data))
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param (data) {
  let url = ''
  for (var k in data) {
    let value = (data[k] !== undefined) ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
