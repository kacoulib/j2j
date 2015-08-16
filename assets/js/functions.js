


// analystics
function is_my_home(){
	if (window.location.pathname == '/j2j/' || window.location.pathname == '/') {
		var selects = {
			'event' : 'formSubmit', 
			'label' : 'Minify', 
			'checked' : document.getElementById("form_mimifier").checked
		};
		dataLayer.push(selects);
		submit.onclick = function(e){e.preventDefault();};
	};
}