let marginColorDist = {top: 50, right: 20, bottom: 50, left: 65},
    widthColorDist = 500 - marginColorDist.left - marginColorDist.right,
    heightColorDist = 500 - marginColorDist.top - marginColorDist.bottom;

let colors;

init_fetch_color_dist_data = function () {
    let url = new URL('/api/color_dist', 'http://localhost:5000');
    url.search = new URLSearchParams(filterJSParams).toString();

    fetch(url)
        .then(resp => resp.json())
        .then((data) => {
            // updateColorDistribution(data)
            drawInitBars(data);
        });
};


update_color_dist_data = function () {
    let url = new URL('/api/color_dist', 'http://localhost:5000');
    url.search = new URLSearchParams(filterJSParams).toString();

    fetch(url)
        .then(resp => resp.json())
        .then((data) => {
            // updateColorDistribution(data)
            updateBars(data);
        });
};

init_colors = function () {
    let url = new URL('/api/colors', 'http://localhost:5000');

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
    return values.map((val) => {
        return "(" + val[0] + "-" + val[1] + ")";
    });
};

let getXGroups = function (data) {
    let groups = d3.map(data, d => d.age).keys();
    return sort_age_groups(groups);
};

// TODO fix for smaller values than 1000
let getMaxY = function (data) {
    return Math.round((get_max_sum(data) + (get_max_sum(data) / 5)) / 1000) * 1000;
};

function componentToHexCD(c) {
    let hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHexCD(r, g, b) {
    return "#" + componentToHexCD(r) + componentToHexCD(g) + componentToHexCD(b);
}

function drawInitBars(data) {
    const svgColorDist = d3.select("#bubble")
        .append("svg")
        .attr("width", widthColorDist + marginColorDist.left + marginColorDist.right)
        .attr("height", heightColorDist + marginColorDist.top + marginColorDist.bottom)
        .append("g")
        .attr("transform",
            "translate(" + marginColorDist.left + "," + marginColorDist.top + ")");

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

    // ----------------
    // Create a tooltip
    // ----------------
    let tooltipColorDist = d3.select("#bubble")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px");

    // Three function that change the tooltip when user hover / move / leave a cell
    let mouseover = function(d) {
        var subgroupName = d3.select(this.parentNode).datum().key;
        var subgroupValue = d.data[subgroupName];

        let colGroup = colorColDist(subgroupName);
        tooltipColorDist
            .html("Group color: " + rgbToHexCD(colGroup[2], colGroup[1], colGroup[0]).toUpperCase()
                + "<br>" + "Amount of faces: " + subgroupValue)
            .style("opacity", 1)
    };
    let mousemove = function(d) {
        tooltipColorDist
            .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (d3.mouse(this)[1]) + "px")
    };
    let mouseleave = function(d) {
        tooltipColorDist
            .style("opacity", 0)
    };

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
        .attr("width", xColDist.bandwidth())
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

    svgColorDist.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - marginColorDist.left)
        .attr("x",0 - (heightColorDist / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Amount of faces");

    svgColorDist.append("text")
        .attr("y", heightColorDist + (marginColorDist.bottom/2))
        .attr("x", (widthColorDist / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Age groups");


    svgColorDist.append("text")
        .attr("y", 0)
        .attr("x", (widthColorDist / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Amount of skin tones grouped");

    svgColorDist.append("g")
        .attr("transform", "translate(0," + heightColorDist + ")")
        .call(d3.axisBottom(xColDist).tickSizeOuter(0));

    svgColorDist.append("g")
        .call(d3.axisLeft(yColDist));
}

updateBars = function (data) {
    const bubble = document.getElementById("bubble");
    const parent = bubble.parentNode;
    bubble.remove();
    let bubbleDiv = document.createElement("div");
    bubbleDiv.id = "bubble";
    parent.appendChild(bubbleDiv);

    drawInitBars(data);
};

filterJSInitParamsChangedHook(() => {
    update_color_dist_data()
});