// Age selection
const ageSlider = document.getElementById("age_slider");
const ageRangeText = document.getElementById("ageRange");
ageRangeText.value = "0 - 100"; // place holder value

function ageSliderChange(){
	ageRangeText.value = age_slider.value.replace(",", " - ");
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
get_images = function(index, schouldClear){
	fetch('/api/images?index='+index).then(function(resp) {
		return resp.json()
	}).then(function (data){
		if (schouldClear) {
			while (mainView.childElementCount > 0){
				mainView.removeChild(mainView.children[0]) // todo not the buttons
			}
		};
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

const mainView = document.getElementById("scroll")
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