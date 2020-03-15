const xwide = 100;
const xmargin = 5;
const ymargin = 5;
const subsvgheight = 90;
const subsvgwidth = 90;
var face_index = 0;

function createFaceDOM(face, index, svg) {
    
    let faceurl = `../static/img/faces/${face.imgid}_${face.faceid}.jpg` 
    let facesvg = svg.append("svg")
        .attr("x", xmargin + (xwide * index))
        .attr("y", ymargin)
        .attr("width", subsvgwidth)
        .attr("height", subsvgheight)
        .attr("viewbox", "0 0 100 100")
        .classed("rounded-circle", true)
        .classed("shadow", true)

    let tooltiphtml = `<img class='w-100' src='${faceurl}'>`
    let faceobj = facesvg.append("image")
        .attr("href", faceurl)
        .attr("y", 0)
        .attr("x", 0)
        .attr("width", 100)
        .attr("height", 100)
        .attr("data-toggle", "tooltip")
        .attr("data-html", "true")
        .attr("title", tooltiphtml)

    $(function () {
        $(faceobj.node()).tooltip()
    })
}

function buildFacesBar(data) {
    let svg = d3.select("#faces-simbar")
    svg.selectAll("svg").remove()
    data.forEach( (element, index) => {
        createFaceDOM(element, index, svg);
    });
}

var similarFacesButtonPlusClick = function() {
    face_index++;
    fetch_data()
}

var similarFacesButtonMinusClick = function(e) {
    if (face_index >0) {
        face_index--;
        fetch_data()
    } else {
        // TODO: Deactivate
        document.getElementById("faces-simbar-btn-plus")
    }
    
}

function fetch_data() {
    var url = new URL('/api/faces_by_params', 'http://localhost:5000')
    let params = filterJSParams;
    params["index"] = face_index;

    url.search = new URLSearchParams(params).toString();
    fetch(url).then(function (resp) {
        return resp.json()
    }).then(buildFacesBar);
}

fetch_data()

filterJSInitParamsChangedHook(fetch_data);
