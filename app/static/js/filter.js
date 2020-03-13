var filterJSParams = {};
// init
const age_groups = ["(0-2)", "(4-6)", "(8-12)", "(15-20)", "(25-32)", "(38-43)", "(48-53)", "(60-100)"];
const gender_groups = ["female", "male"];
const color_groups = [0, 1, 2, 3, 4, 5, 6, 7, 8];

filterJSParams['beginDate'] = 0;
filterJSParams['endDate'] = 2020;
filterJSParams['age'] = age_groups;
filterJSParams['gender'] = ["male", "female"];
filterJSParams['color'] = color_groups;
filterJSParams['selected_time'] = "YEAR"
filterJSParams['dimension'] = "none";
filterJSParams['dimension-value'] = "none";

// Hooks to update
filterJSParamsChangedHooks = [];
filterJSOnScrollHooks = [];
filterJSOnWindowLookHooks = [];

// Global Functions
var filterJSUpdate = function(param, value, skip=false) {
    filterJSParams[param] = value;
    if (!skip) {
        filterJSNotify(filterJSParams);
    }
    
}

var filterJSInitParamsChangedHook = function(callback) {
    filterJSParamsChangedHooks.push(callback);
    return filterJSParams;
}

var filterJSInitScrollHook = function(callback) {
    filterJSOnScrollHooks.push(callback);
}

var filterJSAddWindowLoadHook = function(callback) {
    filterJSOnWindowLookHooks.push(callback);
}

let filterJSNotify = function() {
    filterJSParamsChangedHooks.forEach(f => {
        f(filterJSParams);
    });
}

function displayDimensionFilter(dimensionValue) {

    if (!dimensionValue) {
        let dimensionSelect = document.getElementById("input-group-timeslider-dimension");
        dimensionValue = dimensionSelect.value;
        filterJSParams["dimension"] = dimensionValue;
    }

    let elems = document.querySelectorAll(".tab-pane-dimension");
    let newTargetId = `timeslider-dimension-list-${dimensionValue}`;
    let selectTargetId = `timeslider-dimension-list-select-${dimensionValue}`;
    

    elems.forEach((elem) => {
        if (elem.classList.contains("show") && elem.id != newTargetId) {
            elem.classList.remove("show")
            elem.classList.remove("active")
        }
    })
    let target = document.getElementById(newTargetId);
    if (target && !target.classList.contains("show")) {
        target.classList.add("show")
        target.classList.add("active")
    }

    // Set the select to first value
    let selectTarget = document.getElementById(selectTargetId);
    
    let newDimensionValue = "none";
    if (selectTarget) {
        selectTarget.selectedIndex = 0;
        newDimensionValue = selectTarget.value;
        // Deactivate the respective filter
    }

    let detailFilterId = `detailfilter-control-${dimensionValue}`;
    let detailFilterElems = document.querySelectorAll(`[id^='detailfilter-control']`)
    detailFilterElems.forEach((elem) => {
        if (elem.id == detailFilterId) {
            elem.disabled = true;
            $(function () {
                // Not nice, but works 🙈
                $(elem).selectpicker('refresh');
            });
        } else {
            elem.disabled = false;
            $(function () {
                // Not nice, but works 🙈
                $(elem).selectpicker('refresh');
            });
        }
    })

    filterJSUpdate("dimension-value", newDimensionValue);
}

// // functions for the age
function registerListener() {
    
    let dimensionSelect = document.getElementById("input-group-timeslider-dimension");
    dimensionSelect.onchange = function(ev) {
        filterJSUpdate("dimension", ev.target.value, skip=true)
        // hide all but the current selected
        displayDimensionFilter(ev.target.value);
    }

    document.getElementById("selectTimeButton").onchange = function(ev) {
        filterJSUpdate("selected_time", ev.target.value)
    }

    document.getElementById('detailfilter-control-age').onchange = function () {
        var elements = document.getElementById('detailfilter-control-age').selectedOptions;
        let selection = Array.prototype.slice.call(elements).map((element) => {
            return element.value
        });
        filterJSUpdate("age", selection);       
    };
}


function timesliderDimensionValueChanged(ev) {
    let value = ev.value;
    filterJSUpdate("dimension-value", value);

}

function buildAgeOptionList() {
    const groupSelect = document.getElementById('detailfilter-control-age');
    for (let i = 0; i < age_groups.length; i++) {
        var opt = document.createElement("option");
        opt.value = age_groups[i];
        opt.text = age_groups[i];

        groupSelect.appendChild(opt);
    }
}

function buildColorGroupOptionList() {
    const groupSelect = document.getElementById('detailfilter-control-gender');
    for (let i = 0; i < gender_groups.length; i++) {
        var opt = document.createElement("option");
        opt.value = gender_groups[i];
        opt.text = gender_groups[i];
        groupSelect.appendChild(opt);
    }
}

function buildGenderOptionList() {
    const groupSelect = document.getElementById('detailfilter-control-color-group');
    for (let i = 0; i < color_groups.length; i++) {
        var opt = document.createElement("option");
        opt.value = color_groups[i];
        opt.text = color_groups[i];
        groupSelect.appendChild(opt);
    }
}

function buildDimensionAgeOptionList() {
    const groupSelect = document.getElementById('timeslider-dimension-list-select-age');
    for (let i = 0; i < age_groups.length; i++) {
        var opt = document.createElement("option");
        opt.value = age_groups[i];
        opt.text = age_groups[i];

        groupSelect.appendChild(opt);
    }
}

let toggleFunction = function () {

    var bottomNav = document.getElementById('filter-nav-bar');
    if (!bottomNav) return;

    if (window.scrollY > (window.innerHeight * 0.9)) {
        // you're at the bottom of the page
        if (bottomNav.classList.contains('crossfade')) {
            bottomNav.classList.remove('crossfade');
            // alert("remove faq display!");
        }
    } else {
        if (!bottomNav.classList.contains('crossfade')) {
            bottomNav.classList.add('crossfade');
        }
    }
};

// Onload Event
window.onload = function(e){ 
    filterJSOnWindowLookHooks.forEach(f => {
        f();
    });
}

window.onscroll = function() {
    filterJSOnScrollHooks.forEach(f => {
        f();
    });
}

filterJSInitScrollHook(toggleFunction);
filterJSAddWindowLoadHook(toggleFunction);
filterJSAddWindowLoadHook(buildAgeOptionList);
filterJSAddWindowLoadHook(buildDimensionAgeOptionList);
filterJSAddWindowLoadHook(buildColorGroupOptionList);
filterJSAddWindowLoadHook(buildGenderOptionList);
filterJSAddWindowLoadHook(registerListener);
filterJSAddWindowLoadHook(displayDimensionFilter);

