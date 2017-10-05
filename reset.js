const myStorage = require('./storage')
const reset = async () => {
  const storage = await myStorage()
  await storage.remove('messages:last')
  await storage.remove('chat:source')
  await storage.remove('chat:destination')
}

reset()