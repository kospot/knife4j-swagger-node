const path = require('path')

const staticPath = path.join(__dirname, 'swagger-static')

module.exports = {
  staticPath,
  install(app, staticFileFunction) {
    console.log('swagger ui static', __dirname + '/swagger-static')
    app.use(staticFileFunction(__dirname + '/swagger-static'))
  },
}