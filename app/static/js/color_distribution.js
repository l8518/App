var marginColorDist = {top: 50, right: 20, bottom: 10, left: 65},
    widthColorDist = 500 - marginColorDist.left - marginColorDist.right,
    heightColorDist = 500 - marginColorDist.top - marginColorDist.bottom;
// let colors = [];
//
// var y = d3.scaleOrdinal()
// // .domain(params['age'])
//     .range([0, heightColorDist], .3);
//
// var x = d3.scaleLinear()
//     .rangeRound([0, widthColorDist]);
//
// var color = d3.scaleOrdinal()
//     .range(colors);
//
// var xAxis = d3.axisTop()
//     .scale(x);
//
// var yAxis = d3.axisLeft()
//     .scale(y);
//
// var svgColorDist = d3.select("#bubble").append("svg")
//     .attr("width", widthColorDist + marginColorDist.left + marginColorDist.right)
//     .attr("height", heightColorDist + marginColorDist.top + marginColorDist.bottom)
//     .attr("id", "d3-plot")
//     .append("g")
//     .attr("transform", "translate(" + marginColorDist.left + "," + marginColorDist.top + ")");
//
// color.domain([0, 1, 2, 3, 4, 5, 6, 7, 8]);
//
// updateColorDistribution = function (data) {
//     console.log(data)
//     // data.forEach(function (d) {
//     //     // calc percentages
//     //     d["Strongly disagree"] = +d[1] * 100 / d.N;
//     //     d["Disagree"] = +d[2] * 100 / d.N;
//     //     d["Neither agree nor disagree"] = +d[3] * 100 / d.N;
//     //     d["Agree"] = +d[4] * 100 / d.N;
//     //     d["Strongly agree"] = +d[5] * 100 / d.N;
//     //     var x0 = -1 * (d["Neither agree nor disagree"] / 2 + d["Disagree"] + d["Strongly disagree"]);
//     //     var idx = 0;
//     //     d.boxes = color.domain().map(function (name) {
//     //         return {name: name, x0: x0, x1: x0 += +d[name], N: +d.N, n: +d[idx += 1]};
//     //     });
//     // });
//
//     let counts = [];
//     for (let i = 0; i < data.length; i++) {
//         if (data[i]['female']) {
//             data[i]
//         } else {
//
//         }
//     }
//     console.log(counts)
//
//     var min_val = d3.min(data, function (d) {
//         return 1;// d.boxes["0"].x0;
//     });
//
//     var max_val = d3.max(data, function (d) {
//         return 4//d.boxes["4"].x1;
//     });
//
//     x.domain([0, 1000]);
//     y.domain(data.map(function (d) {
//         return d.age;
//     }));
//
//     svgColorDist.append("g")
//         .attr("class", "x axis")
//         .call(xAxis);
//
//     svgColorDist.append("g")
//         .attr("class", "y axis")
//         .call(yAxis);
//
//     var vakken = svgColorDist.selectAll(".question")
//         .data(data)
//         .enter().append("g")
//         .attr("class", "bar")
//         .attr("transform", function (d) {
//             return "translate(0," + y(d.age) + ")";
//         });
//
//     var bars = vakken.selectAll("rect")
//         .data(function (d) {
//             return d.count;
//         })
//         .enter().append("g").attr("class", "subbar");
//
//     bars.append("rect")
//         .attr("height", y.rangeBand())
//         .attr("x", function (d) {
//             return x(d.count);
//         })
//         .attr("width", function (d) {
//             return x(d.x1) - x(d.x0);
//         })
//         .style("fill", function (d) {
//             return color(d.group);
//         });
//
//     bars.append("text")
//         .attr("x", function (d) {
//             return x(d.x0);
//         })
//         .attr("y", y.rangeBand() / 2)
//         .attr("dy", "0.5em")
//         .attr("dx", "0.5em")
//         .style("font", "10px sans-serif")
//         .style("text-anchor", "begin")
//         .text(function (d) {
//             return d.n !== 0 && (d.x1 - d.x0) > 3 ? d.n : ""
//         });
//
//     vakken.insert("rect", ":first-child")
//         .attr("height", y.rangeBand())
//         .attr("x", "1")
//         .attr("width", widthColorDist)
//         .attr("fill-opacity", "0.5")
//         .style("fill", "#F5F5F5")
//         .attr("class", function (d, index) {
//             return index % 2 == 0 ? "even" : "uneven";
//         });
//
//     svgColorDist.append("g")
//         .attr("class", "y axis")
//         .append("line")
//         .attr("x1", x(0))
//         .attr("x2", x(0))
//         .attr("y2", heightColorDist);
//
//     var startp = svgColorDist.append("g").attr("class", "legendbox").attr("id", "mylegendbox");
//     // this is not nice, we should calculate the bounding box and use that
//     var legend_tabs = [0, 120, 200, 375, 450];
//     var legend = startp.selectAll(".legend")
//         .data(color.domain().slice())
//         .enter().append("g")
//         .attr("class", "legend")
//         .attr("transform", function (d, i) {
//             return "translate(" + legend_tabs[i] + ",-45)";
//         });
//
//     legend.append("rect")
//         .attr("x", 0)
//         .attr("width", 18)
//         .attr("height", 18)
//         .style("fill", color);
//
//     legend.append("text")
//         .attr("x", 22)
//         .attr("y", 9)
//         .attr("dy", ".35em")
//         .style("text-anchor", "begin")
//         .style("font", "10px sans-serif")
//         .text(function (d) {
//             return d;
//         });
//
//     d3.selectAll(".axis path")
//         .style("fill", "none")
//         .style("stroke", "#000")
//         .style("shape-rendering", "crispEdges")
//
//     d3.selectAll(".axis line")
//         .style("fill", "none")
//         .style("stroke", "#000")
//         .style("shape-rendering", "crispEdges")
//
//     var movesize = widthColorDist / 2 - startp.node().getBBox().width / 2;
//     d3.selectAll(".legendbox").attr("transform", "translate(" + movesize + ",0)");
// };
//
fetch_color_dist_data = function () {
    let url = new URL('/api/color_dist', 'http://localhost:5000')
    url.search = new URLSearchParams(params).toString();

    fetch(url)
        .then(resp => resp.json())
        .then((data) => {
            // updateColorDistribution(data)
            drawBars(data);
        });
};

