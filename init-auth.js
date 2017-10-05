const { login, register, logout } = require('./auth');
const myStorage = require('./storage')




async function boot() {
  try {
    const telegram = await init()
    // const out = await logout(telegram)
    // console.log('logout', out)
    const user = await login(telegram)
    console.log('user', user)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

boot()



