// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  debug: true,

  devServer: {
      port: 8080,
  },

  modules: ['@nuxt/image']
})