init_colors = function () {
    let url = new URL('/api/colors', 'http://localhost:5000')

    fetch(url)
        .then(resp => resp.json())
        .then((data) => {
            colors = data
        }).then(() => {
        // console.log(colors);
        fetch_color_dist_data()
    });
};
init_colors();

const data1 = [
    {"age": "(0-2)", "0": 125, "1": 143, "2": 42, "3": 122, "4": 136, "5": 42, "6": 156, "7": 46, "8": 206},
    {"age": "(15-20)", "0": 51, "1": 35, "2": 20, "3": 106, "4": 67, "5": 57, "6": 131, "7": 35, "8": 63},
    {"age": "(25-32)", "0": 480, "1": 580, "2": 425, "3": 651, "4": 796, "5": 362, "6": 893, "7": 271, "8": 605},
    {"age": "(38-43)", "0": 41, "1": 21, "2": 18, "3": 44, "4": 40, "5": 61, "6": 52, "7": 70, "8": 33},
    {"age": "(4-6)", "0": 228, "1": 207, "2": 62, "3": 265, "4": 183, "5": 147, "6": 221, "7": 88, "8": 297},
    {"age": "(48-53)", "0": 20, "1": 17, "2": 42, "3": 43, "4": 63, "5": 46, "6": 39, "7": 30, "8": 25},
    {"age": "(60-100)", "0": 44, "1": 44, "2": 20, "3": 40, "4": 45, "5": 19, "6": 46, "7": 14, "8": 60},
    {"age": "(8-12)", "0": 164, "1": 115, "2": 47, "3": 231, "4": 108, "5": 112, "6": 208, "7": 102, "8": 155}
];


function drawBars(data) {

    let groups = d3.map(data1, d => d.age).keys();
    console.log(groups)
    // console.log(data1);
    let subgroups = [0, 1, 2, 3, 4, 5, 6, 7, 8];//data.columns.slice(1);

    let y = d3.scaleLinear()
        .domain([0, 6000])
        .range([heightColorDist, 0]);

    let x = d3.scaleBand()
        .domain(groups)
        .range([0, widthColorDist])
        .padding([0.2]);

    console.log(colors)
    let colRange = colors.map(color => [color[0], color[1], color[2]])
    console.log(colRange)
    let color = d3.scaleOrdinal()
        .domain([0, 1, 2, 3, 4, 5, 6, 7, 8])
        .range(colors);

    console.log(colors);
    let stackedData = d3.stack()
        .keys(subgroups)
        (data1);
    // console.log(stackedData);

    const svgColorDist = d3.select("#bubble")
        .append("svg")
        .attr("width", widthColorDist + marginColorDist.left + marginColorDist.right)
        .attr("height", heightColorDist + marginColorDist.top + marginColorDist.bottom)
        .append("g")
        .attr("transform",
            "translate(" + marginColorDist.left + "," + marginColorDist.top + ")")

    svgColorDist.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
        .attr("fill", d => {
            return "rgb(" + color(d.key)[2] + ", " + color(d.key)[1] + "," + color(d.key)[0] + ")"
        })
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(d => d)
        .enter().append("rect")
        .attr("x", d => x(d.data.age))
        .attr("y", d => y(d[1]))
        .attr("height", (d) => {
            return y(d[0]) - y(d[1])
        })
        .attr("width", x.bandwidth())


    svgColorDist.append("g")
        .attr("transform", "translate(0," + heightColorDist + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    svgColorDist.append("g")
        .call(d3.axisLeft(y));
}