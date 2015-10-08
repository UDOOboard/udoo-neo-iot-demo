/**
 * Created by Michelangelo on 08/10/2015.
 */

var exec = require('child_process').exec;
fs = require('fs');
var argv = require('yargs')
                    .usage('Usage: $0 -i Ip Address of Server, -s Sensor to use')
                    .demand(['i', 's'])
    .describe('-s', 'Sensors to Use')
    .describe('all', 'Read Values from all sensors')
    .describe('motion', 'Read Values from Motion Sensors')
                    .argv;
var socket = require('socket.io-client')('http://'+argv.i+':3000');

socket.on('connect', function(){
    console.log('connected to '+argv.i);
    socket.emit('hello', {'ip':argv.i});

    switch(getSensors()) {
        case 'all':
            readAllSensors();
            break;
        case 'motion':
            readMotionSensors();
            break;
        default:
       readAllSensors();
    }
});
socket.on('event', function(data){});
socket.on('disconnect', function(){
    console.log('disconnected');
});


function getSensors(){
    var sensors = argv.s;
    return sensors
}

function readAllSensors(){
    console.log('all');
    socket.emit('all');
}

function readMotionSensors(){

    var acc = 0;
    var gyro = 0;
    var magn =0;
    console.log('Reading Motion Sensors Values');
    exec("echo 1 > /sys/class/misc/FreescaleGyroscope/enable", function (error, stdout, stderr) {
        if (error !== null) {
            console.log('Cannot Enable Gyroscope: '+error);
        }
        else {
            console.log('Gyroscope enabled');
        }
    });
    exec("echo 1 > /sys/class/misc/FreescaleAccelerometer/enable", function (error, stdout, stderr) {
        if (error !== null) {
            console.log('Cannot Enable Accelerometer: '+error);
        }
        else {
            console.log('Accelerometer enabled');
        }
    });
    exec("echo 1 > /sys/class/misc/FreescaleMagnetometer/enable", function (error, stdout, stderr) {
        if (error !== null) {
            console.log('Cannot Enable Magnetometer: '+error);
        }
        else {
            console.log('Magnetometer enabled');
        }
    });
    setInterval(function () {

        fs.readFile('/sys/class/misc/FreescaleAccelerometer/data', 'utf8', function (err,accel) {
            var self=this;
            if (err) {
                return console.log(err);
            }
            acc = accel;
            //console.log(data);
            //socket.emit('motion',data);
        });
        fs.readFile('/sys/class/misc/FreescaleGyroscope/data', 'utf8', function (err,gyrosc) {
            var self=this;
            if (err) {
                return console.log(err);
            }
            gyro = gyrosc;
            //console.log(data);
            //socket.emit('motion',data);
        });

        fs.readFile('/sys/class/misc/FreescaleMagnetometer/data', 'utf8', function (err,magnet) {
            var self=this;
            if (err) {
                return console.log(err);
            }
            magn = magnet;
            //console.log(data);
            //socket.emit('motion',data);
        });
    socket.emit('motion', {a:acc, g:gyro, m:magn})
    }, 100)
}


