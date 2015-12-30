"use strict";
var app = 
{

	/** 
	 * @Resume: autoload the filed needeed depending on the script
	 * @var implemant 	 (obj) : all method that has been implement  
	 * @var notImplement (obj) : all methods that hasen't been implemente yet
	 * @var declaredVar  (arr) : all varibles declared 
	 * @var toLoad		 (arr) : all method that has been in the script to convert
	 * @var fileLoaded	 (arr) : contain loaded file names
	 * @var selector	 (obj) : show the name and the tranlating jquery selector
	 * @var code		 (arr) : is the code to translate	
	*/
	implemant    : {'css':{'type' : 'methods','namespace' : 'css','fileName' : 'css'},
					'addClass':{'type' : 'methods','namespace' : 'css','fileName' : 'addClass'}, 
					'removeClass':{'type' : 'methods','namespace' : 'css','fileName' : 'removeClass'}},
	notImplement : {},
	declaredVar  : [],
	toLoad		 : [],
	fileLoaded	 : [],
	selector 	 : {name : '', type : ''},
	code 		 : '',
	codeSplited	 : [],

	init: function (code)
	{
		this.resetAll(); // reset all properties 
      	this.code = code;
      	this.preLoad(code); // load all required files
        this.splitCode(0); // convert all jquery code to js
        // this.convert(); // convert all jquery code to js
        this.getDeclaredVariables(code); // extract all variables
        this.getString();
	},

	/** 
	* @Resume : loading animation
	*/
	animLoading: function ()
	{
		loading.style.width += (parseInt(loading.style.width)+10)+'px';
		// console.log(loading.style.width);
	},
	
	/** 
	 * @Resume : autoload the filed needeed depending on the script
	*/
	autoload: function ()
	{
		var i,
		file;
		
		for (i = 0; i < this.toLoad.length; i++)
		{
			file = this.toLoad[i].substring(1);
			if (file in this.implemant && this.fileLoaded.indexOf(file) < 0 && !this[file])
			{
				var script  = document.createElement('script');
				script.type = 'text/javascript'; 
				script.src  = 'assets/js/'+this.implemant[file].type+'/'+
					this.implemant[file].namespace+'/'+this.implemant[file].fileName+'.js';
				script.async = true;
				document.body.appendChild(script);
				app.fileLoaded.push(file);
				// msg.sucess('autoload',file);
			}
			else
			{
				app.setHistoric('error','auto load',file);
				// msg.warning('autoload','erreur fichier .'+file+' deja été implemanté');
			}
		}
		return;
	},

	/** 
	 * @Resume : remove dash and uppercase the first caractere
	  	ex: test-one => testOne 
	*/
	camelCase: function (elem)
	{
		if (!(elem.indexOf('-') > -1)) return elem;

		var part = elem.split('-'), pp, i;

		// console.log('camelCase: '+elem);
		if (part.length != 1)
		{
			pp = part[0];

			for (i = 1; i < part.length; i++)
			{
				if (part[i] != 'undefined')
					pp += part[i].charAt(0).toUpperCase()+part[i].slice(1);
			}

			return pp;
		}
		return elem;
	},

	/** 
	 * @Resume : convert the jquey method depending on this.codeSplited
	  	ex: store they index in this.jqIndex
	*/
	convert: function ()
	{
		var i = this.codeSplited.length - 1;
		var arr = this.codeSplited.reverse();
		arr.map((x, a)=>{
			console.log(a+'\n'+this[x['method']]())
		})
	},

	
	/** 
	* @Resume : get the browser information
	*/
	getBrowserInfo: function ()
	{
		// var browser = $.browser, 
		//   	version = browser['version'];
		
		// if ('chrome' in browser || 'webkit' in browser) 
		// {
		//  	browser = 'webkit'; // if chrome

		// }else if('mozilla' in browser)
		// {
			
		//  	if (version >= 13)
		// 	{
		//  		browser = 'moz'; // if mozilla

		//  	}
		// }else if (version <= 12 && version >=10)
		// {
		//  	browser = 'noPrefix'; // if ie >=10

		// }else
		// {
		//  	browser = 'ms'; // if ie <=10
		// }

		// console.log('getBrowserInfo');
		// return {'name' : browser, 'version' : version};
	},

	/** 
	 * @Resume : get all declared varible		
	 * @var rgxMatch 	: extract all declaration variables ex: var t = 0, p, ii = 1;
	 * @var rgxNoExtra  : containe the declared var with no ,;var	
	 * @var rgxfinal    : containe the varible and his value   		
	 * @var note 		: the value of rgxfinal is push in this.declaredVar
	*/
	getDeclaredVariables: function (code)
	{
		var rgxMatch, rgxNoExtra = [], rgxfinal, i, j;
		rgxMatch = code.match(/var (.*);/g); // extract all declaration variables   ex: var t = 0, p, ii = 1;
		// console.log(rgxMatch)
		
		if (rgxMatch != null)
		{
	        for (i = 0; i < rgxMatch.length; i++)
	        {
	        	rgxMatch[i] = rgxMatch[i].split('var ')[1];
	        	rgxNoExtra.push(rgxMatch[i].split(/[,;]/g)); // remove at all ;,var
	        }
		// msg.table(rgxMatch);
	        for (i = 0; i< rgxNoExtra.length; i++)
	        {
	            for (j = 0; j < rgxNoExtra[i].length; j++)
	            {
	              if (typeof rgxNoExtra[i][j] !== 'undefined' && rgxNoExtra[i][j] !== '' && rgxNoExtra[i][j] !==
	               ' ')
	              { // if it's not empty or undefined or just a space
	                rgxfinal = rgxNoExtra[i][j].split('='); // re-spit at the = to get keys. and values an justget ['t','0'] ['p'] ['ii','1']
	                this.declaredVar.push(rgxfinal);
	              }
	            }
	        }
        // msg.table(this.declaredVar);

		};
		this.setHistoric('document','declared variable',this.declaredVar);
	},

	/** 
	 * @Resume : get the selector,
	 * @var s (str): selector type ex '.' || '#'  
	 * @var name (str): selector name ex test  
	 * @var selector (str): the result of the javascript equivalante ex document.getElementbyId('test')  
	 * @var type (str) : the type of the selector ex id, class, tag 
	 * @var return (obj) : {selctor, length, type} 
   	*/
	getSelector: function (selec)
	{
		selec = selec.slice(2, -1);
		var s 		 		= /[:*,>+~\[=$^]/.test(selec),
			name 	 		= selec.slice(1),
			selector 		= 'document.',
			selectorLength  = 0,
			type 			= '';

		s = (s == true ? s : (/(\S)+(\s)+(\S)/.test(selec)? true : selec[1]));
		if (s === true)
		{// if it's a css quey selector ex p:first || p > .test 
			type = 'tag';
			selector += 'querySelectorAll('+selec+')';
			this.selector.name = selector;
			this.selector.type = type;
			return;
		}
		
		if (s === '#')
		{
			selector 	   += "getElementById('"+name.slice(1)+")";
			type = 'id';
		}
		else if(s == '.')
		{
			selector 	   += "getElementsByClassName("+name.slice(1)+")";
			type = 'class';
		}
		else
		{
			type = 'tag';
			console.log(typeof selec +' type ' + selec)
			selector 	   += "querySelectorAll("+selec+")";
		}

		this.selector.name = selector;
		this.selector.type = type;
	},

	/** 
	* @Resume : get the result,
   	*/
	getString: function ()
	{
		if (this.code.length != 0)
		{
			text_jav.value = this.code;
			text_jav.select();

			// console.log('getString');
			return this.code;
		}
	},

	/** 
	* @Resume : detect if the string containe a function
	* verify from an index if there's a function(){} or ()=> or x=>; after a fucntion
	*/
	hasFunction: function (param)
	{
		return /function(\s?)+\((.?)+\)(\s?)+\{|\((\S?)+(\s?)\)+(\s?)+(=>|\{)/.test(param);
	},

	/** 
	* @Resume : detect if there'is a chaining or not
	* verify from an index if there's a '.Method' after a fucntion
	*/
	isChaining: function (i)
	{
		return /^(\s?)+\.(\S)+\(/.test(this.code.substring(i));
	},

	/** 
	* @Resume : detect if there'is a chaining or not
	* verify from an index if there's a '.Method' after a fucntion
	*/
	isFunction: function (elem)
	{
		return /^(\s*)function(\s*)\((.*)\)(\s*)\{/.test(elem);
	},

	/** 
	* @Resume : detect if the param is an variable
	* verify from an declaredVar
	*/
	isVarible: function (elem)
	{
		return (this.declaredVar.indexOf(elem) >= 0)? true : false;
	},

	/** 
	* @Resume : add a piece of code after an action
	* ex : if there's a chaining declar a varible(selector) to use
	*/
	after: function (code)
	{

	},

	/** 
	* @Resume : add a piece of code before an action
	* ex : if there's a chaining declar a varible(selector) to use
	*/
	befor: function (code)
	{

	},

	/** 
	 * @Resume : find all proprety, method in the converting script that have to be autoload
	*/
	preLoad: function (file)
	{
		var patern = '.css|.addClass|.removeClass',
		reg = new RegExp(patern, "g");
		this.toLoad = this.code.match(reg);

		if (this.toLoad.length > 0)
		{
			this.autoload();
		}
		else
		{
			msg.warning('sory but no method jquery found');
		}
		msg.sucess('funded methods',this.toLoad)
	},

	/** 
	 * @Resume : reset variblable that should be declared only in app

	*/
	resetAll: function ()
	{
		this.notImplement =  {};
		this.declaredVar  =  [];
		this.toLoad		 =  [];
		this.fileLoaded	 =  [];
		this.selector 	 =  {name : '', type : ''},
		this.code 		 =  '';
		this.codeSplited	 =  [];
	},
	
	/** 
	 * @Resume : replace the jquery code by the native code
	*/
	replaceFrom: function (start, end, javascript)
	{
		var jquery = this.code.substring(start, end);
		this.code = this.code.replace(jquery, javascript);
		return javascript.length;
	},



	/** 
	 * @Resume : add to the the information in the Hitoric(debug) 
	 * @param p  (str) : the parent of the element (app|document|window|error)
	 * @param n  (str) : the name of the element 
	 * @param v  (str) : the value of the element
	 note 	 : create a list of element. if the name already  exist just create the value in the name.
   */
	setHistoric: function (p,n,v)
	{//(parent,name,value)
		// var id, name, result;
		
		// p = '#history_'+p+' ul';
		// id = n.split(' ');
		// id = id.join('_');

		// console.log('setHistoric: '+p+n+v);
		// if ($(p).children('#'+id).length == 0) {// if the name don't exist 
		// 	$(p).append('<li id='+id+'>'+n+'<ul><li>'+v+'</ul></li></li>');
		// 	return;
		
		// }else{
		// 	$('#'+id+' ul').append('<li>'+v+'</li>');
		// }
	}, 


    /** 
	* @Resume : return the parameters as an array,
   	*/
	setParam: function (param)
	{
		var r;

		if (this.hasFunction(param)) return param.split(',');
		return r;
	},

	/** 
	 * @Resume : return the the starting and the ending index of a scope
	 * @param  : a = first delimiter; b = second delimiter; i = index to start looking; exclude = word to exclude  
    */
	scope: function (a, b, i, excludes)
	{
		var	open = 0, 
			close = 0,
			j = 0,
			excludes = excludes | undefined;
		
		for (i; i <= this.code.length; i++)
		{
			if (this.code[i] == excludes[j] && excludes[j + 1] != undefined)
				(this.code[i + 1 ] == excludes[j + 1]) ? i++ : '';
			if (this.code[i] == '(') open++;
			if (this.code[i] == ')') close++;
			if (open == close && open != 0) return (i);
		}
	},


	/** 
	 * @Resume : split the code depending on jquery code part 
    */
	splitCode: function (from)
	{
		console.log(this.toLoad.length)
		if (this.toLoad.length < 1) return;
		var method = this.toLoad[0].slice(1),
			rgx = new RegExp('\\$\\(.+\\).'+method),
			code = this.code.substring(from),
			splitStart = code.match(rgx),
			i = from,
			param,
			a = code.indexOf(splitStart),
			b = (splitStart['input'] != null)? splitStart['input'].split('.'+method) : splitStart.split('.'+method) || null,

			paramStart = ((this.isChaining(from))? (method.length + 1 + i) : (i + splitStart.index + splitStart[0].length)),
			j, // scope end
			o = {};

		// console.log(splitStart);
		console.log(b = code.substring(a).split('.'+method));
		if (splitStart.index != null)
		{
			i = splitStart.index + from;
			this.getSelector(splitStart[0].split('.'+method)[0]);
		}

		j = this.scope('(', ')', paramStart) + 1;
		param = code.substring(paramStart - from + 1, j - from - 1);

		(function (a,b)
		{
			o['end'] = j;
			o['start'] = i;
			o['parm'] = param;
			o['method'] = method;
			o['selector'] = {'name' : a, 'type' : b};
		})(this.selector.name, this.selector.type)	
		
		this.codeSplited.push(o);
		this.toLoad.shift();
		
		return this.splitCode(j);
	}
};