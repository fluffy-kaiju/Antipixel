export const useAPI = createUseFetch((callerOptions) => {
  const token = useCookie<string | undefined>('auth_token')

  return {
    // TODO: get from env
    baseURL: 'http://localhost:3000',
    onRequest({ options }) {
      if (token?.value) {
        options.headers.set('Authorization', `Bearer ${token.value}`)
      }
    },
  }
})
