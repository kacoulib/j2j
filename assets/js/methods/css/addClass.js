jQuery['fn']['addClass'] = function(){
	var txt = '', name, s, val,
		browser  = app.getBrowserInfo(),		
		selector = app.getSelector('this.selector');
	console.log('argtype'+typeof arguments);
		arguments = arguments[0].split(' ');
		for (var i = 0; i < arguments.length;  i++) { //if  args containe an espace ex $(test).removeClass('tt pp   ')

			if(arguments[i].length == 0 || arguments[i].value == ""){
				arguments.splice(i,1);
				i=0;
			}
		};

	var output = '',args = '';

	for (var i = 0; i < arguments.length; i++) {
		
		if (typeof arguments[i] == 'function') { // if the param contain a function trow new exception
			return console.log('desole mais il n\'est pas possible de placer une function en paramettre a cette function.  astuce: declarer une variable qui contiendra la valeur de la function avant de faire le add(maVariable). ou l\'erreur vient dailleur'
			);
		};

		args += (i !== (arguments.length -1))? "'"+arguments[i]+"'," : "'"+arguments[i]+"'";
	};
	
	if (selector.type == 'tag' || selector.type == 'class') { // to add some Class or Tags classList ex: $('#test')||$('span').addClass('tt','pp');
		output += 'var elem = '+ selector.name+';\n'+
				  'for(var k = 0; k < elem.length; k++){\n'+
				  		'\telem[k]'+".classList.add("+args+");"
				   +'\n}';
	}else{ // add an Id classList
		output = selector.name+'.classList.add('+args+');';
	}
	

	txt = output;
	
	app.toString += txt + "\r";

	return this;
};

