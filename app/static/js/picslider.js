var svg = d3.select("#face_view_svg");
let svg_width=svg.node().getBoundingClientRect().width;
let svg_height=svg.node().getBoundingClientRect().height;

let margin = {top: 20, right: 20, bottom: 110, left: 40};
let margin2 = {top: 30, right: 20, bottom: 50, left: 40};

let width = svg_width - margin.left - margin.right;
let height = svg_height ;
let height2 = svg_height;


var parseDate = d3.timeParse("%b %Y");

var x = d3.scaleTime().range([0, width]),
x2 = d3.scaleTime().range([0, width]),
y = d3.scaleLinear().range([height, 0]),
y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
xAxis2 = d3.axisBottom(x2),
yAxis = d3.axisLeft(y);

var slider = svg.append('g')
.classed('slider', true)
.attr('transform', 'translate(' + margin.left +', '+ (height/2) + ')');

var sliderTime = d3
    .sliderBottom()
    .width(width)
    .on('drag', debounceD3Event(dragged_debounce,200))

var area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2(d.creation_year); })
    .y0(height2)
    .y1(function(d) { return y2(d.count); });

svg.append("defs").append("clipPath")
.attr("id", "clip")
.append("rect")
.attr("width", width)
.attr("height", height);

var context = svg.append("g")
.attr("class", "context")
.attr("transform", "translate(" + margin2.left + "," + (margin2.top -100)+ ")");

var toggleNum = 0;

//Read the data
readAndDrawData = function (){
    fetch('/api/portrait_count_by_year').then(function(resp){
      return resp.json();
    }).then(function(data){
        data.map(type)
        
        x.domain(d3.extent(data, function(d) { return d.creation_year; }));
        y.domain([0, d3.max(data, function(d) { return d.count; })]);
        x2.domain(x.domain());
        y2.domain(y.domain());

        sliderTime
        .step(1000 * 60 * 60 * 24 * 365) // year
        .tickFormat(d3.timeFormat('%Y')) // year
        .min(d3.min(data.map(d => d.creation_year)))
        .max(d3.max(data.map(d => d.creation_year)))
        .default(d3.median(data.map(d => d.creation_year)))
        // .tickValues(data.map(d => d.creation_year))

        context.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area2);

        context.append("g")
        .attr("transform", "translate(0," + (height2 + 3) + ")")
        .call(sliderTime);

        d3.select('#warped-face').attr("src", get_image_url("year",median(data.map(d => d.creation_year)).getFullYear()));
    });
}

function type(d) {
    var date = new Date()
    date.setFullYear(d.creation_year);
    
    d.creation_year = date
    d.count = +d.count;
    return d;
}

function get_image_url(time_step, time){
    let base_url = "/static/img/"
    switch(time_step) {
        case "year":
          base_url += "yearly/" + time
          break;
        case "decade":
            base_url += "decade/" + time
          break;
        case "century":
            base_url += "century/" + time
          break;
        default:
            base_url += "no_portrait"
      }
    return base_url + ".jpg"
}

function median(values){
    if(values.length ===0) return 0;
  
    values.sort(function(a,b){
      return a-b;
    });
  
    var half = Math.floor(values.length / 2);
  
    if (values.length % 2)
      return values[half];
  
    return (values[half - 1] + values[half]) / 2.0;
  }

function set_portrait(time){

    let warpBoxBack = d3.select(`#usebox-svg-warped-face-2`);
    let warpBoxFront = d3.select(`#usebox-svg-warped-face-1`);
    let warpImageBack = d3.select(`#warped-face-2`)
    let warpImageFront = d3.select(`#warped-face-1`)
    let url = get_image_url("year",time);

    warpImageBack.attr("href", url).on("error", function() {
      warpImageBack.attr("href", "../static/img/missing_face.svg")
      url = "../static/img/missing_face.svg";
    });

    warpBoxFront.classed("crossfade", true);

    setTimeout(() => {
      warpImageFront.attr("href", url)
      warpBoxFront.classed("crossfade", false);
    }, 1000);
    
}
function dragged_debounce(d) {
    var year = d3.timeFormat('%Y')(d)
    set_portrait(year)
    d3.select('p#value-time').text(year);  
}

function debounceD3Event(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      var evt  = d3.event;

      var later = function() {
        timeout = null;
        if (!immediate) {
          var tmpEvent = d3.event;
          d3.event = evt;
          func.apply(context, args);
          d3.event = tmpEvent;
        }
      };

      var callNow = immediate && !timeout;
      var x = Math.min(d3.event.x, innerWidth);
      d3.select('.slider_debounce').attr('transform', 'translate(' + Math.max(0,Math.min(x, x-margin.left)) + ',' + 25 + ')');
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        var tmpEvent = d3.event;
        d3.event = evt;
        func.apply(context, args);
        d3.event = tmpEvent;
      }

    };
  }

readAndDrawData();