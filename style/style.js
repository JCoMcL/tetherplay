function toggleIDVisability(id) {
    var obj = document.getElementById(id);
    if (obj.style.display === 'none'){
        obj.style.display = 'inherit';
    } else {
        obj.style.display = "none";
    }
}


