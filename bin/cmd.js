#!/usr/bin/env node
const plot = require('../')
const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const path = require('path')

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
  output = plot(JSON.parse(input))
} catch {
  output = plot(input)
}

// Write
if (argv.o && argv.o.length) {
  fs.writeFileSync(argv.o, output)
} else {
  process.stdout.write(output)
}
