const { MTProto } = require('telegram-mtproto')
const myStore = require('./storage')
const config = require('./config')

const api = {
  invokeWithLayer: 0xda9b0d0d,
  layer: 57,
  initConnection: 0x69796de9,
  api_id: config.api_id,
  app_version: '1.0.1',
  lang_code: 'en'
}

const server = { webogram: true, dev: false }

async function init() {
  const storage = await myStore()
  const telegram = MTProto({
    api,
    server,
    app: {
      storage
    }
  })
  return telegram
}

module.exports = init