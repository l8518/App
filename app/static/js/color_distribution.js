let marginColorDist = {top: 50, right: 20, bottom: 50, left: 65},
    widthColorDist = 500 - marginColorDist.left - marginColorDist.right,
    heightColorDist = 500 - marginColorDist.top - marginColorDist.bottom;

let colors;

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
        fetch_color_dist_data()
    });
};
init_colors();

const data1 = [
    {"age": "(0-2)", "0": 125, "1": 143, "2": 42, "3": 122, "4": 136, "5": 42, "6": 156, "7": 46, "8": 206},
    {"age": "(4-6)", "0": 228, "1": 207, "2": 62, "3": 265, "4": 183, "5": 147, "6": 221, "7": 88, "8": 297},
    {"age": "(8-12)", "0": 164, "1": 115, "2": 47, "3": 231, "4": 108, "5": 112, "6": 208, "7": 102, "8": 155},
    {"age": "(15-20)", "0": 51, "1": 35, "2": 20, "3": 106, "4": 67, "5": 57, "6": 131, "7": 35, "8": 63},
    {"age": "(25-32)", "0": 480, "1": 580, "2": 425, "3": 651, "4": 796, "5": 362, "6": 893, "7": 271, "8": 605},
    {"age": "(38-43)", "0": 41, "1": 21, "2": 18, "3": 44, "4": 40, "5": 61, "6": 52, "7": 70, "8": 33},
    {"age": "(48-53)", "0": 20, "1": 17, "2": 42, "3": 43, "4": 63, "5": 46, "6": 39, "7": 30, "8": 25},
    {"age": "(60-100)", "0": 44, "1": 44, "2": 20, "3": 40, "4": 45, "5": 19, "6": 46, "7": 14, "8": 60},
];

get_max_sum = function (data) {
    let values = [];
    data.forEach((ageGroup) => {
        let sum = 0;
        for (let i = 0; i < params['color'].length; i++) {
            sum += ageGroup[String(params['color'][i])]
        }
        values.push(sum);
    });
    return Math.max(...values);
};

// TODO maybe sort age groups?
function drawBars(data) {
    let groups = d3.map(data, d => d[0]).keys();
    console.log(groups)
    let subgroups = params['color'];

    // TODO max value + some extra instead of 6000
    const maxY = Math.round((get_max_sum(data1) + (get_max_sum(data1) / 10)) / 1000) * 1000;
    let y = d3.scaleLinear()
        .domain([0, maxY])
        .range([heightColorDist, 0]);

    let x = d3.scaleBand()
        .domain(groups)
        .range([0, widthColorDist])
        .padding([0.2]);

    let colRange = colors.map(color => [color['R'], color['G'], color['B']]);

    // TODO maybe sort color groups?
    let color = d3.scaleOrdinal()
        .domain(params['color'])
        .range(colRange);

    console.log(colors);
    let stackedData = d3.stack()
        .keys(subgroups)
        (data1);

    const svgColorDist = d3.select("#bubble")
        .append("svg")
        .attr("width", widthColorDist + marginColorDist.left + marginColorDist.right)
        .attr("height", heightColorDist + marginColorDist.top + marginColorDist.bottom)
        .append("g")
        .attr("transform",
            "translate(" + marginColorDist.left + "," + marginColorDist.top + ")");

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
        .attr("x", d => {
            console.log("X: " + d.data.key)
            return x(d.data.age)
        })
        .attr("y", d => {
            console.log("Y:" + y(d[1]))
            return y(d[1])
        })
        .attr("height", (d) => {
            console.log("Y-d: " + y(d[0]) - y(d[1]))
            return y(d[0]) - y(d[1])
        })
        .attr("width", x.bandwidth())


    svgColorDist.append("g")
        .attr("transform", "translate(0," + heightColorDist + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    svgColorDist.append("g")
        .call(d3.axisLeft(y));
}