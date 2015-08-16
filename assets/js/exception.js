function methodsInconue(file){
  this.file = file;
  this.name = 'methodsInconue';

  console.log(this);
}
methodsInconue.prototype.toString = function() {

  document.getElementById('message').innerHTML = 'Desolé mais la function <strong>'+this.file+'</strong> n\'a pas encore été implemanté.';
  return;

};


      function test(code){
        
        try{
          console.log(code);

        }catch(e){

          console.log(e);
          throw new methodsInconue('css');

        }
      };