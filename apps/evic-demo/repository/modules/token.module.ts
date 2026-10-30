// Compatibility with the original client. Demo identity never uses browser cookies.
class TokenModule {
  getAccessToken = () => 'demo-only'
  saveTokenStorage = (_token: string) => {}
  removeFromStorage = () => {}
}

export default TokenModule
