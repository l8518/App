// fetch_data = async function(year_start, year_end){
//     const url = "/api/portraits_for_period?year_start=" +year_start +"&year_end=" +year_end;
//     const response = await fetch(url)
//       .then(resp => resp.json());
//
//     return response;
// }

// update = function(data){
//
//   //transition
//   var t = d3.transition().duration(750);
//
//   //hierarchy
//   var h = d3.hierarchy({children: data}).sum(function(d) { return d.count; });
//
//   // console.log(pack(h).leaves());
//   //JOIN
//   var circle = bubble_svgBubble.selectAll("circle")
//     .data(pack(h).leaves(), function(d){return d.data.dominant_color;});
//
//   var text = bubble_svgBubble.selectAll("text")
//     .data(pack(h).leaves(), function(d){return d.data.count;});
//
//   //EXIT
//   circle.exit()
//     .style("fill",  function(d){return d.data.dominant_color})
//     .transition(t)
//     .attr("r", 1e-6)
//     .remove();
//
//   text.exit()
//     .transition(t)
//     .attr("opacity", 1e-6)
//     .remove();
//
//   //UPDATE
//
//   circle
//     .transition(t)
//     .style("fill", function(d){ return d.data.dominant_color })
//     .attr("r", function(d){ return d.r })
//     .attr("cx", function(d){ return d.x; })
//     .attr("cy", function(d){ return d.y; })
//
//   text
//     .transition(t)
//     .attr("x", function(d){ return d.x; })
//     .attr("y", function(d){ return d.y; });
//
//   //ENTER
//   var el = circle.enter().append("circle")
//     .attr("r", 1e-6)
//     .attr("cx", function(d){ return d.x; })
//     .attr("cy", function(d){ return d.y; })
//     .style("fill", function(d){return d.data.dominant_color});
//
//     el.transition(t)
//       .style("fill", function(d){return d.data.dominant_color})
//       .attr("r", function(d){ return d.r });
//
//     el.append("title")
//     .text(function(d) {return d.data.dominant_color + "\n" + format(d.data.count); });
//
//   text.enter().append("text")
//     .attr("opacity", 1e-6)
//     .attr("x", function(d){ return d.x; })
//     .attr("y", function(d){ return d.y; })
//     .text(function(d){ return d.data.count; })
//     .transition(t)
//     .attr("opacity", 1);
// }
// const bubble_width = 600;
// const bubble_height = 600;
//
// let viewBox = `0 0 ${bubble_width} ${bubble_height}`;
// var bubble_svg = d3.select("#bubble")
//   .append("svg")
//     .attr("id", "bubble")
//     .attr("viewBox", viewBox)
//
// var format = d3.format(",d");
//
// var pack = d3.pack()
//   .size([bubble_width, bubble_height])
//   .padding(1.5);


// set the dimensions and margins of the graph
var margin = {top: 40, right: 150, bottom: 60, left: 30},
    width = 500 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svgBubble = d3.select("#bubble")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

