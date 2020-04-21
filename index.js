const Module = require('./wasm/native.js')
const bin = require('./wrapper/native.bin.js')
const { stringify, histogram } = require('./src/util.js')
const m = Module({ wasmBinary: bin.data })

const _charter = m.cwrap('charter', 'string', ['string'])

module.exports = function cplot (input, y) {
  if (typeof input === 'string') {
    if (input.search('plot') >= 0 || input.search('bar') >= 0 || input.search('scatter') >= 0) {
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
        color: '#252FBB',
        marker: 'o',
        ls: y ? 'none' : '-',
        x: y ? input : input.map((_, i) => i),
        y: y || input
      }
    }
    return _charter(stringify(newInput))
  } else if (typeof input === 'object') {
    Object.keys(input).forEach(key => {
      if (key === 'hist' || key === 'dist') {
        input[key === 'hist' ? 'bar' : 'plot'] = histogram(input[key])
        delete input[key]
      } else if (key === 'hists' || key === 'dists') {
        input[key === 'hists' ? 'bars' : 'plots'] = input[key].map(obj => histogram(obj))
        delete input[key]
      }
    })
    return _charter(stringify(input))
  } else {
    throw new Error('Unknow input type')
  }
}
