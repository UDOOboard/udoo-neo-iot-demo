/**
 * Created by Michelangelo on 09/10/2015.
 */
var socket = io();
window.widgets = {};
window.sensors = {};
window.lastData = {
    car1: null,
    car2: null,
    house: null,
    smartcity: null,
    truck: null
};

window.widgets.dcar1 = [];
window.widgets.dcar2 = [];
window.widgets.dtruck = [];


socket.on('connection', function(socket){


});


socket.on('client-connect', function() {
        notifyConnect();
});

socket.on('motion', function(data){
    //console.log(data);
    notifyMotionData(data);
});

socket.on('car1', function(data){
    //console.log(data);
    notifyCar1Data(data);
    window.lastData.car1 = new Date();
});

socket.on('car2', function(data){
    //console.log(data);
    notifyCar2Data(data);
    window.lastData.car2 = new Date();
});

socket.on('house', function(data){
    //console.log(data);
    notifyHouseData(data);
    window.lastData.house = new Date();
});

socket.on('smartcity', function(data){
    //console.log(data);
    notifySmartCityData(data);
    window.lastData.smartcity = new Date();
});

socket.on('truck', function(data){
    //console.log(data);
    notifyTruckData(data);
    window.lastData.truck = new Date();
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

function notifyConnect(){
        document.getElementById('ConnStatus').innerHTML='Connected.';
}

function notifyMotionData(data){

    document.getElementById('MotionData1acc').innerHTML=data.a+'.';
    document.getElementById('MotionData1gyr').innerHTML=data.g+'.';
    document.getElementById('MotionData1mag').innerHTML=data.m+'.';
}

function notifyCar1Data(data){
//    document.getElementById('MotionCar1acc').innerHTML=data.a;
//    document.getElementById('MotionCar1gyr').innerHTML=data.g;
//    document.getElementById('MotionCar1mag').innerHTML=data.m;
//    console.log(data);
    
    var car1 = arduinoMap(data.a, 0, 240, -120, 120);
    if (car1 < -120 || car1 > 120) car1 = -120;
    $("#car1speedx .needle").css("transform", "rotate("+car1+"deg)");
    
    window.widgets.dcar1.push(data.a);
    if (window.widgets.dcar1.length > 10) {
        window.widgets.dcar1 = window.widgets.dcar1.slice(window.widgets.dcar1.length - 10);
    }
}

function notifyCar2Data(data){
//    document.getElementById('MotionCar2acc').innerHTML=data.a;
//    document.getElementById('MotionCar2gyr').innerHTML=data.g;
//    document.getElementById('MotionCar2mag').innerHTML=data.m;
//    console.log(data);

    var car2 = arduinoMap(data.a, 0, 240, -120, 120);
    if (car2 < -120 || car2 > 120) car2 = -120;
    $("#car2speedx .needle").css("transform", "rotate("+car2+"deg)");
    
    window.widgets.dcar2.push(data.a);
    if (window.widgets.dcar2.length > 10) {
        window.widgets.dcar2 = window.widgets.dcar2.slice(window.widgets.dcar2.length - 10);
    }
    //console.log(window.widgets.dcar2);
}

function notifyHouseData(data){
    window.sensors.house = data;
    if (window.widgets && window.widgets.housetemp) {
        window.widgets.housetemp.value = data.temp/100;
    }
/*
    document.getElementById('HouseWater').innerHTML=data.water;
    document.getElementById('HouseSmoke').innerHTML=data.smoke;
    document.getElementById('HouseTemp').innerHTML=data.temp;
    document.getElementById('HouseGas').innerHTML=data.gas;
    document.getElementById('HouseSolar').innerHTML=data.solar;
*/
}

function notifySmartCityData(data){
    //console.log(data);
    window.sensors.smartcity = data;
    
/*    
    document.getElementById('SmartCityir1').innerHTML=data.ir1;
    document.getElementById('SmartCityir2').innerHTML=data.ir2;
    document.getElementById('SmartCitylight').innerHTML=data.light;
    document.getElementById('SmartCitysound').innerHTML=data.sound;
    document.getElementById('SmartCitywind').innerHTML=data.wind;
    document.getElementById('SmartCitytrash').innerHTML=data.trash;
*/
}

function notifyTruckData(data){

    var truck = arduinoMap(data.a, 0, 240, -120, 120);
    if (truck < -120 || truck > 120) truck = -120;
    $("#truckspeedx .needle").css("transform", "rotate("+truck+"deg)");
    
    window.widgets.dtruck.push(data.a);
    if (window.widgets.dtruck.length > 10) {
        window.widgets.dtruck = window.widgets.dtruck.slice(window.widgets.dtruck.length - 10);
    }
/*
    document.getElementById('Truckacc').innerHTML=data.a;
    document.getElementById('Truckgyr').innerHTML=data.g;
    document.getElementById('Truckmag').innerHTML=data.m;
    document.getElementById('Truckdoor').innerHTML=data.door;
*/
}

function arduinoMap(x, in_min, in_max, out_min, out_max)
{
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}





var houseTempSerieData  = [], graph;
for (var i=0; i<600; ++i) {
    houseTempSerieData.push(null);
}
graph = getGraph('house-temp-serie', houseTempSerieData);

function getGraph(id, houseTempSerieData)
{
    var obj = new RGraph.Line({
        id: id,
        data: houseTempSerieData,
        options: {
            background: {
                color: 'white',
                grid: {
                    vlines: false,
                    border: false
                }
            },
            title: {
                self: 'House Temperature',
                vpos: 0.5,
                xaxis: {
                    self: 'Last 5 minutes',
                    pos: 0.5
                }
            },
            colors: ['black'],
            linewidth: 0.5,
            yaxispos: 'right',
            ymax: 30,
            ymin: 16,
            xticks: 25,
            filled: true,
            numyticks: 2,
            tickmarks: null,
            ylabels: {
                count: 5
            }
        }
    });
        
    var grad = obj.context.createLinearGradient(0,0,0,250);
    grad.addColorStop(0, '#ff0000');
    grad.addColorStop(0.9, 'rgba(0,0,0,0)');

    obj.set('fillstyle', [grad]);
    return obj;
};

function drawGraph ()
{
    RGraph.clear(document.getElementById("house-temp-serie", 'white'));
    graph.draw();
   
   var r1 = window.widgets.housetemp.value;

    houseTempSerieData.push(r1);
    if (houseTempSerieData.length > 600) {
        houseTempSerieData = RGraph.arrayShift(houseTempSerieData);
    }

    graph.original_data[0] = houseTempSerieData;
}

setInterval(drawGraph, 500);













setInterval(function() {
    var moving1 = false;
    for (var i = 0; i<window.widgets.dcar1.length; i++) {
        if (window.widgets.dcar1[i] > 0) {
            moving1 = true;
        }
    }
    if (moving1) {
        $("#mycar1").removeClass("not-animated");
    } else {
        $("#mycar1").addClass("not-animated");
    }
    
    var moving2 = false;
    for (var i = 0; i<window.widgets.dcar2.length; i++) {
        if (window.widgets.dcar2[i] > 0) {
            moving2 = true;
        }
    }
    if (moving2) {
        $("#mycar2").removeClass("not-animated");
    } else {
        $("#mycar2").addClass("not-animated");
    }
    
    var movingtruck = false;
    for (var i = 0; i<window.widgets.dtruck.length; i++) {
        if (window.widgets.dtruck[i] > 20) {
            movingtruck = true;
        }
    }
    if (movingtruck) {
        $("#mytruck").removeClass("not-animated");
    } else {
        $("#mytruck").addClass("not-animated");
    }
    
}, 1000);


setInterval(function() {
    if (window.widgets.housetemp) window.widgets.housetemp.grow();
}, 800);

setInterval(function() {
    if (window.sensors.house) {
        var houseWater = Math.floor(100-arduinoMap(window.sensors.house.water, 10, 700, 0, 100));
        $("#house-water").css("-webkit-filter", "grayscale("+houseWater+"%)");
        
        var houseSmoke = Math.floor(100-arduinoMap(window.sensors.house.smoke, 650, 2500, 0, 100));
        $("#house-smoke").css("-webkit-filter", "grayscale("+houseSmoke+"%)");
        
        var houseGas = Math.floor(100-arduinoMap(window.sensors.house.gas, 10, 1500, 0, 100));
        $("#house-gas").css("-webkit-filter", "grayscale("+houseGas+"%)");
        
        var houseSolar = Math.floor(100-arduinoMap(window.sensors.house.solar, 50, 2500, 0, 100));
        $("#house-solar").css("-webkit-filter", "grayscale("+houseSolar+"%)");
        //    console.log("House", houseWater, houseSmoke, houseGas, houseSolar);
    }
    
    if (window.sensors.smartcity) {
        var p1 = 0;
        if (window.sensors.smartcity.ir1 > 2500) {
            p1 = 100;
        }
        $("#smartcity-p1").css("-webkit-filter", "grayscale("+p1+"%)");
        
        var p2 = 0;
        if (window.sensors.smartcity.ir2 > 2500) {
            p2 = 100;
        }
        $("#smartcity-p2").css("-webkit-filter", "grayscale("+p2+"%)");
        
        var light = Math.floor(arduinoMap(window.sensors.smartcity.light, 900, 3000, 0, 100));
        $("#smartcity-lumen").css("width", light+"%");
        
        var lamp = 100;
        if (window.sensors.smartcity.light < 1000) {
            lamp = 0;
        }
        $("#smartcity-light").css("-webkit-filter", "grayscale("+lamp+"%)");
    }
    
    
    
}, 150);

setInterval(function() {
    var now = new Date();
    if (window.lastData.car1 === null || now-window.lastData.car1<10000) {
        
    }
    if (window.lastData.car2 === null || now-window.lastData.car2<10000) {
        
    }
    if (window.lastData.house === null || now-window.lastData.house<10000) {
        $("#house-water").css("-webkit-filter", "grayscale(100%)");
        $("#house-smoke").css("-webkit-filter", "grayscale(100%)");
        $("#house-gas").css("-webkit-filter", "grayscale(100%)");
        $("#house-solar").css("-webkit-filter", "grayscale(100%)");
    }
    if (window.lastData.car1 === null || now-window.lastData.car1<10000) {
        
    }
    
}, 5000);
