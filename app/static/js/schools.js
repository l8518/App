get_schools = function(){
	fetch("/api/school_types")
	.then(resp => { return resp.json()})
    .then(data => {
    	console.log(data);
    });
}

create_overview = function(data) {
	// d3.select("")
}

get_schools();