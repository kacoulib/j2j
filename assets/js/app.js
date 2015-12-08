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
	implemant    : {'css':{'type' : 'methods','namespace' : 'css','fileName' : 'css'},'addClass':{'type' : 'methods','namespace' : 'css','fileName' : 'addClass'}, 'removeClass':{'type' : 'methods','namespace' : 'css','fileName' : 'removeClass'}},
	notImplement : {},
	declaredVar  : [],
	toLoad		 : [],
	fileLoaded	 : [],
	selector 	 : {name : '', type : ''},
	code 		 : '',
	codeSplit	 : [],

	init: function(code)
	{
		this.resetAll(); // reset all properties 
      	this.code = code;
      	this.codeSplit = code.split('');
      	this.preLoad(code); // load all required files
        this.scope(0,'addClass');
        this.getDeclaredVariables(code); // extract all variables
        this.convert(code); // convert all jquery code to js
        // console.log(this.getString());
        return this.getString();
	},

	/** 
	* @Resume : loading animation
	*/
	animLoading: function()
	{
		loading.style.width += (parseInt(loading.style.width)+10)+'px';
		// console.log(loading.style.width);
	},
	
	/** 
	 * @Resume : autoload the filed needeed depending on the script
	*/
	autoload: function (file)
	{
		if (file in this.implemant && this.fileLoaded.indexOf(file) < 0)
		{
			var script  = document.createElement('script');
			script.type = 'text/javascript'; 
			script.src  = 'assets/js/'+this.implemant[file].type+'/'+this.implemant[file].namespace+'/'+this.implemant[file].fileName+'.js';
			script.async = true;
			document.body.appendChild(script);
			app.fileLoaded.push(file);
			msg.sucess('autoload',file);
			return;
			
		}
		else
		{
			app.setHistoric('error','auto load',file);
			msg.warning('autoload','erreur fichier .'+file+' deja été implemanté');
			return;
		}
	},

	/** 
	 * @Resume : convert the jquery script

	*/
	convert: function (code)
	{
		this.declaredVar = [];
		for (var i = 0; i < this.declaredVar.length; i++)
		{
		};
			// console.log('convert');
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
		msg.table(rgxMatch);
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
	            };
	        };
        msg.table(this.declaredVar);

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
		// console.log(selec);
		selec = selec.slice(2, -1);
		var s 		 		= /[:*,>+~\[=$^]/.test(selec);
			s 				= (s == true ? s : (/(\S)+(\s)+(\S)/.test(selec)? true : selec[1]));
			name 	 		= selec.slice(1),
			selector 		= '',
			selectorLength  = 0,
			type 			= '';

		// console.log('name='+selec);
		selector = 'document.';
		if (s === true)
		{// if it's a css quey selector ex p:first || p > .test 
			type = 'tag';
			selector += 'querySelectorAll('+selec+')';
			this.selector.name = selector;
			this.selector.type = type;
			return;
		}; 
		
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
	* @Resume : detect if there'is a chaining or not
	* verify from an index if there's a '.Method' after a fucntion
	*/
	isChaining : function(i)
	{
		return /^\)(\s?)\.(\S)+\(/.test(this.code.substring(i));
	},

	/** 
	* @Resume : add a piece of code before an action
	* ex : if there's a chaining declar a varible(selector) to use
	*/
	insertBefor : function(code)
	{

	},

	/** 
	* @Resume : add a piece of code after an action
	* ex : if there's a chaining declar a varible(selector) to use
	*/
	insertAfter : function(code)
	{

	},

	/** 
	 * @Resume : find all proprety, method in the converting script that have to be autoload
	*/
	preLoad: function (file)
	{
		for (var key in this.implemant)
		{
			if (file.indexOf('.'+key) >= 0 && this.toLoad.indexOf(key) < 0)
			{
				this.toLoad.push(key);
				this.autoload(key);
			};
		};
	
	},

	/** 
	 * @Resume : reset variblable that should be declared only in app

	*/
	resetAll: function ()
	{
		this.toLoad = [];
		this.declaredVar = [];
	},
	
	/** 
	 * @Resume : replace the jquery code by the native code
	*/
	replaceFrom : function(start, end, javascript)
	{
		var jquery = this.code.substring(start, end);
		this. code = this.code.replace(jquery, javascript);
		console.log(javascript);
	},
	/** 
	 * @Resume : remove dash and uppercase the first caractere
	  	ex: test-one => testOne 
	*/
	setDashUcfirst: function (elem)
	{
		var part = elem.split('-'), pp, i;

		// console.log('setDashUcfirst: '+elem);
		if (part.length != 1)
		{
			pp = part[0];

			for (i = 1; i < part.length; i++)
			{
				if (part[i] != 'undefined')
				{
					pp += part[i].charAt(0).toUpperCase()+part[i].slice(1);
				};
			};

			return pp;
		};

		return elem;
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
	 * @Resume : parse the script to extract selector,method,param 
	 * @param start  (int) : the indexof to start ex:  code.indexOf('$("#test").addClass')
	 * @param method  (str) : the name of the method ex(addClass) 
    */
	scope: function(start,method)
	{
		msg.info('scope start at',start);
		var rgx = new RegExp('\\$\\(.+\\).'+method),
			i, 
			bracketOpen = 0, 
			bracketClose = 0,
			splitStart = this.code.match(rgx), 
			selector = splitStart[0].split('.'+method)[0],
			param; // code :  le code a testé ex: $('test').addclass(fucntion(){}); (function(){})();
		this.code = this.code.substring(start);

		if (splitStart == null) return;
		
		console.log(splitStart[0].length)
		
		for (i = splitStart.index + splitStart[0].length; i <= this.codeSplit.length; i++)
		{
			if (this.codeSplit[i] == '(')
			{
			 	bracketOpen++;
			}
			if (this.codeSplit[i] == ')')
			{
			 	bracketClose++;
			}
			
			if (bracketOpen == bracketClose && bracketOpen != 0)
			{
				this.getSelector(selector);
				param = this.code.substring((splitStart.index + splitStart[0].length + 1), i);// get the method param
				this.replaceFrom(splitStart.index, i + 1, this[method](param));
				return (0);
			};
		};
	}
};