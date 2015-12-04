var msg = {

  sucess : function(title, txt)
  {
    console.log("%c"+title ,'padding: 0px 5px;border :1px dotted #1FDCDC;color:#009688',txt);
  },

  warning : function(title, txt)
  {
    console.log("%c"+title ,'padding: 0px 5px;border :1px dotted red;color:orange',txt);
  },

  table : function(data)
  {
    console.table((data[0].push) ? data : [data]);
  }

};
function msg(msg)
{
  console.log(msg+' :');
  console.log('----------------------');
  msg.prototype.end = function(){
    console.log('----------------------');
  }
}

function test(code){
  
  try{
    console.log(code);

  }catch(e){

    console.log(e);
    throw new methodsInconue('css');

  }
};