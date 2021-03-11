function setStyleProp(name, value){
	document.documentElement.style.setProperty(name, value)
	//parent.document.documentElement.style.setProperty(name, value)
}
function toggleClass(name){
	console.log(name)
	document.body.classList.toggle(name);
	//parent.document.body.classList.toggle(name);
}

function setButtonScale(scale){
	setStyleProp('--button-diameter-scale', scale)
}
function setReachScale(scale){
	setStyleProp('--reach-scale', scale)
}

function toggleDarkMode(){
	toggleClass("dark-mode")
}
function toggleGPMode(){
	toggleClass("ps")
}

