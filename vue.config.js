module.exports = {
  lintOnSave: 'warning',

  filenameHashing: false,

  publicPath: process.env.NODE_ENV === 'production'
    ? '/twodots/'
    : '/',

  configureWebpack: {
    resolve: {
      modules: [
        'node_modules',
        'src'
      ]
    }
  }
}
