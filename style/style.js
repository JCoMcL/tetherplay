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
