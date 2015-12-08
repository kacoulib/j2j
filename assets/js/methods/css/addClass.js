(function (ctx)
{
	var addClass = function ()
	{
		var txt = '', name, val,
			browser  = ctx.getBrowserInfo(),		
			selector = ctx.selector;
			
		var newArgs = [];			
		for (var i = 1; i < arguments.length;  i++)
		{ //if  args containe an espace ex $(test).removeClass('tt pp   ')
			if (arguments[i].length != 0 && !/(\s)/.test(arguments[i]))
			{
				newArgs.push(arguments[i]);
			}
		};

		var output = '',args = '';

		for (var i = 0; i < newArgs.length; i++)
		{
			
			if (typeof newArgs[i] == 'function')
			{ // if the param contain a function trow new exception
				return console.log('desole mais il n\'est pas possible de placer une function en paramettre a cette function.  astuce: declarer une variable qui contiendra la valeur de la function avant de faire le add(maVariable). ou l\'erreur vient dailleur'
				);
			};
			args += (i !== (newArgs.length -1))? "'"+newArgs[i]+"'," : "'"+newArgs[i]+"'";
		};
		
		if (selector.type == 'tag' || selector.type == 'class')
		{ // to add some Class or Tags classList ex: $('#test')||$('span').addClass('tt','pp');
			output += 'var elem = '+ selector.name+', k;\n'+
					  'for(k = 0; k < elem.length; k++){\n'+
					  		'\telem[k]'+".classList.add("+arguments[0]+");"
					   +'\n}';
		}
		else
		{ // add an Id classList
			output = selector.name+'.classList.add('+arguments[0]+');';
		}
		

		txt = output;
		

		return txt;
	}
	ctx.addClass = addClass;
})(app)

