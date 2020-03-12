var svg = d3.select("#face_view_svg");
let svg_width=svg.node().getBoundingClientRect().width;
let svg_height=svg.node().getBoundingClientRect().height;

let margin = {top: 20, right: 20, bottom: 110, left: 40};
let margin2 = {top: 30, right: 20, bottom: 50, left: 40};

let width = svg_width - margin.left - margin.right;
let height = svg_height ;
let height2 = svg_height;

var allTimeGroups = ["Year", "Decade", "Century", "All"]

d3.select("#selectTimeButton")
.selectAll('myOptions')
    .data(allTimeGroups)
.enter()
    .append('option')
.text(function (d) { return d; })
.attr("value", function (d) { return d.toUpperCase(); }) 

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

svg.append("defs").append("clipPath")
.attr("id", "clip")
.append("rect")
.attr("width", width)
.attr("height", height);

var context = svg.append("g")
.attr("class", "context")
.attr("transform", "translate(" + margin2.left + "," + (margin2.top -100)+ ")");

var path = context.append("path");
var slider_svg = context.append("g")
    .attr("transform", "translate(0," + (height2 + 3) + ")")
    .attr("class","sliderTime");

//Read the data
readAndDrawData = function (){
    let url = new URL('/api/portrait_count_by_params', 'http://localhost:5000')
    url.search = new URLSearchParams(filterJSParams).toString();
    console.log("call fetch data")
    fetch(url).then(function(resp){
      return resp.json();
    }).then(function(data){
        console.log("print data")
        console.log(data)
        if(filterJSParams['selected_time'] == "YEAR"){
            data.map(function(d){return map_to_datetime(d, filterJSParams['selected_time'])});
        
            x.domain(d3.extent(data, function(d) { return d.creation_year; }));
            y.domain([0, d3.max(data, function(d) { return d.count; })]);
            x2.domain(x.domain());
            y2.domain(y.domain());

            sliderTime
            .step(1000 * 60 * 60 * 24 * 365) // year
            .tickFormat(d3.timeFormat('%Y')) // year
            .min(d3.min(data.map(d => d.creation_year)))
            .max(d3.max(data.map(d => d.creation_year)))
            .default(data.map(d => d.creation_year).find(x => x.getFullYear() == 1850))
            
            var area2 = d3.area()
                .curve(d3.curveMonotoneX)
                .x(function(d) { return x2(d.creation_year); })
                .y0(height2)
                .y1(function(d) { return y2(d.count); });

            path.datum(data)
            .attr("class", "area")
            .attr("d", area2);

            slider_svg
            .call(sliderTime);
            
            d3.select('#warped-face').attr("src", get_image_url(filterJSParams['selected_time'], 1850))
            set_portrait(1850)
        } else if(filterJSParams['selected_time'] == "DECADE"){
            data.map(function(d){return map_to_datetime(d, filterJSParams['selected_time'])});
            
            x.domain(d3.extent(data, function(d) { return d.decade; }));
            y.domain([0, d3.max(data, function(d) { return d.count; })]);
            x2.domain(x.domain());
            y2.domain(y.domain());

            sliderTime
            .step(1000 * 60 * 60 * 24 * 365 * 10) // decade
            .tickFormat(d3.timeFormat('%Y')) // year
            .min(d3.min(data.map(d => d.decade)))
            .max(d3.max(data.map(d => d.decade)))
            .default(data.map(d => d.decade).find(x => {x.getFullYear() == 1850}))
            
            var area2 = d3.area()
                .curve(d3.curveMonotoneX)
                .x(function(d) { return x2(d.decade); })
                .y0(height2)
                .y1(function(d) { return y2(d.count); });

            path.datum(data)
            .attr("class", "area")
            .attr("d", area2);

            slider_svg
            .call(sliderTime);
            
            d3.select('#warped-face').attr("src", get_image_url(filterJSParams['selected_time'], 1850))
            set_portrait(1850)
        } else if(filterJSParams['selected_time'] == "CENTURY"){
            console.log("century")
        } else if(filterJSParams['selected_time'] == "ALL"){
            console.log("all")
        }
    });
}

function map_to_datetime(data, date_type) {
    var date = new Date()
    switch(date_type) {
        case "YEAR":
            date.setFullYear(data.creation_year);
            data.creation_year = date
            data.count = +data.count;
          break;
        case "DECADE":
            date.setFullYear(data.decade);
            data.decade = date
            data.count = +data.count;
          break;
        case "CENTURY":
            break;
        case "ALL":
            break;
        default:
          // code block
      }
    return data;
}

function get_image_url(time_step, time){
    let base_url = "/static/img/"
    switch(time_step) {
        case "YEAR":
          base_url += "yearly/" + time
          break;
        case "DECADE":
            base_url += "decade/" + time
          break;
        case "CENTURY":
            base_url += "century/" + time
          break;
        default:
            base_url += "no_portrait"
      }
    return base_url + ".jpg"
}

function set_portrait(time){

    let warpBoxBack = d3.select(`#usebox-svg-warped-face-2`);
    let warpBoxFront = d3.select(`#usebox-svg-warped-face-1`);
    let warpImageBack = d3.select(`#warped-face-2`)
    let warpImageFront = d3.select(`#warped-face-1`)
    let url = get_image_url(filterJSParams['selected_time'],time);

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

d3.select("#selectTimeButton").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option

    //FIXME
    // filterJSParams['selected_time'] = selectedOption; // ALL, CENTURY, DECADE, YEAR
    readAndDrawData();
})


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
var updateView = function(filterJSParams) {
      readAndDrawData();
      console.log("renew");
}

filterJSInitParamsChangedHook(updateView);