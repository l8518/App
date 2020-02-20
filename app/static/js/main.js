// this is an example pulling data, and adding things to dom
function pull() {
    fetch('api/helloworld')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        d3.select("#example")
        .data(data)
        .enter()
        .append("p")
        .attr("class", "btn btn-primary")
        .text(function(d) { return d; });
    });
}

pull();