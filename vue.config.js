module.exports = {
  lintOnSave: 'warning',

  configureWebpack: {
    resolve: {
      modules: [
        'node_modules',
        'src'
      ]
    }
  }
}
