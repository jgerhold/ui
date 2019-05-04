const { output, resolve, devServer, rules, plugins } = require('@podlove/build')

const {
  IS_IN_DOCKER = 0,
  PLAYER_DEV_PORT = 9000,
  PLAYER_JARVIS_PORT = 1337,
  PLAYER_DEV_DOMAIN = 'localhost'
} = process.env

module.exports = {
  mode: 'development',

  entry: {
    example: './example/example.js',
    bootstrap: './bootstrap.js'
  },
  output: output(),

  resolve: resolve({
    styles: './src/styles',
    store: './src/store',
    directives: './src/directives'
  }),

  devtool: 'inline-source-map',
  devServer: devServer({
    port: PLAYER_DEV_PORT,
    contentBase: './dist',
    publicUrl: IS_IN_DOCKER ? `${PLAYER_DEV_DOMAIN}:80` : `localhost:${PLAYER_DEV_PORT}`
  }),

  module: {
    rules: [
      rules.vue(),
      rules.javascript(),
      rules.images(),
      rules.vueStyles({ prod: false }),
      rules.pug()
    ]
  },

  plugins: [
    plugins.vue(),
    plugins.base('.'),
    plugins.jarvis({ port: PLAYER_JARVIS_PORT, host: IS_IN_DOCKER ? '0.0.0.0' : 'localhost' }),
    plugins.bundleAnalyzer(),
    plugins.hmr(),
    plugins.html({
      filename: 'index.html',
      template: './example/index.html'
    }),
    plugins.html({
      filename: 'test.html',
      template: './example/index.html',
      chunks: ['bootstrap']
    }),
    plugins.copy([
      { from: './example/assets', to: 'assets' }
    ]),
    plugins.env({ mode: 'development' })
  ]
}
