exports.getAccessToken = async () => {
  return localStorage.getItem('apiToken');
}
