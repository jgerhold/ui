const path = require('path')

const { output, resolve, devServer, rules, plugins } = require('@podlove/build')
const {
  IS_IN_DOCKER = 0,
  WEBPLAYER_DEV_DOMAIN = 'localhost',
  WEBPLAYER_DEV_PORT = 9000
} = process.env

const version = require('../package').version
const playerAssets = path.resolve('./node_modules/@podlove/player/dist')

const BASE = `${version}/`

module.exports = {
  mode: 'development',

  entry: {
    embed: './src/embed.js',
    share: './src/share.js',
    'extensions/external-events': './src/extensions/external-events.js'
  },
  output: output(),

  resolve: resolve({
    '@podlove/player': playerAssets
  }),

  devtool: 'inline-source-map',
  devServer: devServer({
    port: WEBPLAYER_DEV_PORT,
    contentBase: './dist',
    publicUrl: IS_IN_DOCKER ? `${WEBPLAYER_DEV_DOMAIN}:80` : `localhost:${WEBPLAYER_DEV_PORT}`
  }),

  module: {
    rules: [rules.javascript(), rules.scss(), rules.mustache()]
  },

  plugins: [
    plugins.hmr(),
    plugins.html({
      filename: 'index.html',
      template: './example/example.html',
      exclude: ['share'],
      base: IS_IN_DOCKER ? `${WEBPLAYER_DEV_DOMAIN}:80` : `localhost:${WEBPLAYER_DEV_PORT}`
    }),
    plugins.html({
      files: {
        styles: ['styles'],
        scripts: ['vendor', 'styles', 'runtime', 'player']
      },
      filename: 'share.html',
      template: '!!mustache-loader!./src/lib/share.mustache',
      exclude: ['embed', 'extensions/external-events'],
      base: `${
        IS_IN_DOCKER
          ? `http://${WEBPLAYER_DEV_DOMAIN}:80`
          : `http://localhost:${WEBPLAYER_DEV_PORT}`
      }/${BASE}`
    }),
    plugins.env({
      MODE: 'development',
      BASE,
      SCRIPTS: ['vendor', 'styles', 'runtime', 'player'],
      STYLES: ['styles']
    }),
    plugins.copy([
      {
        from: `./node_modules/@podlove/player/dist`,
        to: BASE
      },
      {
        from: './example/example.json'
      },
      {
        from: './example/transcripts.json'
      },
      {
        from: './example/chapters.json'
      },
      {
        from: './example/example.m4a'
      },
      {
        from: './example/example.jpg'
      }
    ])
  ]
}
