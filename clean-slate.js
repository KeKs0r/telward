const { MTProto } = require('telegram-mtproto')

const phone = {
  num: '+4917662451963',
  code: '22222'
}

const api = {
  layer: 57,
  initConnection: 0x69796de9,
  api_id: 187517
}

const server = {
  dev: true //We will connect to the test server.
}           //Any empty configurations fields can just not be specified

const client = MTProto({ server, api })

async function connect() {
  const { phone_code_hash } = await client('auth.sendCode', {
    phone_number: phone.num,
    current_number: false,
    api_id: 187517,
    api_hash: 'f7f120c2491d3fbc7f831556fdcdda6e'
  })
  const { user } = await client('auth.signIn', {
    phone_number: phone.num,
    phone_code_hash,
    phone_code: phone.code
  })

  console.log('signed as ', user)
}

connect()