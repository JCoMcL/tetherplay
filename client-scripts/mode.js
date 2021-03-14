class _ModeSwitch {
	constructor( subModeSwitches=[], enabled=true ) {
		this.enabled = enabled
		this.children = subModeSwitches
	}
	apply() {
		if (this.enabled)
			this.enable()
		else
			this.disable()
	}
	callChildren(funcname) {
		if (this.children)
			return this.children.map(child => child[funcname]())
	}
	enable() {
		this.enabled = true
		this.callChildren("enable")
	}
	disable() {
		this.enabled = false
		this.callChildren("disable")
	}
	toggle() {
		this.enabled = !this.enabled
		this.apply()
	}
}

class _ElementSwitch extends _ModeSwitch {
	constructor( elemID, subModeSwitches=[], enabled=true ) {
		super( subModeSwitches, enabled )
		this.element = document.getElementById(elemID)
	}
}

class InverseSwitch extends _ModeSwitch {
	enable() {
		super.disable()
		this.enabled = true
	}
	disable() {
		super.enable()
		this.enabled = false
	}

}

class CallbackSwitch extends _ModeSwitch {
	constructor( switchCallback, subModeSwitches=[], enabled=true ) {
		super( subModeSwitches, enabled )
		this.onSwitch = () => switchCallback(this)
	}
	enable() {
		super.enable()
		this.onSwitch()
	}
	disable() {
		super.disable()
		this.onSwitch()
	}
}

class VisibilitySwitch extends _ElementSwitch {
	constructor( elemID, subModeSwitches=[], enabled=true ) {
		super( elemID, subModeSwitches, enabled )
	}
	enable() {
		super.enable()
		this.element.classList.toggle('hidden', false)
	}
	disable() {
		super.disable()
		this.element.classList.toggle('hidden', true)
	}
}

class OnClickSwitch extends _ElementSwitch {
	constructor( elemID, subModeSwitches=[], enabled=true ) {
		super( elemID, subModeSwitches, enabled )
		this.boundHandler = this.disable.bind(this)
	}
	enable() {
		super.enable()
		this.element.addEventListener("click", this.boundHandler)
	}
	disable() {
		super.disable()
		this.element.removeEventListener("click", this.boundHandler)
	}
}

class OnClickToggleSwitch extends _ElementSwitch {
	constructor( elemID, subModeSwitches=[], enabled=true ) {
		super( elemID, subModeSwitches, enabled )
		this.boundHandler = this.toggle.bind(this)
		this.element.addEventListener("click", this.boundHandler)
	}
}

var test = new OnClickToggleSwitch("mode", [
	new VisibilitySwitch("mode-logo"),
	new InverseSwitch([new VisibilitySwitch("mode-cancel")]),
	new InverseSwitch([new VisibilitySwitch("quick-settings")])
])
test.apply()
/*
class Stack {
	constructor(){
		this.items=[];
	}

	push(elem){
		this.items.push(elem);
	}
	pop(){
		if (this.items.length == 0)
			return "Underflow";
		return this.items.pop();
	}
	peek(){
		return this.items[this.items.length - 1];
	}
}
function isFullscreen(){
	var doc = window.document;
	if (doc.fullscreenElement || doc.webkitCurrentFullscreenElement || doc.mozFullScreenElement){
		return true;
	} else {
		return false
	}
}
function fullscreen() {
	var doc = window.document;
	var docEl = doc.documentElement;

	var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
	if (!isFullscreen()){
		requestFullScreen.call(docEl);
	}
}
function checkFullScreen(){
	if (document.fullscreenEnabled){
		return true;
	} else {
		return false;
	}
}
function setModeStack(){
	var mStack = new Stack();
	if (checkFullScreen()){
		mStack.push(1);
		mStack.push(0);
	} else {
		mStack.push(1);
		document.getElementById('mode-img').src = 'tetherplay.png';
	}
	return mStack;
}
function changeMode(stk){
	if (!isFullscreen()){
		stk.push(0);
		document.getElementById('mode-img').src = 'fullscreen.png';
	} else {
		stk.pop();
		if (stk.peek() == 1){
		document.getElementById('mode-img').src = 'tetherplay.png';
		} else {
		document.getElementById('mode-img').src = 'cancel.png';
		}
	}
}
function mode(){
	var state = modeStack.pop();
	if (state == 0){
		fullscreen();
		document.getElementById('mode-img').src = 'tetherplay.png';
		modeStack.push(1);
	} else if (state == 1) {
		hideIDVisibility('quick-settings');
		document.getElementById('mode-img').src = 'cancel.png';
		modeStack.push(2);
	} else {
		showIDVisibility('quick-settings');
		document.getElementById('mode-img').src = 'tetherplay.png';
		modeStack.push(1);
	}
}
*/
