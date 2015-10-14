/**
 * Created by Michelangelo on 09/10/2015.
 */
var socket = io();
window.widgets = {};

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
});

socket.on('car2', function(data){
    //console.log(data);
    notifyCar2Data(data);
});

socket.on('house', function(data){
    //console.log(data);
    notifyHouseData(data);
});

socket.on('smartcity', function(data){
    //console.log(data);
    notifySmartCityData(data);
});

socket.on('truck', function(data){
    //console.log(data);
    notifyTruckData(data);
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

    document.getElementById('MotionCar1acc').innerHTML=data.a;
    document.getElementById('MotionCar1gyr').innerHTML=data.g;
    document.getElementById('MotionCar1mag').innerHTML=data.m;
    
    if (window.widgets && window.widgets.car1speed) {
        window.widgets.car1speed.value = data.a;
        window.widgets.car1speed.grow();
    }
    
    
}

function notifyCar2Data(data){

    document.getElementById('MotionCar2acc').innerHTML=data.a;
    document.getElementById('MotionCar2gyr').innerHTML=data.g;
    document.getElementById('MotionCar2mag').innerHTML=data.m;
}

function notifyHouseData(data){

    document.getElementById('HouseWater').innerHTML=data.water;
    document.getElementById('HouseSmoke').innerHTML=data.smoke;
    document.getElementById('HouseTemp').innerHTML=data.temp;
    document.getElementById('HouseGas').innerHTML=data.gas;
    document.getElementById('HouseSolar').innerHTML=data.solar;
}

function notifySmartCityData(data){

    document.getElementById('SmartCityir1').innerHTML=data.ir1;
    document.getElementById('SmartCityir2').innerHTML=data.ir2;
    document.getElementById('SmartCitylight').innerHTML=data.light;
    document.getElementById('SmartCitysound').innerHTML=data.sound;
    document.getElementById('SmartCitywind').innerHTML=data.wind;
    document.getElementById('SmartCitytrash').innerHTML=data.trash;
    document.getElementById('SmartCitylamp').innerHTML=data.lamp;
}

function notifyTruckData(data){

    document.getElementById('Truckacc').innerHTML=data.a;
    document.getElementById('Truckgyr').innerHTML=data.g;
    document.getElementById('Truckmag').innerHTML=data.m;
    document.getElementById('Truckdoor').innerHTML=data.door;
}

function createGauge(name, max) {
    var gauge = new RGraph.Gauge({
        id: name,
        min: 0,
        max: max,
        value: 0,
        options: {
            anglesStart: RGraph.PI - (RGraph.PI / 8),
            anglesEnd: RGraph.TWOPI + (RGraph.PI / 8),
            shadow: false,
            textColor: 'white',
            tickmarksBigColor: 'white',
            tickmarksMediumColor: 'white',
            tickmarksSmallColor: 'white',
            colorsRanges: [],
            backgroundColor: 'black',
            borderInner: 'black',
            borderOuter: 'black',
            borderOutline: 'black',
            needleColors: ['red'],
            needleType: 'line',
            needleTail: true,
            centerpinRadius: 0.1,
            titleTopColor: 'white',
            labelsCentered: true,
            labelsOffset: 7
        }
    }).on('draw', function (obj) {
        RGraph.path(obj.context, ['b','a',obj.centerx, obj.centery, 10, 0, RGraph.TWOPI, false,'f','#aaa']);
    }).draw();
    
    window.widgets[name] = gauge;
}
