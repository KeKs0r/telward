var dirty = require('dirty');
var db = dirty('user.db');
const async = require('async')
const Promise = require('bluebird')

let initialized

const storage = async () => {
  const result = await new Promise((resolve, reject) => {
    if (initialized) {
      resolve(initialized)
    }
    db.on('load', function () {
      const storage = {
        get: (key) => {
          return new Promise.resolve(db.get(key))
        },
        set: (key, value) => {
          return new Promise((resolve, reject) => {
            db.set(key, value, (err, res) => {
              if (err) return reject(err)
              return resolve(res)
            })
          })
        },
        remove: (...keys) => {
          return Promise.all(keys.map((k) => {
            return new Promise((resolve, reject) => {
              db.rm(k, (err, res) => {
                if (err) return reject(err)
                return resolve(res)
              })
            })
          }))
        },
        clear: () => {
          return new Promise((resolve, reject) => {
            let keys = []
            db.forEach((key, val) => {
              keys.push(key)
            })
            async.forEach(keys, (key, next) => {
              db.rm(key, next)
            }, (err, res) => {
              if (err) return reject(err)
              resolve(res)
            })
          })
        }
      }
      initialized = storage
      resolve(storage)
    });
  })
  return result
}


module.exports = storage