const fs = require('fs')
const apidoc = require('apidoc-core')
const winston = require('winston')
const merge = require('lodash/merge')

const apidoc_to_swagger = require('./apidoc_to_swagger')

apidoc.setGeneratorInfos({ name: 'name', time: new Date(), version: '0.0.1', url: 'xxx url' })


function generateLog(options) {
    return winston.createLogger({
        transports: [
            new (winston.transports.Console)({
                level: options.verbose ? 'verbose' : 'info',
                silent: false,
                prettyPrint: true,
                colorize: options.color,
                timestamp: false
            }),
        ]
    })
}

function main(options) {
    options.verbose && console.log('options', options)
    const log = generateLog(options)
    const { src, dest, verbose, apiDocJSON, apiConfigJs } = options
    apidoc.setLogger(log)

    var api = apidoc.parse({ ...options, log: log })

    var apidocData = JSON.parse(api.data)
    var projectData = JSON.parse(api.project)

    var apidocJson = {}
    if (fs.existsSync(apiDocJSON)) {
        try {
            apidocJson = JSON.parse(fs.readFileSync(apiDocJSON, 'utf8'))
        } catch (error) {
            log.error(filename, '格式不正确')
            log.error(error)
        }
    } else if (fs.existsSync(apiConfigJs)) {
        try {
            apidocJson = require(apiConfigJs)
        } catch (error) {
            log.error(error)
        }
    }

    // Replicate underscoreToSpace handlebar filter from https://github.com/apidoc/apidoc/blob/0.50.5/template/src/hb_helpers.js#L93
    for (let article of apidocData) {
        if (article.name)
            article.name = article.name.replace(/(_+)/g, ' ')
    }

    const curJSON = apidoc_to_swagger.toSwagger(apidocData, projectData)
    const swagger = merge(curJSON, apidocJson)

    api["swaggerData"] = JSON.stringify(swagger)
    api["swaggerJSON"] = swagger

    return api
}

function createOutputFile(swaggerData, log, options) {
    if (options.simulate)
        log.warn('!!! Simulation !!! No file or dir will be copied or created.')

    log.verbose('create dir: ' + options.dest)
    if (!options.simulate)
        fs.existsSync(options.dest) || fs.mkdirSync(options.dest)

    //Write swagger
    log.info('write swagger json file: ' + options.dest + 'swagger.json')
    if (!options.simulate)
        fs.writeFileSync(options.dest + './swagger.json', swaggerData)
}

exports.createWithJSON = (options) => {
    const api = main(options)
    const log = generateLog(options)
    createOutputFile(api.swaggerData, log, options)
    return api.swaggerJSON
}
exports.create = main