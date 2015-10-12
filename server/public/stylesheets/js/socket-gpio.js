/**
 * Created by Michelangelo on 11/10/2015.
 */
var socket = io();

socket.on('consoleMessage', function(message) {
    var nodeListItem = document.createElement('LI');
    var nodeText = document.createTextNode(message);

    nodeListItem.appendChild(nodeText);
    document.getElementById('console').appendChild(nodeListItem);

    var divConsole = document.getElementById('div-console');
    divConsole.scrollTop = divConsole.scrollHeight;

});

socket.on('connection', function(socket){
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