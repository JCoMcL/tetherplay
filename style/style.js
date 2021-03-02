function toggleIDVisability(id){
    var obj = document.getElementById(id);
    var classes = obj.classList;
    if (classes.contains('hidden')){
        classes.remove('hidden');
    } else {
        classes.add('hidden');
    }
}

function buttonSize(){
    var slider = document.getElementById('button-slider');
    document.documentElement.style.setProperty('--button-diameter', `${slider.value}em`);
}
function reachSize(){
    var slider = document.getElementById('reach-slider');
    document.documentElement.style.setProperty('--reach', `calc(var(--button-diameter)*${slider.value}`);
}

function toggleDarkMode(){
    var elem = document.body;
    elem.classList.toggle("dark-mode");
}
function toggleGPMode(){
    var elem = document.body;
    elem.classList.toggle("ps");
}

function twoGBbuttons(){
    var north = document.getElementById('gp-north').classList;
    var east = document.getElementById('gp-east').classList;
    var gamepad = document.getElementById('gamepad').classList;
    if (!north.contains('hidden')){
        north.add('hidden');
    }
    if (!east.contains('hidden')){
        east.add('hidden');
    }
    if (gamepad.contains('of-3') || gamepad.contains('of-4')){
        gamepad.remove('of-3') || gamepad.remove('of-4');
        gamepad.add('of-2');
    }
}
function threeGBbuttons(){
    var north = document.getElementById('gp-north').classList;
    var east = document.getElementById('gp-east').classList;
    var gamepad = document.getElementById('gamepad').classList;
    if (!north.contains('hidden')){
        north.add('hidden');
    }
    if (east.contains('hidden')){
        east.remove('hidden');
    }
    if (gamepad.contains('of-2') || gamepad.contains('of-4')){
        gamepad.remove('of-2') || gamepad.remove('of-4');
        gamepad.add('of-3');
    }
}
function fourGBbuttons(){
    var north = document.getElementById('gp-north').classList;
    var east = document.getElementById('gp-east').classList;
    var gamepad = document.getElementById('gamepad').classList;
    if (north.contains('hidden')){
        north.remove('hidden');
    }
    if (east.contains('hidden')){
        east.remove('hidden');
    }
    if (gamepad.contains('of-3') || gamepad.contains('of-2')){
        gamepad.remove('of-3') || gamepad.remove('of-2');
        gamepad.add('of-4');
    }
}
