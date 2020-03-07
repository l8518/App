
var svg = d3.select("#face_view_svg"),
margin = {top: 20, right: 20, bottom: 110, left: 40},
margin2 = {top: 430, right: 20, bottom: 50, left: 40},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom,
height2 = +svg.attr("height") - margin2.top - margin2.bottom;

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

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
.attr("class", "context")
.attr("transform", "translate(" + margin2.left + "," + (margin2.top -100)+ ")");


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

        focus.append("svg:image")
        .attr("id", "prev")
        .attr('x', (width/2) - 125)
        .attr('y', 0)

        focus.append("svg:image")
        .attr("id", "curr")
        .attr('x', (width/2) - 125)
        .attr('y', 0)
        .attr("xlink:href", get_image_url("year",median(data.map(d => d.creation_year)).getFullYear()))
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
    d3.select('image#prev').attr("xlink:href", document.getElementById('curr').href.baseVal)
    d3.select('image#curr').attr("xlink:href", get_image_url("year",time))
    .on("error", function() {
        d3.select('image').attr("xlink:href", get_image_url(null, time))
        d3.select('image#prev').attr("class","transparent")
      });
    d3.select('image#prev').attr("class","transparent")
    
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