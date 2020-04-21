#cplot

**Generate SVG plots in the browser and Node.js** 

Most plotting JS libraries rely on the DOM (browser) for rendering. 
That makes a server-side chart rendering harder (using libs like `jsdom` or `puppeteer`). 
`cplot` makes it possible to generate SVG plots without the DOM in a very simple functional approach (data in -> svg out)
After you have the SVG output you can place it on the page, save as a file or even update previously generated chart with some diffing strategy.

### Install
```
npm install -S cplot
```

### Usage
```javascript
const cplot = require('cplot')
const svg = cplot(input) // -> String with SVG
```

### API
Under the hood `cplot` uses [charter](https://github.com/Mandarancio/charter) a C library compiled to JavaScript with [Emscripten](https://emscripten.org/) and [WebAssembly](https://webassembly.org/). So basically what works in `charter`, works in `cplot`. The only exception is CSV parsing that is not supported in `cplot` yet. The syntax from the original charter [README.md](https://github.com/Mandarancio/charter/blob/master/README.md):

| syntax | description |
| :----- | :------  |
|```plot```| create a new line plot|
|```scatter```| create a new scatter plot|
|```scatter```| create a new bar plot  |
|```x-axis```| parameters for the x axis |
|```y-axis```| parameters for the y axis |
|```label``` | label for axis or plot |
|```x```| x values of a plot |
|```y```| y values of a plot | 
|```color```| colour of a plot |  
|```line-width``` or ```lw```| plot line width |
|```line-style``` or ```ls```| plot line style ('--' or 'dashed', '-' or 'normal', ':' or dotted, '/' or 'none')|
|```bar-width``` or ```bw``` | bar plot width|
|```line-color```| bar plot line color |
|```marker```| marker style of a plot ('o', 'x', '+', 's', ' ')|
|```range```| min and max value for an axis |
|```mode``` | axis mode ('linear' or 'log') |
|```title```| plot title |
|```width```| plot width |
|```height```| plot height |
|```range: min max nstep```| linear range to use as values |
|```logrange: min max nstep```| log range to use as values |
|```math: f(x)```| math expression based on x to use as y value |

`cplot` supports inputs of multiple types:

**String** (Original DSL)
```javascript
const input = `
title: Test plot
x-axis:
  label Cost
y-axis:
  label Error
plot:
  color red
  marker x
  x 2 3 4 5 6 7 8 9
  y -2.8559703 -3.5301677 -4.3050655 -5.1413136 -6.0322865 -6.9675052 -7.9377747
`

const svg = cplot(input)
```

**Object**
If `cplot` received an object it first converts it to a DSL representation, then passes results to `charter`. The mapping is quite straightforward with two things to remember:
* Instead if quoted `{... 'x-axis': 'label Cost' ...}` you can use camel case (i.e. `{... xAxis: 'label Cost' ...}`)
* To pass multiple plots use `plots` key (i.e. `{... plots : [{ x: [...], y: [...] }, { x: [...], y: [...] }] ...}`)
The previously defined DSL in the object format:
```javascript
const input = {
  title: 'Test plot',
  xAxis: {
    label: 'Cost'
  },
  yAxis: {
    label: 'Error'
  },
  plot: {
    color: 'red',
    marker: 'x',
    x: [2, 3, 4, 5, 6, 7, 8, 9],
    y: [-2.8559703, -3.5301677, -4.3050655, -5.1413136, -6.0322865, -6.9675052, -7.9377747]
  }
}

const svg = cplot(input)
```


**Arrays**
In the most simple case `cplot` supports array as parameters
```javascript
cplot(array) // plot the array on the y-axis, x is index (1, 2, 3..)
cplot(x, y) // plot x and y
```

### CLI
You can generate plots calling `cplot` from the command line. Install `cplot` globally or call it with `npx cplot`
```
npm install cplot -g
```

* Pass DSL or JSON input via stream
```
cat plot.json | cplot > plot.svg
```
* Provide file names as parameters
```
cplot plot.json -o plot.svg
```
* Pass a sequence of numbers
```
echo "1 2 3 4 5" | cplot > plot.svg
```

### Examples
Check some example plots on the `charter` gallery page: [https://github.com/Mandarancio/charter/wiki/Gallery](https://github.com/Mandarancio/charter/wiki/Gallery)

### Small bonus
You can evaluate functions in `cplot`. It includes compiled `tinyexpr` that supports the standard C math. Those functions will be evaluated in a safe WebAssembly environment.
```
x-axis
  label x
y-axis
  label y
plot:
  x range: -6 6 20
  y math: x^2-x+4
  marker: o
```

