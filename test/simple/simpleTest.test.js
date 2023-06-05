const path = require('path')
const lib = require('../../lib')


const OPTIONS = {
    src: path.join(__dirname, './input'),
    simulate: true, // does not write any file to disk

    debug: false,
    silent: false,
    verbose: false,
    colorize: true,
    markdown: true,
    apiConfigJs: path.join(__dirname, './apidoc.config.js'),
}

test('simple file should be transformed correctly', () => {
    const generatedSwaggerData = lib.createWithJSON(OPTIONS)
    const expectedSwaggerData = require('./output/swagger.json')
    expect(generatedSwaggerData).toEqual(expectedSwaggerData)
})
