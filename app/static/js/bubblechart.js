fetch_data = async function(year_start, year_end){
    const url = "/api/portraits_for_period?year_start=" +year_start +"&year_end=" +year_end;
    const response = await fetch(url)
      .then(resp => resp.json());

    return response;
}

update = function(data){

  //transition
  var t = d3.transition().duration(750);

  //hierarchy
  var h = d3.hierarchy({children: data}).sum(function(d) { return d.count; });
  
  console.log(pack(h).leaves());
  //JOIN
  var circle = svg.selectAll("circle")
    .data(pack(h).leaves(), function(d){return d.data.dominant_color;});
    
  var text = svg.selectAll("text")
    .data(pack(h).leaves(), function(d){return d.data.count;});

  //EXIT
  circle.exit()
    .style("fill",  function(d){return d.data.dominant_color})
    .transition(t)
    .attr("r", 1e-6)
    .remove();

  text.exit()
    .transition(t)
    .attr("opacity", 1e-6)
    .remove();

  //UPDATE

  circle
    .transition(t)
    .style("fill", function(d){ return d.data.dominant_color })
    .attr("r", function(d){ return d.r })
    .attr("cx", function(d){ return d.x; })
    .attr("cy", function(d){ return d.y; })

  text
    .transition(t)
    .attr("x", function(d){ return d.x; })
    .attr("y", function(d){ return d.y; });

  //ENTER
  var el = circle.enter().append("circle")
    .attr("r", 1e-6)
    .attr("cx", function(d){ return d.x; })
    .attr("cy", function(d){ return d.y; })
    .style("fill", function(d){return d.data.dominant_color});

    el.transition(t)
      .style("fill", function(d){return d.data.dominant_color})
      .attr("r", function(d){ return d.r });

    el.append("title")
    .text(function(d) {return d.data.dominant_color + "\n" + format(d.data.count); });

  text.enter().append("text")
    .attr("opacity", 1e-6)
    .attr("x", function(d){ return d.x; })
    .attr("y", function(d){ return d.y; })
    .text(function(d){ return d.data.count; })
    .transition(t)
    .attr("opacity", 1);
}

var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");
  
var format = d3.format(",d");

var pack = d3.pack()
  .size([width, height])
  .padding(1.5);
