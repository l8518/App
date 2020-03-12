let marginColorDist = {top: 50, right: 20, bottom: 50, left: 65},
    widthColorDist = 500 - marginColorDist.left - marginColorDist.right,
    heightColorDist = 500 - marginColorDist.top - marginColorDist.bottom;

let colors;

init_fetch_color_dist_data = function () {
    let url = new URL('/api/color_dist', 'http://localhost:5000')
    url.search = new URLSearchParams(filterJSParams).toString();

    fetch(url)
        .then(resp => resp.json())
        .then((data) => {
            // updateColorDistribution(data)
            drawInitBars(data);
        });
};


update_color_dist_data = function () {
    let url = new URL('/api/color_dist', 'http://localhost:5000')
    url.search = new URLSearchParams(filterJSParams).toString();

    fetch(url)
        .then(resp => resp.json())
        .then((data) => {
            // updateColorDistribution(data)
            updateBars(data);
        });
};

init_colors = function () {
    let url = new URL('/api/colors', 'http://localhost:5000')

    fetch(url)
        .then(resp => resp.json())
        .then((data) => {
            colors = data
        }).then(() => {
        init_fetch_color_dist_data()
    });
};
init_colors();

get_max_sum = function (data) {
    let values = [];
    data.forEach((bar) => {
        let sum = 0;
        for (let i = 0; i < filterJSParams['color'].length; i++) {
            sum += bar[String(filterJSParams['color'][i])]
        }
        values.push(sum);
    });
    return Math.max(...values);
};

sort_age_groups = function (groups) {
    let values = [];
    groups.forEach((ageGroup) => {
        values.push([Number(ageGroup.split("-")[0].split("(")[1]), Number(ageGroup.split("-")[1].split(")")[0])])
    });
    values.sort((a, b) => a[0] - b[0]);

    // Convert back to string
    const ageStrings = values.map((val) => {
        return "(" + val[0] + "-" + val[1] + ")";
    });
    return ageStrings;
};


function drawInitBars(data) {
    const svgColorDist = d3.select("#bubble")
        .append("svg")
        .attr("width", widthColorDist + marginColorDist.left + marginColorDist.right)
        .attr("height", heightColorDist + marginColorDist.top + marginColorDist.bottom)
        .append("g")
        .attr("transform",
            "translate(" + marginColorDist.left + "," + marginColorDist.top + ")");

    getXGroups = function (data) {
        let groups = d3.map(data, d => d.age).keys();
        return sort_age_groups(groups);
    };

// TODO fix for smaller values than 1000
    getMaxY = function (data) {
        return Math.round((get_max_sum(data) + (get_max_sum(data) / 10)) / 1000) * 1000;
    };

    let yColDist = d3.scaleLinear();
    let xColDist = d3.scaleBand();
    let colorColDist = d3.scaleOrdinal();

    let groups = getXGroups(data);
    let subgroups = filterJSParams['color'];

    yColDist.domain([0, getMaxY(data)])
        .range([heightColorDist, 0]);

    xColDist.domain(groups)
        .range([0, widthColorDist])
        .padding([0.2]);

    let colRange = colors.map(color => [color['R'], color['G'], color['B']]);
    // TODO maybe sort color groups? Looks actually good like this
    colorColDist.domain(filterJSParams['color'])
        .range(colRange);

    let stackedData = d3.stack()
        .keys(subgroups)
        (data);

    svgColorDist.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
        .attr("class", "bar")
        .attr("fill", d => {
            return "rgb(" + colorColDist(d.key)[2] + ", " + colorColDist(d.key)[1] + "," + colorColDist(d.key)[0] + ")"
        })
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(d => d)
        .enter().append("rect")
        .attr("x", d => {
            return xColDist(d.data.age)
        })
        .attr("y", d => {
            return yColDist(d[1])
        })
        .attr("height", (d) => {
            return yColDist(d[0]) - yColDist(d[1])
        })
        .attr("width", xColDist.bandwidth());


    svgColorDist.append("g")
        .attr("transform", "translate(0," + heightColorDist + ")")
        .call(d3.axisBottom(xColDist).tickSizeOuter(0));

    svgColorDist.append("g")
        .call(d3.axisLeft(yColDist));
}

updateBars = function (data) {
    //FIXME Quick hack
    const bubble = document.getElementById("bubble");
    bubble.childNodes[0].remove();
    drawInitBars(data);


    // console.log(data);
    // let groups = getXGroups(data);
    // let subgroups = filterJSParams['color'];
    //
    // y.domain([0, getMaxY(data)])
    //     .range([heightColorDist, 0]);
    //
    // x.domain(groups)
    //     .range([0, widthColorDist]);
    //
    // let colRange = colors.map(color => [color['R'], color['G'], color['B']]);
    // // TODO maybe sort color groups? Looks actually good like this
    // colorColDist.domain(filterJSParams['color'])
    //     .range(colRange);
    //
    // let stackedData = d3.stack()
    //     .keys(subgroups)
    //     (data);
    //
    //
    // svgColorDist.selectAll(".bar")
    //     .data(stackedData)
    //     .transition()
    //     .duration(2000)
    //     .attr("fill", d => {
    //         return "rgb(" + colorColDist(d.key)[2] + ", " + colorColDist(d.key)[1] + "," + colorColDist(d.key)[0] + ")"
    //     });
    // svgColorDist.selectAll("rect")
    //     // enter a second time = loop subgroup per subgroup to add all rectangles
    //     .data(d => d)
    //     .enter().append("rect")
    //     .attr("x", d => {
    //         return xColDist(d.data.age)
    //     })
    //     .attr("y", d => {
    //         return yColDist(d[1])
    //     })
    //     .attr("height", (d) => {
    //         return yColDist(d[0]) - yColDist(d[1])
    //     })
    //     .attr("width", xColDist.bandwidth());
};

filterJSInitParamsChangedHook(() => {
    update_color_dist_data()
});