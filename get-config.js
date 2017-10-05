async function getConfig(telegram) {
  const config = await telegram('help.getConfig')
  return config
}

module.exports = getConfig