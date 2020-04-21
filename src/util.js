function stringify (obj, p = 0) {
  const pad = new Array(p + 1).join(' ')
  let result = ''
  Object.keys(obj).forEach(key => {
    const val = obj[key]
    let str = pad + key.replace('A', '_a') + ': ' // yAxis -> y_axis
    if (key === 'plots') {
      str = ''
      val.forEach(plot => {
        str += pad + 'plot: \n'
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
  })
  return result
}

module.exports = { stringify }
