const tape = require('tape')
const isSVG = require('is-svg')
const cplot = require('.')
// const { stringify } = require('./src/util')

const txt = `
title: Test plot
x-axis:
  label: Cost
  mode: log
y-axis:
  label Error
plot:
  color: red
  marker: s
  x: 2 3 4 5 6 7 8 9
  y: -2.8559703 -3.5301677 -4.3050655 -5.1413136 -6.0322865 -6.9675052 -7.9377747
`

const obj = {
  title: 'Test plot',
  xAxis: {
    label: 'Cost',
    mode: 'log'
  },
  yAxis: {
    label: 'Error'
  },
  plot: {
    color: 'red',
    marker: 's',
    x: [2, 3, 4, 5, 6, 7, 8, 9],
    y: [-2.8559703, -3.5301677, -4.3050655, -5.1413136, -6.0322865, -6.9675052, -7.9377747]
  }
}

tape('Stringify test', function (t) {
  t.plan(1)
  t.equal(cplot(txt), cplot(obj))
})

tape('Cplot returns SVG', function (t) {
  t.plan(1)
  t.true(isSVG(cplot(obj)))
})

tape('Cplot with array inputs', function (t) {
  t.plan(1)
  t.true(isSVG(cplot([1, 2, 3, 4])))
})
