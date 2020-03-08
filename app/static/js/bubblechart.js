const ageGroups = ["(0-2)", "(4-6)", "(8-12)", "(15-20)", "(25-32)", "(38-43)", "(48-53)", "(60-100)"];
const centuries = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

// set the dimensions and margins of the graph
var marginBubble = {top: 40, right: 150, bottom: 60, left: 30},
    widthBubble = 500 - marginBubble.left - marginBubble.right,
    heightBubble = 500 - marginBubble.top - marginBubble.bottom;

// append the svg object to the body of the page
var svgBubble = d3.select("#bubble")
    .append("svg")
    .attr("width", widthBubble + marginBubble.left + marginBubble.right)
    .attr("height", heightBubble + marginBubble.top + marginBubble.bottom)
    .append("g")
    .attr("transform",
        "translate(" + marginBubble.left + "," + marginBubble.top + ")");

update = function (data) {

    // ---------------------------//
    //       AXIS  AND SCALE      //
    // ---------------------------//

    // Add X axis
    const widths = [0.25, 0.35, 0.4, 0.45, 0.5, 0.5, 0.5, 0.5, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    let ticksX = [];
    for (let i = 0; i < centuries.length; i++) {
        ticksX[i] = ((widthBubble / centuries.length) * i) * widths[i]
    }
    // const intervals = [[7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16], [16, 17], [17, 18], [18, 19], [19, 20]]
    console.log(ticksX)
    var x = d3.scaleOrdinal()
        .domain(centuries) // Centuries
        .range(ticksX);


    // var x = d3.scaleBand()
    //     .domain(centuries)
    //     .range(ticksX)
    // let x = d3.scaleBand()
    //     .domain(centuries)
    // .padding([.5])
    // .rangeRound([0, width]);
    // .domain(centuries) // Centuries
    // .range(ticksX);

    svgBubble.append("g")
        .attr("transform", "translate(0," + heightBubble + ")")
        .call(d3.axisBottom(x));

    // X grid lines
    svgBubble.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + heightBubble + ")")
        .call(d3.axisBottom(x)
            .ticks(centuries.length)
            .tickSize(-heightBubble)
            .tickFormat(""));


    // Add X axis label:
    svgBubble.append("text")
        .attr("text-anchor", "end")
        .attr("x", widthBubble)
        .attr("y", heightBubble + 50)
        .text("Century");

    // Create ticks for y-axis
    let ticks = [];
    for (let i = 0; i < ageGroups.length; i++) {
        ticks[i] = (heightBubble / ageGroups.length) * i
    }
    // Add Y axis
    var y = d3.scaleOrdinal()
        .domain(ageGroups)
        .range(ticks.reverse());
    svgBubble.append("g")
        .call(d3.axisLeft(y));

    // Y grid lines
    svgBubble.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .ticks(ageGroups.length)
            .tickSize(-widthBubble)
            .tickFormat(""));

    // Add Y axis label:
    svgBubble.append("text")
        .attr("text-anchor", "end")
        .attr("x", 10)
        .attr("y", -20)
        .text("Age")
        .attr("text-anchor", "start")

    // Add a scale for bubble size
    var z = d3.scaleSqrt()
        .domain([1, 50])
        .range([5, 20]);

    // ---------------------------//
    //      TOOLTIP               //
    // ---------------------------//

    // -1- Create a tooltip div that is hidden by default:
    var tooltipBub = d3.select("#bubble") // FIXME tooltip doesn't show long enough?
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white");

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function (d) {
        tooltipBub
            .transition()
            .duration(200)
        tooltipBub
            .style("opacity", 1)
            .html("Amount: " + d.count)
            .style("left", (d3.mouse(this)[0] + 30) + "px")
            .style("top", (d3.mouse(this)[1] + 30) + "px")
    }
    var moveTooltip = function (d) {
        tooltipBub
            .style("left", (d3.mouse(this)[0] + 30) + "px")
            .style("top", (d3.mouse(this)[1] + 30) + "px")
    }
    var hideTooltip = function (d) {
        tooltipBub
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
            return x(d.century)
        })
        .attr("cy", function (d) {
            return y(d.age);
        })
        .attr("r", function (d) {
            return z(d.count);
        })
        .style("fill", function (d) {
            return "rgb(" + d.B + "," + d.G + "," + d.R + ")";
        })
        // -3- Trigger the functions for hover
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)


    // ---------------------------//
    //       LEGEND              //
    // ---------------------------//

    // Add legend: circles
    var valuesToShow = [1, 10, 50]
    var xCircle = 390
    var xLabel = 440
    svgBubble
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function (d) {
            return heightBubble - 100 - z(d)
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
            return heightBubble - 100 - z(d)
        })
        .attr('y2', function (d) {
            return heightBubble - 100 - z(d)
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
            return heightBubble - 100 - z(d)
        })
        .text(function (d) {
            return d
        })
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')

    // Legend title
    svgBubble.append("text")
        .attr('x', xCircle)
        .attr("y", heightBubble - 100 + 30)
        .text("Amount of paintings")
        .attr("text-anchor", "middle")

    // Add one dot in the legend for each name.
    var size = 20
    var allGroups = ["Female", "Male"]
    svgBubble.selectAll("myrect")
        .data(allGroups)
        .enter()
        .append("circle")
        .attr("cx", 390)
        .attr("cy", function (d, i) {
            return 10 + i * (size + 5)
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function (d) {
            if (d === "Female")
                return "rgb(255,192,224)"
            else
                return "rgb(153,238,255)"
        })
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Add labels beside legend dots
    svgBubble.selectAll("mylabels")
        .data(allGroups)
        .enter()
        .append("text")
        .attr("x", 390 + size * .8)
        .attr("y", function (d, i) {
            return i * (size + 5) + (size / 2)
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function (d) {
            return "rgb(" + d.B + "," + d.G + "," + d.R + ")"
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
    const url = "/api/bubble?year_start=" + params['begin_year'] + "&year_end=" + params['end_year'];
    fetch(url)
        .then(resp => resp.json())
        .then((data) => {
            update(data)
        });
}

fetch_bubble()