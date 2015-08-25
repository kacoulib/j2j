var app = {

	/** 
	 * @brief Description : autoload the filed needeed depending on the script
	 * @var implemant 	 (obj) : all method that has been implement  
	 * @var notImplement (obj) : all methods that hasen't been implemente yet
	 * @var toString	 (str) : concate all returned javascript from the api
	 * @var declaredVar  (arr) : all varibles declared 
	 * @var toLoad		 (arr) : all method that has been in the script to convert
	 * @var fileLoaded		 (arr) : all files that has been load
	*/
	implemant    : {'css':{'type' : 'methods','namespace' : 'css','fileName' : 'css'},'addClass':{'type' : 'methods','namespace' : 'css','fileName' : 'addClass'}, 'removeClass':{'type' : 'methods','namespace' : 'css','fileName' : 'removeClass'}},
	notImplement : {},
	toString     : '',
	declaredVar  : [],
	toLoad		 : [],
	fileLoaded		 : [],

	init : function(code){
		this.resetAll(); // reset all properties  
      	this.preLoad(code); // load all required files
        this.scope(code,0,'removeClass');
        this.getDeclaredVariables(code); // extract all variables
        this.convert(code); // convert all jquery code to js

        return this.getString();
	},



	/** 
	* @brief Description : loading animation
	*/

	animLoading : function(){
		loading.style.width += (parseInt(loading.style.width)+10)+'px';
		console.log(loading.style.width);
	},
	
	/** 
	 * @brief Description : autoload the filed needeed depending on the script
	*/
	autoload : function(file){

		if(file in this.implemant && this.fileLoaded.indexOf(file) < 0){
			var script  = document.createElement('script');
			script.type = 'text/javascript'; 
			script.src  = 'assets/js/'+this.implemant[file].type+'/'+this.implemant[file].namespace+'/'+this.implemant[file].fileName+'.js';
			document.body.appendChild(script);
			app.fileLoaded.push(file);
			console.log('autoload file: '+file);
			return;
			
		}else{
			app.setHistoric('error','auto load',file);
			console.log('erreur <strong>'+file+'</strong> a deja été implemanté');
			return false;
		}
	},

	/** 
	 * @brief Description : convert the jquery script

	*/
	convert : function(code){
		this.declaredVar = [];
		for (var i = 0; i < this.declaredVar.length; i++) {
		};
			console.log('convert');
	},

	formate : function(code){ // 
		var rgxMatch, rgxNoExtra = [], rgxfinal, re, addClass='addClass';
		re = new RegExp('.'+addClass);
		rgxMatch = code.match(/var (.*);/g); // extract all declaration variables   ex: var t = 0, p, ii = 1;
		
		if (rgxMatch != null) {

	        for (var k = 0; k < rgxMatch.length; k++) {
	           rgxNoExtra.push(rgxMatch[k].split(/[;,var]/g)); // remove all ;,var
	        }; 

	        for (var i = 0; i< rgxNoExtra.length; i++) {

	            for (var j = 0; j < rgxNoExtra[i].length; j++) {
	             
	              if (typeof rgxNoExtra[i][j] !== 'undefined' && rgxNoExtra[i][j] !== '' && rgxNoExtra[i][j] !== ' ') { // if it's not empty or undefined or just a space
	                rgxfinal = rgxNoExtra[i][j].split('='); // re-spit at the = to get keys and values
	                this.declaredVar.push(rgxfinal);
	              }
	            };
	        };

		};
		console.log('formate: '+code);

	},
	
	/** 
	* @brief Description : get the browser information
	*/
	getBrowserInfo : function(){
		var browser = $.browser, 
		 	version = browser['version'];
		
		if ('chrome' in browser || 'webkit' in browser) {
			browser = 'webkit'; // if chrome

		}else if('mozilla' in browser){
			
			if (version >= 13) {
				browser = 'moz'; // if mozilla

			}else if(version <= 12 && version >=10){
				browser = 'noPrefix'; // if ie >=10

			}else{
				browser = 'ms'; // if ie <=10

			}

		}else{
			browser = 'noPrefix';

		}

		console.log('getBrowserInfo');


		return {'name' : browser, 'version' : version};
	},

	/** 
	 * @brief Description : get all declared varible		
	 * @var rgxMatch 	: extract all declaration variables ex: var t = 0, p, ii = 1;
	 * @var rgxNoExtra  : containe the declared var with no ,;var	
	 * @var rgxfinal    : containe the varible and his value   		
		 * @var note 	: the value of rgxfinal is push in this.declaredVar
	*/
	getDeclaredVariables : function(code){
		var rgxMatch, rgxNoExtra = [], rgxfinal;
		rgxMatch = code.match(/var (.*);/g); // extract all declaration variables   ex: var t = 0, p, ii = 1;
		console.log(rgxMatch)
		
		if (rgxMatch != null) {

	        for (var k = 0; k < rgxMatch.length; k++) {
	           rgxNoExtra.push(rgxMatch[k].split(/(var(\s))|([,;])/g)); // remove at all ;,var
	        }; 
	        for (var i = 0; i< rgxNoExtra.length; i++) {
	            for (var j = 0; j < rgxNoExtra[i].length; j++) {
	             
	              if (typeof rgxNoExtra[i][j] !== 'undefined' && rgxNoExtra[i][j] !== '' && rgxNoExtra[i][j] !== ' ') { // if it's not empty or undefined or just a space
	                rgxfinal = rgxNoExtra[i][j].split('='); // re-spit at the = to get keys. and values an justget ['t','0'] ['p'] ['ii','1']
	                this.declaredVar.push(rgxfinal);
	              }
	            };
	        };
	        console.log(rgxfinal);

		};
		console.log('getDeclaredVariables ');
		this.setHistoric('document','declared variable',this.declaredVar);
	},

	/** 
	 * @brief Description : get the selector,
	 * @var s (str): selector type ex '.' || '#'  
	 * @var name (str): selector name ex test  
	 * @var selector (str): the result of the javascript equivalante ex document.getElementbyId('test')  
	 * @var type (str) : the type of the selector ex id, class, tag 
	 * @var return (obj) : {selctor, length, type} 
   	*/
	getSelector : function(selec){
		console.log(selec);
		selec = selec.split('$(');
		selec = selec[1].split(')');
		selec = selec[0]+'';
		var s 		 		= /[:*,>+~\[=$^]/.test(selec);
			s 				= (s == true ? s : (/(\S)+(\s)+(\S)/.test(selec)?true:selec[1]));
			name 	 		= selec.slice(1),
			selector 		= '',
			selectorLength  = 0,
			type 			= ''; 

console.log('name='+selec)
		selector = 'document.';

		if (s === true) {// if it's a css query ex p:first || p > .test 
			type = 'tag';
			selector += 'querySelectorAll('+selec+')';
			return {'name' : selector, 'type' : type}
		}; 
		
		if (s === '#') {
			
			selector 	   += "getElementById('"+name.slice(1)+"')";
			type = 'id';

		}else if( s == '.'){
			selector 	   += "getElementsByClassName("+name.slice(1)+")";
			type = 'class';
		
		}else{
			type = 'tag';
			console.log(typeof selec +' type ' + selec)
			selector 	   += "querySelectorAll("+selec+")";
		}

		return {'name' : selector, 'type' : type};
	},

	/** 
	* @brief Description : get the javascript code stored in this.toString,
   	*/
	getString : function(){

		if(this.toString.length != 0){
			text_jav.value = this.toString;
			text_jav.select();

			console.log('getString');
			return this.toString;
		}
	},


	/** 
	 * @brief Description : find all proprety, method in the converting script that have to be autoload
	*/
	preLoad : function(file){
		console.log('preload');
		for (var key in this.implemant) {

			if (file.indexOf('.'+key) >= 0 && this.toLoad.indexOf(key) < 0) {
				this.toLoad.push(key);
				this.autoload(key);
			};
		};
	
	},

	/** 
	 * @brief Description : reset variblable that should be declared only in app

	*/
	resetAll : function(){
		this.toLoad = [];
		this.declaredVar = [];
	},
	
	/** 
	 * @brief Description : remove dash and uppercase the first caractere
	  	ex: test-one => testOne 
	*/
	setDashUcfirst : function(elem){
		var part = elem.split('-'),
			pp;

		console.log('setDashUcfirst: '+elem);

		if (part.length != 1) {
			pp = part[0];

			for (var i = 1; i < part.length; i++) {

				if (part[i] != 'undefined') {
					pp += part[i].charAt(0).toUpperCase()+part[i].slice(1);
				};
			};

			return pp;
		};

		return elem;
	},

	/** 
	 * @brief Description : add to the the information in the Hitoric(debug) 
	 * @param p  (str) : the parent of the element (app|document|window|error)
	 * @param n  (str) : the name of the element 
	 * @param v  (str) : the value of the element
	 note 	 : create a list of element. if the name already  exist just create the value in the name.
   */
	setHistoric : function (p,n,v){//(parent,name,value)
		var id, name, result;
		
		p = '#history_'+p+' ul';
		id = n.split(' ');
		id = id.join('_');

		console.log('setHistoric: '+p+n+v);
		if ($(p).children('#'+id).length == 0) {// if the name don't exist 
			$(p).append('<li id='+id+'>'+n+'<ul><li>'+v+'</ul></li></li>');
			return;
		
		}else{
			$('#'+id+' ul').append('<li>'+v+'</li>');
		}
	}, 

	/** 
	 * @brief Description : parse the script to extract selector,method,param 
	 * @param start  (int) : the indexof to start ex:  code.indexOf('$("#test").addClass')
	 * @param method  (str) : the name of the method ex(addClass) 
    */
	scope : function(code,start,method){

		console.log('scope: '+start);
		var rgx = new RegExp('\\$\\(.+\\).'+method);
		code = code.substring(start);
		var allSplit, i, bracketOpen, bracketClose,
			splitStart = code.match(rgx); // code :  le code a testé ex: $('test').addclass(fucntion(){}); (function(){})();

		if(splitStart == null) return;

		splitStart = code.indexOf('.'+method);
		allSplit = code.split(''); // decouper chaque caracter du code

		console.log(splitStart);
		for (i = splitStart; i < allSplit.length; i++) {

		if (allSplit[i] == '(') {
		 	bracketOpen++;
		}else if(allSplit[i] == ')'){
		 	bracketClose++;
		}else{
		 	continue;
		}

		if (bracketOpen ==  bracketClose) {
		 splitStart = i;
		 console.log(splitStart +'!='+ code.length)
		 return {'selec':selec , 'code' : code.substring(code,i+1), 'i' : i+1};
		};

		};
	}

};

