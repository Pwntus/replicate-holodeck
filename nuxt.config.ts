export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  runtimeConfig: {
    public: {}
  },
  devtools: { enabled: false },
  ssr: false,
  nitro: {
    preset: 'vercel'
  },
  sourcemap: {
    server: false,
    client: false
  },
  app: {
    head: {
      htmlAttrs: {
        class: 'h-full'
      },
      title: 'Replicate Holodeck',
      link: [
        {
          rel: 'canonical',
          href: 'https://replicate-holodeck.vercel.app'
        },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      meta: [
        { hid: 'charset', charset: 'utf-8' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        {
          hid: 'viewport',
          name: 'viewport',
          content:
            'width=device-width,height=device-height,initial-scale=1.0,user-scalable=0,minimum-scale=1.0,maximum-scale=1.0,viewport-fit=cover'
        },
        {
          hid: 'format-detection',
          name: 'format-detection',
          content: 'telephone=no'
        },
        {
          hid: 'description',
          name: 'description',
          content: 'Create your own personalized holodeck.'
        },
        {
          hid: 'og:type',
          name: 'og:type',
          property: 'og:type',
          content: 'website'
        },
        {
          hid: 'og:url',
          name: 'og:url',
          property: 'og:url',
          content: 'https://replicate-holodeck.vercel.app'
        },
        {
          hid: 'og:site_name',
          name: 'og:site_name',
          property: 'og:site_name',
          content: 'replicate-holodeck.vercel.app'
        },
        {
          hid: 'og:title',
          name: 'og:title',
          property: 'og:title',
          content: 'Replicate Holodeck'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          property: 'og:description',
          content: 'Create your own personalized holodeck.'
        },
        {
          hid: 'og:image',
          name: 'og:image',
          property: 'og:image',
          content: 'https://replicate-holodeck.vercel.app/cover.jpg'
        },
        {
          hid: 'msapplication-TileColor',
          name: 'msapplication-TileColor',
          content: '#ffffff'
        },
        { hid: 'theme-color', name: 'theme-color', content: '#ffffff' },
        {
          hid: 'mobile-web-app-capable',
          name: 'mobile-web-app-capable',
          content: 'yes'
        },
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: 'replicate-holodeck.vercel.app'
        }
      ],
      script: [
        /*
        {
          async: true,
          src: `https://www.googletagmanager.com/gtag/js?id=${process.env.GTAG_ID}`
        },
        {
          children: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GTAG_ID}');`
        }
        */
      ],
      bodyAttrs: {
        class: 'antialiased h-full min-h-screen relative'
      }
    }
  },
  modules: ['@nuxt/ui', '@vueuse/nuxt'],
  colorMode: {
    preference: 'light'
  },
  ui: {
    global: true
  }
})
