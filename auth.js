const { inputField } = require('./input')
const config = require('./config')


const APP_TYPE_CODE = 'auth.sentCodeTypeApp'

const _sendCode = async (telegram, retry = 0) => {
  console.log('Sent code to: ', config.phone_number)
  const phone = config.phone_number
  let sendCode = await telegram('auth.sendCode', {
    phone_number: phone,
    sms_type: 0,
    api_id: config.api_id,
    api_hash: config.api_hash
  })
  return sendCode
  // const { phone_code_hash } = sendCode
  // console.log('sendCode type', sendCode.type._)
  // if (sendCode.type._ === APP_TYPE_CODE && retry < 2) {
  //   console.log('Retrying')
  //   return _sendCode(telegram, rety + 1)
  // }
  // console.log('APP Code', sendCode)
  // return sendCode
}

const logout = async (telegram) => {
  const result = await telegram('auth.logOut')
  return result
}

const login = async (telegram) => {
  // const phone = await inputField('phone')

  const { phone_code_hash } = await _sendCode(telegram)

  const code = await inputField('code')

  const res = await telegram('auth.signIn', {
    phone_number: config.phone_number,
    phone_code_hash,
    phone_code: code
  })
  const { user } = res
  return user
}

const register = async (telegram) => {
  const phone = config.phone_number
  const { phone_code_hash } = await telegram('auth.sendCode', {
    phone_number: phone,
    current_number: false,
    api_id: config.api_id,
    api_hash: config.api_hash
  })
  const code = await inputField('code')
  const res = await telegram('auth.signUp', {
    phone_number: phone,
    phone_code_hash,
    phone_code: code,
    first_name: 'First',
    last_name: 'Last'
  })

  console.log('signUp', res)
  return res
}

module.exports = {
  login,
  register,
  logout
}