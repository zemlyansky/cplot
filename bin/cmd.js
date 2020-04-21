#!/usr/bin/env node
const plot = require('../')
const fs = require('fs')
const path = require('path')
const parse = require('csv-parse/lib/sync')
const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    title: 't',
    width: 'w',
    height: 'h',
    kind: 'k',
    marker: 'm',
    color: 'c',
    bins: 'b'
  },
  default: {
    kind: 'default',
    bins: 80
  }
})

// Read
let input
if (argv._.length === 1) {
  const inputFile = argv._[0]
  if (path.extname(inputFile) === 'svg') {
    throw new Error('Can\'t creat a plot from SVG')
  }
  input = fs.readFileSync(inputFile, 'utf8')
} else {
  input = fs.readFileSync(0, 'utf-8')
}

// Plot
let output
try {
  // console.log('JSON?')
  output = plot(JSON.parse(input))
} catch {
  if (input.includes('plot') || input.includes('bar') || input.includes('scatter')) {
    // console.log('Probably MD!')
    output = plot(input)
  } else {
    // console.log('Try CSV!')
    const records = parse(input, { skip_empty_lines: true })
    if (records.length) {
      const head = records[0]
      let columns
      if (isNaN(head[0])) {
        columns = records.shift()
      }
      if (head.length === 1) {
        const param = {
          title: argv.title || argv._[0] || '',
          xAxis: { label: 'Index' },
          yAxis: { label: columns[0] || 'Value' },
          width: parseInt(argv.width) || 850,
          height: parseInt(argv.height) || 500
        }
        param[argv.kind === 'default' ? 'plot' : argv.kind] = {
          color: argv.color || '#252FBB',
          marker: argv.marker || 'o',
          bins: argv.bins || undefined,
          x: records.map((_, i) => i),
          y: records.map(row => row[0])
        }
        output = plot(param)
      } else if (((argv.kind === 'scatter') || (argv.kind === 'default')) && (head.length === 2)) {
        output = plot({
          title: argv.title || argv._[0] || '',
          xAxis: { label: columns[0] || 'X' },
          yAxis: { label: columns[1] || 'Y' },
          scatter: {
            color: argv.color || '#252FBB',
            marker: argv.marker || 'o',
            ls: 'none',
            lw: 0,
            x: records.map(row => row[0]),
            y: records.map(row => row[1])
          },
          width: parseInt(argv.width) || 700,
          height: parseInt(argv.height) || 650
        })
      } else {
        // Multiple plots
        const pallete = ['#001242', '#ee6352', '#59cd90', '#fac05e', '#0094c6', '#c14e43', '#779053', '#005e7c', '#1c272d', '#000022']
        const param = {
          title: argv.title || argv._[0] || '',
          xAxis: { label: 'Index' },
          yAxis: { label: 'Value' },
          width: parseInt(argv.width) || 8500,
          height: parseInt(argv.height) || 500
        }
        const key = (argv.kind === 'default') ? 'plot' + 's' : argv.kind + 's'
        param[key] = head.map((h, hi) => {
          return {
            color: argv.color && argv.color.length ? argv.color[hi] : pallete[hi],
            marker: argv.marker || 'o',
            bins: argv.bins || undefined,
            x: records.map((_, i) => i),
            y: records.map(row => row[hi])
          }
        })
        output = plot(param)
      }
    } else {
      throw new Error('No records')
    }
  }
}

// Write
if (argv.o && argv.o.length) {
  fs.writeFileSync(argv.o, output)
} else {
  process.stdout.write(output)
}
