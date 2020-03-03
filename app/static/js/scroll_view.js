var params = {}

params['beginDate'] = 0
params['endDate'] = 2020
params['beginAge'] = 0
params['endAge'] = 100
params['schools'] = []
params['female'] = true
params['male'] = true

// Color selection
const colorField = document.getElementById("colorselect")
function colorSelection(){
	renew_view()
	color = String(colorField.value).split('#')[1]
	console.log(color)
	params['color'] = color;
	get_images(index)
}

// Age selection
const ageSlider = document.getElementById("age_slider");
const ageRangeText = document.getElementById("ageRange");
ageRangeText.value = "0 - 100"; // place holder value

function ageSliderChange(){
	ageRangeText.value = age_slider.value.replace(",", " - ");
	renew_view();
}

const maleFilterBtn = document.getElementById("maleFilter");
var isMaleSelected = false;
// Male female filtering
function maleClick(){
	if(isMaleSelected){
		var selectedBtn = document.createAttribute("class");
		selectedBtn.value = "btn btn-outline-secondary";
		maleFilterBtn.setAttributeNode(selectedBtn)
		isMaleSelected = false
	} else{
		var selectedBtn = document.createAttribute("class");
		selectedBtn.value = "btn btn-secondary";
		maleFilterBtn.setAttributeNode(selectedBtn)	
		isMaleSelected = true
	}
	renew_view();
}

const femaleFilterBtn = document.getElementById("femaleFilter");
var isFemaleSelected = false;
function femaleClick(){
	if(isFemaleSelected){
		var selectedBtn = document.createAttribute("class");
		selectedBtn.value = "btn btn-outline-secondary";
		femaleFilterBtn.setAttributeNode(selectedBtn)
		isFemaleSelected = false
	} else{
		var selectedBtn = document.createAttribute("class");
		selectedBtn.value = "btn btn-secondary";
		femaleFilterBtn.setAttributeNode(selectedBtn)	
		isFemaleSelected = true
	}
	renew_view();
}

// Dropdown
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function dropdownClick() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
} 

// Continous scroll
get_images = function(index){

	var url = new URL('/api/images', 'http://localhost:5000')
	params['index'] = index;
	// var params = {lat:35.696233, long:139.570431} // or:
	// var params = [['lat', '35.696233'], ['long', '139.570431']]

	url.search = new URLSearchParams(params).toString();

	// console.log(par.length + " " +par)
	// for (var i = 0; i < par.length; i++) {
	// 	url.concat("&" +par[i] +"=" +par[i][0])
	// };
	console.log(url)
	fetch(url).then(function(resp) {
		return resp.json()
	}).then(function (data){
		for (var i = 0; i < data.length; i++) {
			var img = document.createElement("img");
			var container = document.createElement("div");
			img.src = data[i];

			var att = document.createAttribute("class");
			att.value = "imageClass img-thumbnail";
			img.setAttributeNode(att)

			var bootstrap = document.createAttribute("class");
			bootstrap.value = "col-md-3 my-1";
			container.setAttributeNode(bootstrap)

			container.appendChild(img)
			mainView.appendChild(container)
		};
	});	
}
const root_el = document.getElementById("example")
renew_view = function(){
	// reset index
	index = 0
	
	root_el.removeChild(document.getElementById("scroll"))
	create_scroll_container()

	get_images(index)
}
create_scroll_container = function(){
	// id="scroll" class="row"
	var container = document.createElement("div");
	container.id = "scroll"

	var row = document.createAttribute("class");	
	row.value = "row";
	container.setAttributeNode(row)
	root_el.appendChild(container);
	mainView = container;
}


var mainView = document.getElementById("scroll")
var index = 0;

window.onscroll = function(){
	var bottom_page = (document.body.offsetHeight - window.innerHeight);
	var scrollY = document.documentElement.scrollTop;

	if (scrollY >= bottom_page){
		index++;
		get_images(index)
		window.setTimeout(1000);
	}
}

get_images(index);