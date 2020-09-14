const ballHistoryTest = [{
  "x": -600.720675,
  "y": -4657,
},{
  "x": -60.720675,
  "y": -457,
},{
  "x": -3006.720675,
  "y": 657,
},{
  "x": -2506.720675,
  "y": -47,
},{
  "x": 6.720675,
  "y": 657,
},{
  "x": 600.720675,
  "y": 57,
},{
  "x": 1604,
  "y": 657,
},{
  "x": 2075,
  "y": 2657,
},{
  "x": 675,
  "y": 3657,
},{
  "x": -60.720675,
  "y": -457,
},{
  "x": -6.720675,
  "y": 4657,
},{
  "x": -3006.720675,
  "y": 657,
},{
  "x": -2506.720675,
  "y": -47,
},{
  "x": 6.720675,
  "y": 657,
},{
  "x": 600.720675,
  "y": 57,
},{
  "x": 1604,
  "y": 657,
},{
  "x": 2075,
  "y": 2657,
},{
  "x": 675,
  "y": 3657,
},{
  "x": -600.720675,
  "y": -4657,
},{
  "x": -60.720675,
  "y": -457,
},{
  "x": -6.720675,
  "y": 4657,
},{
  "x": -3006.720675,
  "y": 657,
},{
  "x": 6.720675,
  "y": 657,
},{
  "x": 600.720675,
  "y": 57,
},{
  "x": 1604,
  "y": 657,
},{
  "x": 2075,
  "y": 2657,
},{
  "x": -60.720675,
  "y": -457,
},{
  "x": -6.720675,
  "y": 4657,
},{
  "x": -3006.720675,
  "y": 657,
},{
  "x": -2506.720675,
  "y": -47,
},{
  "x": 6.720675,
  "y": 657,
},{
  "x": 600.720675,
  "y": 57,
},{
  "x": 2075,
  "y": 2657,
},{
  "x": 675,
  "y": 3657,
},{
  "x": -600.720675,
  "y": -4657,
},{
  "x": -60.720675,
  "y": -457,
},{
  "x": -6.720675,
  "y": 4657,
},{
  "x": -2506.720675,
  "y": -47,
},{
  "x": 6.720675,
  "y": 657,
},{
  "x": 600.720675,
  "y": 57,
},{
  "x": 1604,
  "y": 657,
},{
  "x": 2075,
  "y": 2657,
},{
  "x": 675,
  "y": 3657,
},{
  "x": -60.720675,
  "y": -457,
},{
  "x": -6.720675,
  "y": 4657,
},{
  "x": -3006.720675,
  "y": 657,
},{
  "x": -2506.720675,
  "y": -47,
},{
  "x": 6.720675,
  "y": 657,
},{
  "x": 600.720675,
  "y": 57,
},{
  "x": 1604,
  "y": 657,
},{
  "x": 2075,
  "y": 2657,
},{
  "x": 675,
  "y": 3657,
},{
  "x": -600.720675,
  "y": -4657,
},{
  "x": -60.720675,
  "y": -457,
},{
  "x": -6.720675,
  "y": 4657,
},{
  "x": -3006.720675,
  "y": 657,
},{
  "x": -2506.720675,
  "y": -47,
},{
  "x": 6.720675,
  "y": 657,
},{
  "x": 600.720675,
  "y": 57,
},{
  "x": 1604,
  "y": 657,
},{
  "x": 2075,
  "y": 2657,
},{
  "x": 675,
  "y": 3657,
}];
// recalcHeatmap(ballHistoryTest);

let positionBins = [];
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

let ballPositions = positionBins;

// fix if needed -- estimates of total range
const X_RANGE = 10000; // -5000 to 5000
const X_CELLSIZE = X_RANGE / myGroups.length;
const Y_RANGE = 7000; // -3500 to 3500
const Y_CELLSIZE = Y_RANGE / myVars.length;
const posBinsWithCounts = [];

let biggestBinCount = 10;

for (let i = 0; i < myGroups.length; i++) {
  const curGroup = myGroups[i];
  const xRangeMin = (i * X_CELLSIZE) - (X_RANGE / 2);
  const xRangeMax = ((i+1) * X_CELLSIZE) - (X_RANGE / 2);
  for (let j = 0; j < myVars.length; j++) {
    const curVar = myVars[j];
    const yRangeMin = (j * Y_CELLSIZE) - (Y_RANGE / 2);
    const yRangeMax = ((j+1) * Y_CELLSIZE) - (Y_RANGE / 2);

    let count = 0;
    const unbinnedBallPositions = []
    for (let k = 0; k < ballPositions.length; k++) {
      const ballPos = ballPositions[k];
      // ballPos flips the x and y so this looks weird
      if (ballPos.y > xRangeMin && ballPos.y <= xRangeMax && ballPos.x > yRangeMin && ballPos.x <= yRangeMax) {
        count++;
      } else {
        unbinnedBallPositions.push(ballPos);
      }
    }
    ballPositions = unbinnedBallPositions; // try to be a little more efficient by skipping ones that are already binned on subsequent loops

    posBinsWithCounts.push({
      "group": curGroup,
      "variable": curVar,
      "value": count,
      "xMin": xRangeMin,
      "xMax": xRangeMax,
      "yMin": yRangeMin,
      "yMax": yRangeMax
    });
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
let myColor = d3.scaleSequential(d3.interpolatePuOr)
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

function updateHeatmap(ballPos) {

  for (let i = 0; i < positionBins.length; i++) {
    const curBin = positionBins[i];
    let count = curBin.value;
    // ballPos flips the x and y so this looks weird
    if (ballPos.y > curBin.xMin && ballPos.y <= curBin.xMax && ballPos.x > curBin.yMin && ballPos.x <= curBin.yMax) {
      // console.log(`COUNT UPDATE ${curBin.group}:${curBin.variable} ==> ${curBin.value}`);
      count++;
      if (count > biggestBinCount) {
        console.log(`New biggest count: ${count}`);
        biggestBinCount = count;
      }

      positionBins[i].value = count;
      break;
    }
  }
  // console.log(positionBins);
  // myColor = d3.scaleLinear()
  //   .range(["rgba(0,0,0,0)", "rgba(90,200,150,0.9)"]) // orig: white to #69b3a2
  myColor = d3.scaleSequential(d3.interpolatePuOr)
    .domain([0, biggestBinCount]);

  svg.selectAll()
    .data(positionBins, (d) => `${d.group}:${d.variable}`)
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.group) })
    .attr("y", function(d) { return y(d.variable) })
    .attr("width", x.bandwidth() )
    .attr("height", y.bandwidth() )
    .style("fill", (d) => d.value === 0 ? 'rgba(0,0,0,0)' : myColor(d.value));
}