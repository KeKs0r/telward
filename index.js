
const init = require('./init');
const { login, register, logout } = require('./auth');
const getConfig = require('./get-config')
const { getChat, getNewMessages, forwardMessages } = require('./chat-history')
const myStorage = require('./storage')


async function wait(timeout = 3000) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}




async function boot() {
  try {
    const telegram = await init()
    // const out = await logout(telegram)
    // console.log('logout', out)
    // const user = await login(telegram)
    // console.log('user', user)

    const source = await getChat(telegram, 'source')
    console.log('Source Chat:', source.title)
    const destination = await getChat(telegram, 'destination')
    console.log('Destination Chat:', source.title)
    run(telegram, source, destination)
  } catch (e) {
    process.exit(1)
  }
}

async function run(telegram, source, destination) {
  try {
    do {
      await forwardNew(telegram, source, destination)
      await wait()
    } while (true)
  } catch (e) {
    console.error(e)
    await wait()
  }
}


async function forwardNew(telegram, source, destination) {
  const storage = await myStorage()
  const messages = await getNewMessages(telegram, source)
  if (messages.length === 0) {
    return
  }
  await forwardMessages(telegram, messages, destination)
  storage.set('messages:last', messages[0].id)
}


boot()



