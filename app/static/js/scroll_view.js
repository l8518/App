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
            const div = document.createElement("div");
            const titleEl = document.createElement("h5");
            const p1 = document.createElement("p");
            const p2 = document.createElement("p");

            const title = document.createTextNode(data[i]['artwork_name']);
            const artist = document.createTextNode(data[i]['artist_full_name']);
            const creation_year = document.createTextNode(data[i]['creation_year']);

            titleEl.appendChild(title);
            p1.appendChild(artist);
            p2.appendChild(creation_year);

            div.appendChild(titleEl);
            div.appendChild(p1);
            div.appendChild(p2);

            var textImageOverlay = document.createAttribute("class");
            textImageOverlay.value = "textImageOverlay img-thumbnail";
            div.setAttributeNode(textImageOverlay);

            var img = document.createElement("img");
            var container = document.createElement("div");
            img.src = data[i]['image_url'];
            console.log(data[i]);

            var att = document.createAttribute("class");
            att.value = "imageClass img-thumbnail";
            img.setAttributeNode(att);

            var bootstrap = document.createAttribute("class");
            bootstrap.value = "col-md-3 my-1 imageContainer";
            container.setAttributeNode(bootstrap);

            container.appendChild(img);
            container.appendChild(div);
            mainView.appendChild(container);
        }
    });
};

const root_el = document.getElementById("example");
renew_view = function () {
    // reset index
    index = 0;

    root_el.removeChild(document.getElementById("scroll"));
    create_scroll_container();

    get_images(index);
};

create_scroll_container = function () {
    var container = document.createElement("div");
    container.id = "scroll";

    var row = document.createAttribute("class");
    row.value = "row";
    container.setAttributeNode(row);
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