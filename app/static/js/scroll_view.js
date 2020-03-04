var params = {};
// init
const age_groups = ["(0-2)", "(4-6)", "(8-12)", "(15-20)", "(25-32)", "(38-43)", "(48-53)", "(60-100)"];

params['beginDate'] = 0;
params['endDate'] = 2020;
params['age'] = age_groups;
params['female'] = true;
params['male'] = true;

// Color selection
const colorField = document.getElementById("colorselect");

function colorSelection() {
    renew_view();
    color = String(colorField.value).split('#')[1];
    params['color'] = color;
    get_images(index)
}

// Age selection
document.getElementById('ageGroupSelect').onchange = function () {
    var elements = document.getElementById('ageGroupSelect').selectedOptions;
    params['age'] = Array.prototype.slice.call(elements).map((element) => {
        return element.value
    });
    renew_view();
};


function buildAgeOptionList() {
    const groupSelect = document.getElementById('ageGroupSelect');
    for (let i = 0; i < age_groups.length; i++) {
        var opt = document.createElement("option");
        opt.value = age_groups[i];
        opt.text = age_groups[i];

        groupSelect.appendChild(opt);
    }
}

buildAgeOptionList();

function bothClick() {
    params['female'] = true;
    params['male'] = true;

    renew_view();
}

// Male female filtering
function maleClick() {
    params['female'] = false;
    params['male'] = true;

    renew_view();
}

function femaleClick() {
    params['female'] = true;
    params['male'] = false;

    renew_view();
}

// Continuous scroll
get_images = function (index) {

    var url = new URL('/api/images', 'http://localhost:5000')
    params['index'] = index;

    url.search = new URLSearchParams(params).toString();

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