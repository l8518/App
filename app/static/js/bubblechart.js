fetch_data = function(){
  const url = "/api/portraits";
    fetch(url)
        .then(resp => resp.json())
        .then(json => {
          render_bubble_chart(json);
            // var data = d3.map(json[0]).entries();
            // bars.data(data);
            // update();
        });
}

render_bubble_chart = function(data){
  var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");
  
  var format = d3.format(",d");
  
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  
  var pack = d3.pack()
  .size([width, height])
  .padding(1.5);
  
  
  
  var root = d3.hierarchy({children: data})
  .sum(function(d) { return d.count; });
  // .each(function(d) {
  //   if (id = d.data.dominant_color) {
  //     var id, i = id.lastIndexOf(".");
  //     d.dominant_color = id;
  //     d.package = id.slice(0, i);
  //     d.class = id.slice(i + 1);
  //   }
  // });
  
  var node = svg.selectAll(".node")
    .data(pack(root).leaves())
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  
  node.append("circle")
    .attr("id", function(d) { return d.data.dominant_color; })
    .attr("r", function(d) { return d.r; })
    .style("fill", function(d) { return d.data.dominant_color });
  
    node.append("clipPath")
    .attr("id", function(d) { return "clip-" + d.data.dominant_color; })
    .append("use")
    .attr("xlink:href", function(d) { return "#" + d.data.dominant_color; });
  
  node.append("text")
    .attr("clip-path", function(d) { return "url(#clip-" + d.data.dominant_color + ")"; })
    // .selectAll("tspan")
    // .data(function(d) { return d.data.dominant_color; })
    // .enter().append("tspan")
    // .attr("x", 0)
    // .attr("y", function(d, i, nodes) { console.log(nodes); return 13 + (i - nodes.length / 2 - 0.5) * 10; })
    .text(function(d) { return d.data.dominant_color; });
  
  node.append("title")
  .text(function(d) { return d.data.dominant_color + "\n" + format(d.data.count); });

}

window.onload = fetch_data();