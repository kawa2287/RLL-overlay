// set the dimensions and margins of the graph
var margin = {top: 12, right: 40, bottom: 12, left: 40},
  width = 450 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#ball_heatmap")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
// Y range is approx -5000 to 5000
var myGroups = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"]; // x axis == ballY
// X range is ??? guessing -3500 to 3500
var myVars = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]; // y axis == ballX

// fix if needed -- estimates of total range
const X_RANGE = 10000; // -5000 to 5000
const X_CELLSIZE = X_RANGE / myGroups.length;
const Y_RANGE = 7000; // -3500 to 3500
const Y_CELLSIZE = Y_RANGE / myVars.length;
const posBinsWithCounts = [];
const binsByPos = {};

let biggestBinCount = 10;

const xBins = [];
const yBins = [];

for (let i = 0; i < myGroups.length; i++) {
  const curGroup = myGroups[i];
  const xRangeMin = (i * X_CELLSIZE) - (X_RANGE / 2);
  const xRangeMax = ((i+1) * X_CELLSIZE) - (X_RANGE / 2);
  xBins.push(xRangeMin);
  for (let j = 0; j < myVars.length; j++) {
    const curVar = myVars[j];
    const yRangeMin = (j * Y_CELLSIZE) - (Y_RANGE / 2);
    const yRangeMax = ((j+1) * Y_CELLSIZE) - (Y_RANGE / 2);

    const count = 0;

    if (i === 0) {
      yBins.push(yRangeMin);
    }

    posBinsWithCounts.push({
      "group": curGroup,
      "variable": curVar,
      "value": count,
      "xMin": xRangeMin,
      "xMax": xRangeMax,
      "yMin": yRangeMin,
      "yMax": yRangeMax
    });
    binsByPos[`${curGroup}${curVar}`] = count;
    if (count > biggestBinCount) {
      biggestBinCount = count;
    }
  }
}
positionBins = posBinsWithCounts;

// Build X scales and axis:
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(myGroups)
  .padding(0.01);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Build X scales and axis:
var y = d3.scaleBand()
  .range([ height, 0 ])
  .domain(myVars)
  .padding(0.01);
svg.append("g")
  .call(d3.axisLeft(y));

// Build color scale
// let myColor = d3.scaleLinear()
//   .range(["rgba(0,0,0,0)", "rgba(90,200,150,0.9)"]) // orig: white to #69b3a2
//   .domain([1,biggestBinCount]);
let myColor = d3.scaleSequential(d3.interpolateSpectral)
  .domain([0, biggestBinCount]);

// console.log('plot ball pos heatmap');
// console.log(posBinsWithCounts);
// Plot the data
svg.selectAll()
    .data(positionBins, function(d) {return d.group+':'+d.variable;})
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.group))
    .attr("y", (d) => y(d.variable))
    .attr("width", x.bandwidth() )
    .attr("height", y.bandwidth() )
    .attr("opacity", "0.7")
    .style("fill",  (d) => d.value === 0 ? 'rgba(0,0,0,0)' : myColor(d.value) )

// original example
// d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", function(data) {
//   svg.selectAll()
//       .data(data, function(d) {return d.group+':'+d.variable;})
//       .enter()
//       .append("rect")
//       .attr("x", function(d) { return x(d.group) })
//       .attr("y", function(d) { return y(d.variable) })
//       .attr("width", x.bandwidth() )
//       .attr("height", y.bandwidth() )
//       .style("fill", function(d) { return myColor(d.value)} )
// });

console.log(xBins);
console.log(yBins);
console.log(positionBins);

// function updateHeatmap(ballPos) {
//   // console.log('updateHeatmap');
//   let binX = 1;
//   let binY = 1;
//   for (let j = xBins.length - 1; j > 0; j--) {
//     if (ballPos.y >= xBins[j]) {
//       binX = j + 1;
//       break;
//     }
//   }
//   for (let k = yBins.length - 1; k > 0; k--) {
//     if (ballPos.x >= yBins[k]) {
//       binY = k + 1;
//       break;
//     }
//   }
//   console.log(`got bin: ${binX} ${binY}`);
//   const curBinCount = binsByPos[`${binX}${binY}`]++;
//   const count = curBinCount;

//   if (count > biggestBinCount) {
//     // console.log(`New biggest count: ${count}`);
//     biggestBinCount = count;
//   }

//   const posIdx = (binX - 1) * (yBins.length) + (binY) - 1;

//   console.log('got idx', posIdx);
//   console.log(positionBins[posIdx]);

//   positionBins[posIdx].value = count;
//   // console.log(positionBins);
//   // myColor = d3.scaleLinear()
//   //   .range(["rgba(0,0,0,0)", "rgba(90,200,150,0.9)"]) // orig: white to #69b3a2
//   myColor = d3.scaleSequential(d3.interpolateSpectral)
//     .domain([0, biggestBinCount]);

//   svg.selectAll()
//     .data(positionBins, (d) => `${d.group}:${d.variable}`)
//     .enter()
//     .append("rect")
//     .attr("x", function(d) { return x(d.group) })
//     .attr("y", function(d) { return y(d.variable) })
//     .attr("width", x.bandwidth() )
//     .attr("height", y.bandwidth() )
//     .style("fill", (d) => d.value === 0 ? 'rgba(0,0,0,0)' : myColor(d.value));
// }

function updateHeatmap(ballHistory) {
  // console.log('updateHeatmap');
  
  for (let i = 0; i < ballHistory.length; i++) {
    const ballPos = ballHistory[i];
    let binX = 1;
    let binY = 1;
    for (let j = xBins.length - 1; j > 0; j--) {
      if (ballPos.y >= xBins[j]) {
        binX = j + 1;
        break;
      }
    }
    for (let k = yBins.length - 1; k > 0; k--) {
      if (ballPos.x >= yBins[k]) {
        binY = k + 1;
        break;
      }
    }
    // console.log(`got bin: ${binX} ${binY}`);
    const curBinCount = binsByPos[`${binX}${binY}`]++;
    const count = curBinCount;

    if (count > biggestBinCount) {
      // console.log(`New biggest count: ${count}`);
      biggestBinCount = count;
    }

    const posIdx = (binX - 1) * (yBins.length) + (binY) - 1;

    // console.log('got idx', posIdx);
    // console.log(positionBins[posIdx]);

    positionBins[posIdx].value = count;
  }
  // console.log(positionBins);
  // myColor = d3.scaleLinear()
  //   .range(["rgba(0,0,0,0)", "rgba(90,200,150,0.9)"]) // orig: white to #69b3a2
  myColor = d3.scaleSequential(d3.interpolateSpectral)
    .domain([0, biggestBinCount]);

  console.log(binsByPos);

  svg.selectAll()
    .data(positionBins, (d) => `${d.group}:${d.variable}`)
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.group) })
    .attr("y", function(d) { return y(d.variable) })
    .attr("width", x.bandwidth() )
    .attr("height", y.bandwidth() )
    .attr("opacity", "0.7")
    .style("fill", (d) => d.value === 0 ? 'rgba(0,0,0,0)' : myColor(d.value));
}