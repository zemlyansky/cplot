const tape = require('tape')

var plot = require('.')

// COLOR IS NEEDED! OR SVG ERROR;
const svg = plot(`
title qweasd
x-axis:
  label: Cost
  mode: log
y-axis:
  label Error
plot:
  color: #444
  marker: s
  x: 2 3 4 5 6 7 8 9
  y: -2.8559703 -3.5301677 -4.3050655 -5.1413136 -6.0322865 -6.9675052 -7.9377747
  label: qasdad
`)

console.log(svg)
