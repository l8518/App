var params = {}

const age_groups = ["(0-2)", "(4-6)", "(8-12)", "(15-20)", "(25-32)", "(38-43)", "(48-53)", "(60-100)"];
const school_types = [
    'Danmark',
    'Deutschland, Europe',
    'España',
    'France métropolitaine, France',
    'Great Britain, Richmondshire, North Yorkshire, Yorkshire and the Humber, England, UK',
    'Italia',
    'Magyarország',
    'Nederland',
    'Other, Corozal, Corozal District, Corozal, 0000, Belize',
    'Russian, Municipio Benítez, Sucre, Venezuela',
    'Schweiz/Suisse/Svizzera/Svizra',
    'United States of America',
    'american',
    'austrian',
    'belgian',
    'bohemian',
    'british',
    'catalan',
    'central',
    'chinese',
    'danish',
    'dutch',
    'english',
    'flemish',
    'french',
    'german',
    'greek',
    'hungarian',
    'india',
    'irish',
    'italian',
    'japanese',
    'korean',
    'modern',
    'nepal',
    'netherlandish',
    'norwegian,',
    'other',
    'polish',
    'portuguese',
    'roman',
    'russian',
    'scottish',
    'south',
    'spanish',
    'swedish',
    'swiss',
    'thailand',
    'tibet',
    'unknown',
    'western',
    'Österreich'
];

params['beginDate'] = 0;
params['endDate'] = 2020;
params['age'] = age_groups;
params['schools'] = school_types;
params['female'] = true;
params['male'] = true;

// Color selection
const colorField = document.getElementById("colorselect");

function colorSelection() {
    renew_view();
    color = String(colorField.value).split('#')[1];
    console.log(color);
    params['color'] = color;
    get_images(index)
}

document.getElementById('ageGroupSelect').onchange = function () {
    var elements = document.getElementById('ageGroupSelect').selectedOptions;
    params['age'] = Array.prototype.slice.call(elements).map((element) => {
        return element.value
    });
    renew_view();
};


document.getElementById('schoolGroupSelect').onchange = function () {
    var elements = document.getElementById('schoolGroupSelect').selectedOptions;
    params['schools'] = Array.prototype.slice.call(elements).map((element) => {
        return element.value
    });
    renew_view();
};


var isMaleSelected = false;

function bothClick() {
    isFemaleSelected = true;
    isMaleSelected = true;
    renew_view();
}

// Male female filtering
function maleClick() {
    isFemaleSelected = false;
    isMaleSelected = true;
    renew_view();
}

var isFemaleSelected = false;

function femaleClick() {
    isFemaleSelected = true;
    isMaleSelected = false;
    renew_view();
}

function buildSchoolsOptionList() {
    const groupSelect = document.getElementById('schoolGroupSelect')
    for (let i = 0; i < school_types.length; i++) {
        var opt = document.createElement("option");
        // var container = document.createElement("div");
        opt.value = school_types[i];
        if (school_types[i] === 'Great Britain, Richmondshire, North Yorkshire, Yorkshire and the Humber, England, UK') {
            opt.text = 'Great Britain';
        } else {
            opt.text = school_types[i];
        }

        groupSelect.appendChild(opt);
    }
}

buildSchoolsOptionList();

// todo use this to build a multiselect that is searchable?
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
get_images = function (index) {

    var url = new URL('/api/images', 'http://localhost:5000')
    params['index'] = index;

    url.search = new URLSearchParams(params).toString();

    console.log(url)
    fetch(url).then(function (resp) {
        return resp.json()
    }).then(function (data) {
        for (var i = 0; i < data.length; i++) {
            var img = document.createElement("img");
            var container = document.createElement("div");
            img.src = data[i];

            var att = document.createAttribute("class");
            att.value = "imageClass img-thumbnail";
            img.setAttributeNode(att);

            var bootstrap = document.createAttribute("class");
            bootstrap.value = "col-md-3 my-1";
            container.setAttributeNode(bootstrap);

            container.appendChild(img);
            mainView.appendChild(container);
        }
    });
};
const root_el = document.getElementById("example")
renew_view = function () {
    // reset index
    index = 0;

    root_el.removeChild(document.getElementById("scroll"))
    create_scroll_container()

    get_images(index)
};
create_scroll_container = function () {
    // id="scroll" class="row"
    var container = document.createElement("div");
    container.id = "scroll"

    var row = document.createAttribute("class");
    row.value = "row";
    container.setAttributeNode(row)
    root_el.appendChild(container);
    mainView = container;
};


var mainView = document.getElementById("scroll")
var index = 0;

window.onscroll = function () {
    var bottom_page = (document.body.offsetHeight - window.innerHeight);
    var scrollY = document.documentElement.scrollTop;

    if (scrollY >= bottom_page) {
        index++;
        get_images(index);
        window.setTimeout(1000);
    }
};

get_images(index);