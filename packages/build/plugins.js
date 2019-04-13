const webpack = require('webpack')

const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const WebpackAutoInject = require('webpack-auto-inject-version')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Jarvis = require('webpack-jarvis')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CopyPlugin = require('copy-webpack-plugin')

const { prepend } = require('./utils')

const vue = () => new VueLoaderPlugin()

const css = ({ filename = '[name].css', prefix = '' } = {}) =>
  new MiniCssExtractPlugin({
    filename: prepend(filename, prefix)
  })

const minifyCss = () => new OptimizeCSSAssetsPlugin({})

const version = () => new WebpackAutoInject({ SILENT: true })

const base = base =>
  new webpack.DefinePlugin({
    BASE: JSON.stringify(base)
  })

const html = ({ filename, template, chunks, exclude, base, files }) =>
  new HtmlWebpackPlugin({
    filename,
    template,
    chunksSortMode: 'none',
    chunks,
    base,
    files,
    excludeChunks: exclude
  })

const jarvis = ({ port = 1337, host = 'localhost' }) => new Jarvis({ port, host })

const bundleAnalyzer = () =>
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false
  })

const hmr = () => new webpack.HotModuleReplacementPlugin()

const env = (data = {}) =>
  new webpack.DefinePlugin(
    Object.keys(data).reduce(
      (result, key) =>
        Object.assign({}, result, {
          [key]: JSON.stringify(data[key])
        }),
      {}
    )
  )

const copy = (patterns = []) => new CopyPlugin(patterns)

module.exports = {
  vue,
  css,
  minifyCss,
  version,
  base,
  html,
  jarvis,
  bundleAnalyzer,
  hmr,
  env,
  copy
}
