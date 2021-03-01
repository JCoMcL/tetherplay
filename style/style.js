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
