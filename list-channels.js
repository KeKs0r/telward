const init = require('./init')
const _ = require('lodash')
const jsonfile = require('jsonfile')
const { completeHistory } = require('./chat-history')
const { login, logout } = require('./auth')

async function run() {
  try {
    const telegram = await init()
    //const out = await logout(telegram)
    //    console.log('logout', out)
    //const user = await login(telegram)
    const dialogs = await telegram('messages.getDialogs', {
      limit: 150
    })
    const { chats } = dialogs
    _.forEach(chats, c => {
      console.log(c._, c.title, c.id)
    })
  } catch (e) {
    console.error(e)
  }
}

run()
