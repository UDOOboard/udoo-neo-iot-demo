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
        case 'pressure':
            readPressureSensors();
            break;
        case 'temperature':
            readTemperatureSensors();
            break;
        case 'car1':
            readCar1Sensors();
            break;
        case 'car2':
            readCar2Sensors();
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
            //acc = accel;
            str = accel;
            var arr = str.split(",");
            arr = arr.map(function (val) { return +val + 1; });
            acc = Math.sqrt(((arr[0])*(arr[0]))+(((arr[1]))*(arr[1]))+((arr[2])*(arr[2])));
            console.log('acc'+acc);
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


function readCar1Sensors(){

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
            if (err) {
                return console.log(err);
            }
            var arr = accel.split(",");
            arr = arr.map(function (val) { return +val + 1; });
            acc = Math.sqrt(arr[0]*arr[0]+arr[1]*arr[1]);

            acc = acc - 800;
            if (acc < 0) acc = 0;
            acc = Math.floor(acc * (240/17000));

            console.log(acc);
            //socket.emit('motion',data);
        });
        fs.readFile('/sys/class/misc/FreescaleGyroscope/data', 'utf8', function (err,gyrosc) {
            var self=this;
            if (err) {
                return console.log(err);
            }
            str = gyrosc;
            var arr = str.split(",");
            arr = arr.map(function (val) { return +val + 1; });
            gyro = Math.floor(Math.sqrt(((arr[0])*(arr[0]))+(((arr[1]))*(arr[1]))+((arr[2])*(arr[2]))));
            console.log(gyro);
            //socket.emit('motion',data);
        });

        fs.readFile('/sys/class/misc/FreescaleMagnetometer/data', 'utf8', function (err,magnet) {
            var self=this;
            if (err) {
                return console.log(err);
            }
            str = magnet;
            var arr = str.split(",");
            arr = arr.map(function (val) { return +val + 1; });
            magn = Math.floor(Math.sqrt(((arr[0])*(arr[0]))+(((arr[1]))*(arr[1]))+((arr[2])*(arr[2]))));
            console.log(magn);
            //socket.emit('motion',data);
        });
        socket.emit('car1', {a:acc, g:gyro, m:magn})
    }, 100)
}


function readPressureSensors() {
    console.log('Reading Pressure Sensor Values');
    var pressure = 0;
    var pressureScale = 0;
    setInterval(function () {
        fs.readFile('/sys/class/i2c-dev/i2c-1/device/1-0060/iio\:device0/in_pressure_raw', 'utf8', function (err,pressure) {

            if (err) {
                return console.log(err);
            }

        });

        fs.readFile('/sys/class/i2c-dev/i2c-1/device/1-0060/iio\:device0/in_pressure_scale', 'utf8', function (err,pressureScale) {

            if (err) {
                return console.log(err);
            }

        });
    }, 100)
socket.emit('pressure', pressure*pressureScale)
}

function readTemperatureSensors() {
    console.log('Reading Temperature Sensor Values');
    setInterval(function () {

    }, 100)

}