fetch('/api/images').then(function(resp) {
	return resp.json()
}).then(function (data){
	for (var i = 0; i < data.length; i++) {
		var img = document.createElement("img");
		var container = document.createElement("div");
		img.src = data[i];

		var att = document.createAttribute("class");
		att.value = "imageClass";
		img.setAttributeNode(att)

		var bootstrap = document.createAttribute("class");
		bootstrap.value = "col-md-3 my-1";
		container.setAttributeNode(bootstrap)

		container.appendChild(img)
		mainView.appendChild(container)
	};
});

const mainView = document.getElementById("scroll")
