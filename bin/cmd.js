#!/usr/bin/env node
const plot = require('../')
const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const path = require('path')
const parse = require('csv-parse/lib/sync')

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
  if (input.includes('plot')) {
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
        output = plot({
          title: argv._[0] || '',
          xAxis: { label: 'Index' },
          yAxis: { label: columns[0] || 'Value' },
          plot: {
            color: '#252FBB',
            marker: 'o',
            x: records.map((_, i) => i),
            y: records.map(row => row[0])
          },
          width: 850,
          height: 500
        })
      } else {
        output = plot({
          title: argv._[0] || '',
          xAxis: { label: columns[0] || 'X' },
          yAxis: { label: columns[1] || 'Y' },
          plot: {
            color: '#252FBB',
            marker: 'o',
            ls: 'none',
            x: records.map((_, i) => i),
            y: records.map(row => row[0])
          },
          width: 700,
          height: 650
        })
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
