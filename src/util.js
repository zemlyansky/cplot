const hist = require('histogramjs')

function stringify (obj, p = 0) {
  const pad = new Array(p + 1).join(' ')
  let result = ''
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] !== 'undefined') {
      const val = obj[key]
      let str = pad + key.replace('A', '-a') + ': ' // yAxis -> y_axis
      if (['plots', 'bars', 'scatters'].includes(key)) {
        str = ''
        val.forEach(plot => {
          str += pad + key.slice(0, -1) + ': \n'
          str += stringify(plot, p + 2)
        })
      } else if (Array.isArray(val)) {
        str += val.join(' ') + '\n'
      } else if (typeof val === 'object') {
        str += '\n' + stringify(val, p + 2)
      } else {
        str += val + '\n'
      }
      result += str
    }
  })
  return result
}

function linspace (a, b, n) {
  let i
  const ret = Array(n)
  n--
  for (i = n; i >= 0; i--) {
    ret[i] = (i * b + (n - i) * a) / n
  }
  return ret
}

function histogram (data) {
  const h = hist({
    data: data.y,
    bins: linspace(Math.min.apply(Math, data.y), Math.max.apply(Math, data.y), data.bins || 80)
  })
  data.y = h.map(_ => _.y)
  data.x = h.map(_ => _.x)
  return data
}

module.exports = { stringify, histogram }
