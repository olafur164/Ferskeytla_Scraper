const _ = require('underscore')
const redis = require('./borgun')


const xRay = require('x-ray');
const x = xRay({
filters: {
  trim: function (value) {
    const val = value.replace(/\r/g," ").replace(/\n/g," ").replace(/\t/g," ")
    return typeof value === "string" ? val.trim() : value
  },
  slice: function (value, start , end) {
      return typeof value === 'string' ? value.slice(start, end) : value
    }
}
}).driver(request('Windows-1252'));

const get = callback => {
  redis.get((err, storedResult) => {
    if (!err && storedResult) {
      callback(null, storedResult)
    } else {
      try {

        borgun.get((error, results) => {
          if (error) {
            callback(error)
          } else {
            redis.set(results)
            callback(null, results)
          }
        })
      } catch (exc) {
        callback(exc)
      }
    }
  })
}