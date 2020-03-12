
// Continuous scroll
get_images = function (index) {
    var url = new URL('/api/images', 'http://localhost:5000')
    filterJSParams['index'] = index;

    url.search = new URLSearchParams(filterJSParams).toString();

    fetch(url).then(function (resp) {
        return resp.json()
    }).then(function (data) {
        for (let i = 0; i < data.length; i++) {

            const textOverlay = document.createElement("div");
            const textDiv = document.createElement("div");

            const titleEl = document.createElement("h6");
            const p1 = document.createElement("p");
            const p2 = document.createElement("p");

            const title = document.createTextNode(data[i]['artwork_name']);
            const artist = document.createTextNode(data[i]['artist_full_name']);
            const creation_year = document.createTextNode(data[i]['creation_year']);

            titleEl.appendChild(title);
            p1.appendChild(artist);
            p2.appendChild(creation_year);

            textDiv.appendChild(titleEl);
            textDiv.appendChild(p1);
            textDiv.appendChild(p2);

            const text = document.createAttribute("class");
            text.value = "text";
            textDiv.setAttributeNode(text);

            const textImageOverlay = document.createAttribute("class");
            textImageOverlay.value = "textImageOverlay";
            textOverlay.setAttributeNode(textImageOverlay);

            textOverlay.appendChild(textDiv);

            const img = document.createElement("img");
            const att = document.createAttribute("class");
            att.value = "imageClass"; // img-thumbnail
            img.setAttributeNode(att);

            const container = document.createElement("div");
            img.src = data[i]['image_url'];

            const bootstrap = document.createAttribute("class");
            bootstrap.value = "col-4 col-md-3 col-lg-2 my-1 imageContainer";
            container.setAttributeNode(bootstrap);

            container.appendChild(img);
            container.appendChild(textOverlay);

            mainView.appendChild(container);
        }
    });
};

const root_el = document.getElementById("example");
renew_view = function () {
    // TODO should redraw all components
    // fetch_color_dist_data();

    // reset index
    index = 0;

    let elem = document.getElementById("scroll");

    elem.innerHTML = null;

    get_images(index);
};

var mainView = document.getElementById("scroll")
var index = 0;

var scrollViewScrollHook = function () {
    var bottom_page = (document.body.offsetHeight - window.innerHeight);
    var scrollY = document.documentElement.scrollTop;

    if (scrollY >= bottom_page) {
        index++;
        get_images(index);
        window.setTimeout(1000);
    }
};

var updateView = function(params) {
    renew_view();
    console.log("renew");
}

filterJSInitParamsChangedHook(updateView);
filterJSInitScrollHook(scrollViewScrollHook);

get_images(index);