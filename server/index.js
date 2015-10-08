/**
 * Created by Michelangelo on 08/10/2015.
 */

var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(socket){
    socket.on('hello', function(data){
        console.log('*** Client '+data.ip+' connected');
    });
    socket.on('motion', function(data){
        console.log('Motion: a: '+data.a + ' m: '+data.m + ' g: '+data.g);
    });
    socket.on('temperature', function(data){
        console.log('Temperature: '+data);
    });
    socket.on('pressure', function(data){
        console.log('Pressure: '+data);
    });
    socket.on('disconnect', function(){
        console.log('A client just disconnected')
    });
});
server.listen(3000);
