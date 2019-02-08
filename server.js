var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require("express");


let initiators = [];

  

  app.use(express.static(__dirname));

  app.get('/', function(req,res) {
      if(initiators.length==0){
       res.sendFile(__dirname+'/main.html');
       console.log("Там где пусто");
      }
       else{
       res.sendFile(__dirname+"/main2.html");
       console.log("Там где не пусто");
       }
    // res.end();
  });



  io.on('connection', function(socket){

    console.log(initiators.length);
         
    socket.on('initiatorInfo', function(info) {  //от певого инициатора
    
        console.log(info);
    initiators.push({id: socket.id,  info});
   
    });

    
   socket.on('nonInitiator', function() {
       if(initiators.length!=0)
       socket.emit('$initiatorConnectionInfo', JSON.stringify(initiators[0].info));
   });



    socket.on('nonInitiatorAnswer', function(info) {
          console.log(info);
          socket.broadcast.emit("$nonInitiatorAnswer", JSON.stringify(info));
     });


     socket.on('disconnect', function() {
         if(initiators.length!=0&&initiators[0].id == socket.id)
          initiators.length = 0;
     });
 
  });

 




http.listen(3000,"192.168.1.42", function(){
    console.log("Соединено успешно!");
});