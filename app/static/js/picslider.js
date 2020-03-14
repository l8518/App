var width = 750;
var height = 120;
var margin = { top: 0, right: 50, bottom: 10, left: 40 };
var padding = 0.1;

var allTimeGroups = ["Year", "Decade", "Century", "All"]

//create dropdown
d3.select("#selectTimeButton")
.selectAll('myOptions')
    .data(allTimeGroups)
.enter()
    .append('option')
.text(function (d) { return d; })
.attr("value", function (d) { return d.toUpperCase(); }) 

//Read the data
readAndDrawData = function (){
    let url = new URL('/api/portrait_count_by_params', 'http://localhost:5000')
    url.search = new URLSearchParams(filterJSParams).toString();
    fetch(url).then(function(resp){
      return resp.json();
    }).then(function(data){
      update_pic_slider(data)
    });
}

function map_data(data, time_type) {
    switch(time_type) {
        case "YEAR":
            data.time = data.creation_year
            data.count = +data.count;
          break;
        case "DECADE":
            data.time = data.decade
            data.count = +data.count;
          break;
        case "CENTURY":
            data.time = data.century
            data.count = +data.count;
            break;
        case "ALL":
            data.time = data.period
            data.count = +data.count;
            break;
        default:
          break;
      }
    return data;
}

function update_pic_slider(data){
  const time_slider = document.getElementById("time_slider")
  const childs = time_slider.childNodes[0]
  if(childs != undefined)childs.remove();

  init_pic_slider(data)
}

function init_pic_slider(data){
  const svg = d3.select("#time_slider")
        .append("svg")
        .attr("class", "w-100 h-100")
        .attr("viewport", "0 0 960 450")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
  
  if (filterJSParams['selected_time'] == "ALL"){
    return;
  }

  data.map(function(d){return map_data(d, filterJSParams['selected_time'])});
  var xBand = d3
      .scaleBand()
      .domain(data.map(d => d.time))
      .range([margin.left, width - margin.right])
      .padding(padding);

  var xLinear = d3
      .scaleLinear()
      .domain([
      d3.min(data, d => d.time),
      d3.max(data, d => d.time),
      ])
      .range([
      margin.left + xBand.bandwidth() / 2 + xBand.step() * padding - 0.5,
      width -
          margin.right -
          xBand.bandwidth() / 2 -
          xBand.step() * padding -
          0.5,
      ]);

  var y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.count)])
      .nice()
      .range([height - margin.bottom, margin.top]);

  var yAxis = g => g.attr('transform', `translate(${width - margin.right},0)`)
      .call(d3
          .axisRight(y)
          .tickValues([1e4])
          .tickFormat(d3.format('($.2s'))
      )
      .call(g => g.select('.domain').remove());

  var bars = svg
  .append('g')
  .selectAll('rect')
  .data(data);

  var barsEnter = bars
      .enter()
      .append('rect')
      .attr('x', d => xBand(d.time))
      .attr('y', d => y(d.count))
      .attr('height', d => y(0) - y(d.count))
      .attr('width', xBand.bandwidth());

  var draw = selected => {
    barsEnter
    .merge(bars)
    .attr('fill', d => (d.time === selected ? '#bad80a' : '#e0e0e0'));      
  };

  var slider;
  var time;
  // Time dependent
  if(filterJSParams['selected_time'] == "YEAR"){
      time=1650
      slider = g => g.attr('transform', `translate(0,${height - margin.bottom})`).call(d3
              .sliderBottom(xLinear)
              .step(1)
              .ticks(10)
              .default(time)
              .on('onchange', value => draw(value))
              .on('drag', debounceD3Event(dragged_debounce,200))
          );
  } else if(filterJSParams['selected_time'] == "DECADE"){
    time = 1650
    slider = g => g.attr('transform', `translate(0,${height - margin.bottom})`).call(d3
              .sliderBottom(xLinear)
              .step(10)
              .ticks(10)
              .default(time)
              .on('onchange', value => draw(value))
              .on('drag', debounceD3Event(dragged_debounce,200))
          );
  }else if(filterJSParams['selected_time'] == "CENTURY"){
    time=19
    slider = g => g.attr('transform', `translate(0,${height - margin.bottom})`).call(d3
              .sliderBottom(xLinear)
              .step(1)
              .ticks(5)
              .default(19)
              .on('onchange', value => draw(value))
              .on('drag', debounceD3Event(dragged_debounce,200))
          );
  } else{
    
  }
  draw(time);
  set_portrait(time)
  
  svg.append('g').call(yAxis);
  svg.append('g').call(slider);
}

function get_image_url(time){
    let base_url = "/static/img/"
    switch(filterJSParams['selected_time']) {
        case "YEAR":
          base_url += "yearly/" + time
          break;
        case "DECADE":
            base_url += "decade/" + Math.floor(time / 10)
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
    let url = get_image_url(time);

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
    set_portrait(d)
    // d3.select('p#value-time').text(year);  
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

filterJSInitParamsChangedHook(() => {
  console.log("init")
  readAndDrawData();
});