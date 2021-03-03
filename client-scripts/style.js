function toggleIDVisibility(id){
    var obj = document.getElementById(id);
    var classes = obj.classList;
    if (classes.contains('hidden')){
        classes.remove('hidden');
    } else {
        classes.add('hidden');
    }
}
function toggleClassVisibility(classname){
    var elem = document.getElementsByClassName(classname);
    for (i=0;i<elem.length; i++ ){
        if (elem[i].classList.contains('hidden')){
            elem[i].classList.remove('hidden');
        } else {
            elem[i].classList.add('hidden');
        }
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

function gamePadbuttons(className){
    var north = document.getElementById('gp-north').classList;
    var east = document.getElementById('gp-east').classList;
    var gamepad = document.getElementById('gamepad').classList;
    if (className == "of-2"){
        north.add('hidden');
        east.add('hidden');
        gamepad.remove('of-3') || gamepad.remove('of-4');
        gamepad.add('of-2');
    } else if (className == "of-3"){
        east.remove('hidden');
        north.add('hidden');
        gamepad.remove('of-2') || gamepad.remove('of-4');
        gamepad.add('of-3');
    } else {
        east.remove('hidden');
        north.remove('hidden');
        gamepad.remove('of-2') || gamepad.remove('of-3');
        gamepad.add('of-4');
    }
}

