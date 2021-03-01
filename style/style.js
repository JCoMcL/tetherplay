function toggleIDVisability(id) {
    var obj = document.getElementById(id);
    if (obj.style.display === 'none'){
        obj.style.display = 'inherit';
    } else {
        obj.style.display = "none";
    }
}
function buttonSize(){
    var slider = document.getElementById('button-slider');
    document.documentElement.style.setProperty('--button-diameter', `${slider.value}em`);
}
