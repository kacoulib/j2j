var text_jqu     = document.getElementById('text_jqu'),
text_jav     = document.getElementById('text_jav'),
submit       = document.getElementById('submit'),
test         = document.getElementById('test'),
loading 	 = document.querySelector('#loading > span')
code     	 = '',
jquSize      = '',
allBracket    = {}, // {25 : '(', 30 : ')'}
bracketOpen   = 0, // all open break : ['(']
bracketClose  = 0, // all open break : [')']
splitStart    = 1;
javSize       = '',
allSplit      = '',      


// initialise the aplication
app.init();
// app.autoload('addClass');

// window.alert = function(param){return console.log('alert => '+param);};
window.prompt = function(param){return console.log('prompt => '+param);};
window.confirm = function(param){return console.log('comfirm => '+param);};

submit.onmousedown = function(e){
 e.preventDefault();
 is_my_home();    // verify if it's home page ?folder = js/moi/analystics
 app.resetAll();
 code = '';       // reset the code
 code = text_jqu.value; 



 var str = app.scope(splitStart,'addClass'), selector, method, param;
 console.log('str '+str+' '+ splitStart);

 str      = str.split('$(');
 	console.log(str);
 str      = str[1].split(').') || String(str).split(').');
 selector = str[0];
 str      = str[1];
 str      = str.split('addClass');
 method   = str[0];
 str      = str[1];

    

 if (str.match(/\(\s*{/) != null) {
  paramType = 'object';
 }else if(str.indexOf('function') >= 0) {
  paramType = 'function';
 }else{
  paramType = 'string';
 }

 var r =  {selector : selector, method : method, param : str, paramType : paramType};
 console.log(r);














  app.getDeclaredVariables(code);  // get all declared variables
  app.getString();      // get all return value
  jquSize = String(code).length;   // get the lenght of the file

  app.preLoad(code); // get the methodName to load
 
};
  text_jqu.value = ' $("ul li" ).addClass(function( index ) {return "item-" + index;})$("toto").addClass(sfdsffd(df)q()ds(dscdscds)dsfsf);';
