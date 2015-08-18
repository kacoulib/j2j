// log animations
(function(){
	var logs = document.querySelectorAll('#historyc >li'),
	last=null;
	for (var i = 0; i< logs.length; i++) {
		(function(i){
			logs[i].addEventListener('click',function(){
				if(last != null){
					logs[last].querySelector('ul').style.display = 'none'
					logs[last].style.backgroundColor = 'inherit'
					logs[last].querySelector('ul').style.backgroundColor = 'inherit'
				};
				this.querySelector('ul').style.display = 'block';
				this.style.backgroundColor = 'cadetblue';
				this.querySelector('ul').style.backgroundColor = 'cadetblue';
				last = i;
			});
		})(i);
	};
})();

