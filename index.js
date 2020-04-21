const Module = require('./wasm/native.js')
const bin = require('./wrapper/native.bin.js')
const { stringify } = require('./src/util.js')
const m = Module({ wasmBinary: bin.data })

const _charter = m.cwrap('charter', 'string', ['string'])

module.exports = function cplot (input, y) {
  if (typeof input === 'string') {
    if (input.search('plot') >= 0 || input.search('title') >= 0) {
      return _charter(input)
    } else {
      return cplot(input.split(' '))
    }
  } else if (Array.isArray(input)) {
    const newInput = {
      xAxis: {
        label: y ? 'X' : 'Index'
      },
      yAxis: {
        label: y ? 'Y' : 'Data'
      },
      plot: {
        color: 'blue',
        x: y ? input : input.map((_, i) => i),
        y: y || input
      }
    }
    return _charter(stringify(newInput))
  }
  return _charter(stringify(input))
}
