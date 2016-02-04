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
        case 'house':
            readHouseSensors();
            break;
        case 'smartcity':
            readSmartCitySensors();
            break;
        case 'truck':
            readTruckSensors();
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

function readCar2Sensors(){

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
        socket.emit('car2', {a:acc, g:gyro, m:magn})
    }, 100)
}


function readHouseSensors() {
    var varwater = '00';
    var varsmoke = '00';
    var vartemp = '00';
    var vargas = '00';
    var varsolar = '00';
    setInterval(function () {

        //
        fs.readFile('/sys/bus/iio/devices/iio\:device0/in_voltage0_raw', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            } varwater = data;
        });
        //
        fs.readFile('/sys/bus/iio/devices/iio\:device0/in_voltage1_raw', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            } varsmoke = data;
        });
        //
        fs.readFile('/sys/bus/iio/devices/iio\:device0/in_voltage2_raw', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            } vartemp = data;
        });
        //
        fs.readFile('/sys/bus/iio/devices/iio\:device0/in_voltage3_raw', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            } vargas = data;
        });
        //
        fs.readFile('/sys/bus/iio/devices/iio\:device1/in_voltage0_raw', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            } varsolar = data;
        });

        socket.emit('house', {water:varwater,smoke:varsmoke,temp:vartemp,gas:vargas,solar:varsolar})
        //console.log(varwater + ' ' + varsmoke + ' ' + ' ' + vartemp + ' ' + vargas + ' ' + varsolar );
    }, 100)
}

function readSmartCitySensors(){


    var varir1 = '00';
    var varir2 = '00';
    var varlight = '00';
    var varsound = '00';
    var varwind = '00';
    var vartrash = '00';
    var varlamp = 'OFF';
    //Setting GPIO 25 to out
    exec("echo 25 > /sys/class/gpio/export", function (error, stdout, stderr) {
        if (error !== null) {
            console.log('There is a problem exporting gpio 25  '+error);
        }
        else {
            exec("echo out > /sys/class/gpio/gpio25/direction", function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('There is a problem setting direction of gpio 25  '+error);
                }
                else {
                    //Default state off
                    exec("echo 0 > /sys/class/gpio/gpio25/value", function (error, stdout, stderr) {
                        if (error !== null) {
                            console.log('There is a problem setting value of gpio 25  '+error);
                        }
                        else {
                        console.log('successfully initialized GPIO 25 ')
                        }
                    });
                }
            });
        }
    });
    setInterval(function () {

        //
        fs.readFile('/sys/bus/iio/devices/iio\:device0/in_voltage0_raw', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            } varir1 = data;
        });
        //
        fs.readFile('/sys/bus/iio/devices/iio\:device0/in_voltage1_raw', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            } varir2 = data;
        });
        //
        fs.readFile('/sys/bus/iio/devices/iio\:device0/in_voltage2_raw', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            } varlight = data;
        });
        //
        fs.readFile('/sys/bus/iio/devices/iio\:device0/in_voltage3_raw', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            } varsound = data;
        });
        //
        fs.readFile('/sys/bus/iio/devices/iio\:device1/in_voltage0_raw', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            } vartrash = data;
        });
        //
        fs.readFile('/sys/bus/iio/devices/iio\:device1/in_voltage1_raw', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            } varwind = data;
        });
        var lumen = parseInt(varlight);
        if (lumen > 800) {
            exec("echo 1 > /sys/class/gpio/gpio25/value", function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('Cannot turn on LED on 25: '+error);
                }
                else {
                    varlamp = 'ON';
                    console.log('LED on 25 ON');
                }
            });
        } else {
            exec("echo 0 > /sys/class/gpio/gpio25/value", function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('Cannot turn off LED on 25: '+error);
                }
                else {
                    varlamp = 'OFF';
                    console.log('LED on 25 OFF');
                }
            });
        }

        socket.emit('smartcity', {ir1:varir1,ir2:varir2,light:varlight,sound:varsound,wind:varwind,trash:vartrash,lamp:varlamp})
    }, 100)
}

function readTruckSensors(){
        var acc = 0;
        var gyro = 0;
        var magn =0;
        var trash =0;
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
            socket.emit('truck', {a:acc, g:gyro, m:magn, t:trash})
    }, 100)
}

