module.exports = ({ contentBase = 'dist/', port = 8080, publicUrl = 'localhost:9000' }) => ({
  historyApiFallback: true,
  noInfo: true,
  overlay: true,
  inline: true,
  hot: true,
  disableHostCheck: true,
  host: '0.0.0.0',
  contentBase,
  port,
  public: publicUrl
})
