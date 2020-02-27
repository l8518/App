
//Read the data
readAndDrawData = function (){
  fetch('/api/portraits_heatmap').then(function(resp){
    return resp.json();
  }).then(function(data){
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
    // var periods = [1, 2, 3, 4, 5, 6, 7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    // var centuries = [1, 2, 3, 4, 5, 6, 7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]

    var periods = d3.map(data, function(d){return d.period}).keys()
    var centuries = d3.map(data, function(d){return d.century}).keys()

    // Build X scales and axis:
    var x = d3.scaleBand()
    .range([0, heatmap_width ])
    .domain(periods)
    .padding(0.01);
    heatmap_svg.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + heatmap_height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()

    // Build Y scales and axis:
    var y = d3.scaleBand()
    .range([ 0, heatmap_height ])
    .domain(centuries)
    .padding(0.01);

    heatmap_svg.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

    heatmap_svg.selectAll()
      .data(data)
      .enter()
      .append("rect")
        .attr("x", function(d) { return x(d.period) })
        .attr("y", function(d) { return y(d.century) })
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .style("fill", function(d) { return d.dominant_color !== null ? d.dominant_color : '#FFFFFF'} )
    heatmap_svg.selectAll()
      .data(data)
      .enter().filter(function(d){ return d.dominant_color === null})
      .append("line")
        .attr("x1", function(d) { return x(d.period)})
        .attr("y1", function(d) { return y(d.century) + y.bandwidth()})
        .attr("x2", function(d) { return x(d.period) +  x.bandwidth()})
        .attr("y2", function(d) { return y(d.century)})
        .style("stroke", "grey")
        .style("stroke-width", 1);
  })
}
  
readAndDrawData();

