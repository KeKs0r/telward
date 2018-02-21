const init = require('./init')
const _ = require('lodash')
const jsonfile = require('jsonfile')
const { completeHistory } = require('./chat-history')

async function run() {
  const telegram = await init()
  const dialogs = await telegram('messages.getDialogs', {
    limit: 50
  })
  const { chats } = dialogs
  const chat = _.find(chats, c => c.id === 1319954026)
  const msgs = await completeHistory(telegram, chat, 400)
  save('pump-crypto-pushers', msgs)
}

function save(name, data) {
  const now = new Date()
  const fileName = `${now}_${name}.json`
  const path = __dirname + '/data/' + fileName
  jsonfile.writeFile(path, data, function(err) {
    if (err) {
      console.error(err) // eslint-disable-line no-console
    }
    console.log('File Stored')
  })
}

run()
