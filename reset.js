const myStorage = require('./storage')
const reset = async () => {
  const storage = await myStorage()
  storage.set('messages:last', 121885)

}

reset()