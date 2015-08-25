(function(ctx){
	/*
	*@param s: selector
	*@param a: name
	*@param b: value
	*/
	var removeClass = function(s,a,b){
		console.log(s);
		var txt = '', name, s, val,
			browser  = app.getBrowserInfo(),		
			selector = app.getSelector(s);
			console.log('s====='+s);
			
		var newArgs = [];			
		for (var i = 1; i < arguments.length;  i++) { //if  args containe an espace ex $(test).removeClass('tt pp   ')
			if(arguments[i].length != 0 && !/(\s)/.test(arguments[i])){
				newArgs.push(arguments[i]);
			}
		};

		if (newArgs.length <= 0 ) { // to remove all className ex: $('div').removeClass();
			var txt = 'var elem = '+ selector.name+';\n'+
					  'for(var k = 0; k < elem.length; k++){\n'+
					  		'\telem[k]'+".className = '';"
					   +'\n}'
		   ;

		}else{
			var output = '',args = '';

			for (var i = 0; i < newArgs.length; i++) {
				
				if (typeof newArgs[i] == 'function') { // if the param contain a function trow new exception
					return console.log('desole mais il n\'est pas possible de placer une function en paramettre a cette function.  astuce: declarer une variable qui contiendra la valeur de la function avant de faire le remove(maVariable). ou l\'erreur vient dailleur'
					);
				};

				args += (i !== (newArgs.length -1))? "'"+newArgs[i]+"'," : "'"+newArgs[i]+"'";
			};
			
			if (selector.type == 'tag' || selector.type == 'class') { // to remove some Class or Tags classList ex: $('#test')||$('span').removeClass('tt','pp');
				output += 'var elem = '+ selector.name+';\n'+
						  'for(var k = 0; k < elem.length; k++){\n'+
						  		'\telem[k]'+".classList.remove("+args+");"
						   +'\n}';
			}else{ // remove an Id classList
				output = selector.name+'.classList.remove('+args+');';
			}
			

			txt = output;
		};

		app.toString += txt + "\r";
		console.log(txt);
		return txt;
	};

	ctx.removeClass = removeClass;
	
})(app)
