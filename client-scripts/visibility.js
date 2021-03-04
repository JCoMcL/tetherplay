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
function toggleParentIDVisibility(id){
    var obj = parent.document.getElementById(id);
    var classes = obj.classList;
    if (classes.contains('hidden')){
        classes.remove('hidden');
    } else {
        classes.add('hidden');
    }
}