update = function (data) {
    // Add X axis
    // var x = d3.scaleLinear()
    //     .domain([0, 10000])
    //     .range([0, width]);
    // svgBubble.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(x));
    //
    // // Add Y axis
    // var y = d3.scaleLinear()
    //     .domain([35, 90])
    //     .range([height, 0]);
    // svgBubble.append("g")
    //     .call(d3.axisLeft(y));
    //
    // // Add a scale for bubble size
    // var z = d3.scaleLinear()
    //     .domain([200000, 1310000000])
    //     .range([1, 40]);
    //
    // console.log(data)
    // // Add dots
    // svgBubble.append('g')
    //     .selectAll("dot")
    //     .data(data)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function (d) {
    //         return x(Math.random() * 1000);
    //     })
    //     .attr("cy", function (d) {
    //         return y(d.age);
    //     })
    //     .attr("r", function (d) {
    //         return z(d.count);
    //     })
    //     .style("fill", "#69b3a2")
    //     .style("opacity", "0.7")
    //     .attr("stroke", "black")

    // ---------------------------//
    //       AXIS  AND SCALE      //
    // ---------------------------//

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 2020])
        .range([0, width]);
    svgBubble.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(3));

    // Add X axis label:
    svgBubble.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 50)
        .text("Time");

    const ageGroups = ["(0-2)", "(4-6)", "(8-12)", "(15-20)", "(25-32)", "(38-43)", "(48-53)", "(60-100)"];
    // Add Y axis
    let ticks = []
    for (let i = 0; i < ageGroups.length; i++) {
        ticks[i] = (height / ageGroups.length) * i
    }

    var y = d3.scaleOrdinal()
        .domain(ageGroups)
        .range(ticks.reverse());
    svgBubble.append("g")
        .call(d3.axisLeft(y));

    // Add Y axis label:
    svgBubble.append("text")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -20)
        .text("Age")
        .attr("text-anchor", "start")

    // Add a scale for bubble size
    var z = d3.scaleLinear()
        .domain([1, 1000])
        .range([1, 50]);

    // Add a scale for bubble color
    // var myColor = d3.scaleOrdinal()
    //     .domain(["Female", "Male"])
    //     .range(d3.);


    // ---------------------------//
    //      TOOLTIP               //
    // ---------------------------//

    // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3.select("#bubble_tt") // todo add div bubble_tt
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function (d) {
        tooltip
            .transition()
            .duration(200)
        tooltip
            .style("opacity", 1)
            .html("Country: " + d.country)
            .style("left", (d3.mouse(this)[0] + 30) + "px")
            .style("top", (d3.mouse(this)[1] + 30) + "px")
    }
    var moveTooltip = function (d) {
        tooltip
            .style("left", (d3.mouse(this)[0] + 30) + "px")
            .style("top", (d3.mouse(this)[1] + 30) + "px")
    }
    var hideTooltip = function (d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }


    // ---------------------------//
    //       HIGHLIGHT GROUP      //
    // ---------------------------//

    // What to do when one group is hovered
    var highlight = function (d) {
        // reduce opacity of all groups
        d3.selectAll(".bubbles").style("opacity", .05)
        // expect the one that is hovered
        d3.selectAll("." + d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    var noHighlight = function (d) {
        d3.selectAll(".bubbles").style("opacity", 1)
    }


    // ---------------------------//
    //       CIRCLES              //
    // ---------------------------//

    // Add dots
    svgBubble.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function (d) {
            return "bubbles " + d.gender
        })
        .attr("cx", function (d) {
            return Math.floor(Math.random() * 2000); // Fixme or what are we gonna show?
        })
        .attr("cy", function (d) {
            console.log(d.age)
            console.log(d.age[1])
            return y(d.age);
        })
        .attr("r", function (d) {
            return z(d.count);
        })
        .style("fill", function (d) {
            return [d.R, d.G, d.B];
        })
        // -3- Trigger the functions for hover
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)


    // ---------------------------//
    //       LEGEND              //
    // ---------------------------//

    // Add legend: circles
    var valuesToShow = [10000000, 100000000, 1000000000]
    var xCircle = 390
    var xLabel = 440
    svgBubble
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function (d) {
            return height - 100 - z(d)
        })
        .attr("r", function (d) {
            return z(d)
        })
        .style("fill", "none")
        .attr("stroke", "black")

    // Add legend: segments
    svgBubble
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
        .attr('x1', function (d) {
            return xCircle + z(d)
        })
        .attr('x2', xLabel)
        .attr('y1', function (d) {
            return height - 100 - z(d)
        })
        .attr('y2', function (d) {
            return height - 100 - z(d)
        })
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    svgBubble
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
        .attr('x', xLabel)
        .attr('y', function (d) {
            return height - 100 - z(d)
        })
        .text(function (d) {
            return d / 1000000
        })
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')

    // Legend title
    svgBubble.append("text")
        .attr('x', xCircle)
        .attr("y", height - 100 + 30)
        .text("Amount of paintings")
        .attr("text-anchor", "middle")

    // Add one dot in the legend for each name.
    var size = 20
    var allgroups = ["Female", "Male"]
    svgBubble.selectAll("myrect")
        .data(allgroups)
        .enter()
        .append("circle")
        .attr("cx", 390)
        .attr("cy", function (d, i) {
            return 10 + i * (size + 5)
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function (d) {
            return [d.R, d.G, d.B]
        })
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Add labels beside legend dots
    svgBubble.selectAll("mylabels")
        .data(allgroups)
        .enter()
        .append("text")
        .attr("x", 390 + size * .8)
        .attr("y", function (d, i) {
            return i * (size + 5) + (size / 2)
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function (d) {
            return [d.R, d.G, d.B]
        })
        .text(function (d) {
            return d
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
}

fetch_bubble = function () {
    const url = "/api/bubble?year_start=" + 0 + "&year_end=" + 2020;
    const response = fetch(url)
        .then(resp => resp.json())
        .then((data) => {
            update(data)
        });
}

fetch_bubble()