const _ = require('lodash')
const { inputField } = require('./input')
const myStorage = require('./storage')



const getChat = async (telegram, tag) => {
  const dialogs = await telegram('messages.getDialogs', {
    limit: 50,
  })
  const { chats } = dialogs
  const selectedChat = await selectChat(chats, tag)

  return selectedChat
}

const chatHistory = async (telegram, chat, until) => {
  const max = 10
  const limit = 10
  let offset = 0
  let full = [],
    messages = []
  let oldest
  do {
    const history = await telegram('messages.getHistory', {
      peer: {
        _: 'inputPeerChat',
        chat_id: chat.id
      },
      max_id: offset,
      offset: -full.length,
      limit
    })
    messages = history.messages.filter(filterLastDay)
    full = full.concat(messages)
    messages.length > 0 && (offset = messages[0].id)
    oldest = _.get(_.last(messages), 'id')
    console.log('Offset', offset, 'oldest', oldest)
  } while (messages.length === limit && (!until || oldest < until))
  if (until) {
    full = full.filter(_ => _.id > until)
  }
  printMessages(full)
  return full
}


const getNewMessages = async (telegram, chat) => {
  const storage = await myStorage()
  const lastMessage = await storage.get('messages:last')
  const newMessages = await chatHistory(telegram, chat, lastMessage)
  return newMessages
}

const forwardMessages = async (telegram, messages, destination) => {
  try {
    const reversed = _.reverse(messages)
    const id = _.map(reversed, 'id')
    const forward = await telegram('messages.forwardMessages', {
      to_peer: {
        _: 'inputPeerChat',
        chat_id: destination.id
      },
      id,
      random_id: id
    })
  } catch (e) {
    throw e
  }
}






const filterLastDay = ({ date }) => new Date(date * 1e3) > dayRange()

const dayRange = () => Date.now() - new Date(86400000 * 4)

const selectChat = async (chats, tag) => {
  const storage = await myStorage()
  const chat = await storage.get(`chat:${tag}`)
  if (chat) {
    return chat
  }
  const chatNames = _.map(chats, 'title')
  console.log('Your chat list')
  chatNames.map((name, id) => console.log(`${id}  ${name}`))
  console.log('Select chat by index')
  const chatIndex = await inputField('index')
  selectedChat = chats[+chatIndex]
  storage.set(`chat:${tag}`, selectedChat)
  return selectedChat
}

const filterUsersMessages = ({ _ }) => _ === 'message'

const formatMessage = ({ id, message, date, from_id }) => {
  const dt = new Date(date * 1e3)
  const hours = dt.getHours()
  const mins = dt.getMinutes()
  return `${hours}:${mins} ${message} (${id})`
}

const printMessages = messages => {
  const filteredMsg = messages.filter(filterUsersMessages)
  const formatted = filteredMsg.map(formatMessage)
  formatted.forEach(e => console.log(e))
  return formatted
}


const searchUsers = async (username) => {
  const results = await telegram('contacts.search', {
    q: username,
    limit: 100,
  })
  return results
}

module.exports = {
  getChat,
  chatHistory,
  searchUsers,
  getNewMessages,
  forwardMessages
}