exports.getAccessToken = async () => {
  return ((window as any).config || {}).accessToken;
}
