module.exports = function requireUncached(module){
  try {
    delete require.cache[require.resolve(module)]
    return require(module);
  } catch (e) {
    return require(module);
  }
}