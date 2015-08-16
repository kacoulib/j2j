var elem = document.getElementById('message'),
	myTimer = setInterval(function(){timer()},100),
	time = 30;

function timer(){
		if(time >= 0){
			
			console.log(time--);
		}else{

			elem.text = '';
			console.log(elem);
			return clearInterval(time);

		} 
	}

			clearInterval(timer);
if (elem.text != '' || elem.text != 'undefined') {
	
};

