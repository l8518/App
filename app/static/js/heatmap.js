
// set the dimensions and margins of the graph
var heatmap_margin = {top: 30, right: 30, bottom: 30, left: 30},
  heatmap_width = 450 - heatmap_margin.left - heatmap_margin.right,
  heatmap_height = 450 - heatmap_margin.top - heatmap_margin.bottom;

// append the svg object to the body of the page
var heatmap_svg = d3.select("#my_dataviz")
.append("svg")
  .attr("id", "heatmap")
  .attr("width", heatmap_width + heatmap_margin.left + heatmap_margin.right)
  .attr("height", heatmap_height + heatmap_margin.top + heatmap_margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + heatmap_margin.left + "," + heatmap_margin.top + ")");

// Labels of row and columns
var myGroups = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]
var myVars = [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000]

// Build X scales and axis:
var x = d3.scaleBand()
  .range([ 0, heatmap_width ])
  .domain(myGroups)
  .padding(0.01);
heatmap_svg.append("g")
  .attr("transform", "translate(0," + heatmap_height + ")")
  .call(d3.axisBottom(x))

// Build X scales and axis:
var y = d3.scaleBand()
  .range([ heatmap_height, 0 ])
  .domain(myVars)
  .padding(0.01);
heatmap_svg.append("g")
  .call(d3.axisLeft(y));

// Build color scale
var myColor = d3.scaleLinear()
  .range(["white", "#69b3a2"])
  .domain([1,100])

//Read the data
readAndDrawData = function (){
  fetch('/api/portraits_heatmap').then(function(resp){
    return resp.json();
  }).then(function(data){
    // console.log(data)
    heatmap_svg.selectAll()
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.period) })
      .attr("y", function(d) { return y(d.century) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return d.pcolor} )
  })
}
  
readAndDrawData();
