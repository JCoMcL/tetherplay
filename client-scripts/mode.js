class MonodirectionalModeSwitch {
	constructor( subModeSwitches=[]) {
		this.children = subModeSwitches
		this.enableCallbacks = []
		this.disableCallbacks = []
	}
	apply(state=undefined) {
		if (state == undefined) {
			if (this.enabled == undefined)
				state = true
			else
				state = this.enabled
		}

		if (state)
			this.enable()
		else
			this.disable()
	}
	callChildren(funcname) {
		if (this.children)
			return this.children.map(child => child[funcname]())
	}
	enable() {
		console.log("enabling")
		console.log(this)
		if (this.enabled)
			return
		this.enabled = true
		this.children.forEach(child => child.enable())
		this.enableCallbacks.forEach(f => f())
		console.log(this)
		console.log("enabled")
	}
	disable() {
		console.log("disabling")
		console.log(this)
		if (this.enabled == false)
			return
		this.enabled = false
		this.children.forEach(child => child.disable())
		this.disableCallbacks.forEach(f => f())
		console.log(this)
		console.log("disabled")
	}
	toggle() {
		this.apply(!this.enabled)
	}
	addListener(modeSwitch) {
		this.enableCallbacks.push(modeSwitch.enable.bind(modeSwitch))
		this.disableCallbacks.push(modeSwitch.disable.bind(modeSwitch))
	}
}

class ModeSwitch extends MonodirectionalModeSwitch{
	constructor(subModeSwitches=[]) {
		super(subModeSwitches)
		subModeSwitches.forEach(child => child.addListener(this))
	}
}

class InverseSwitch extends ModeSwitch{
	enable() {
		super.disable()
		this.enabled = true
	}
	disable() {
		super.enable()
		this.enabled = false
	}

}

class VisibilitySwitch extends ModeSwitch {
	constructor( elemID, subModeSwitches=[]) {
		super(subModeSwitches)
		this.element = document.getElementById(elemID)
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

class OnClickSwitch extends ModeSwitch {
	constructor( elemID, subModeSwitches=[]) {
		super(subModeSwitches)
		this.element = document.getElementById(elemID)
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

class OnClickToggleSwitch extends OnClickSwitch {
	constructor( elemID, subModeSwitches=[]) {
		super(subModeSwitches)
		this.element = document.getElementById(elemID)
		this.boundHandler = this.toggle.bind(this)
		this.element.addEventListener("click", this.boundHandler)
	}
}

class DualSwitch extends MonodirectionalModeSwitch {
	constructor( activeSwitches=[], inactiveSwitches=[]) {
		super(activeSwitches)
		this.disabledMode = new MonodirectionalModeSwitch(inactiveSwitches)
		this.disabledMode.disable()
		this.suppressed = false
	}
	enable() {
		if (this.suppressed) {
			if (this.unsuppressState)
				return
			throw new Error("target is  suppressed")
		}
		super.enable()
		this.disabledMode.disable()
	}
	disable() {
		if (this.suppressed) {
			if (this.unsuppressState == false)
				return
			throw new Error("target is  suppressed")
		}
		super.disable()
		this.disabledMode.enable()
	}
	suppress() {
		this.suppressed = true
		this.unsuppressState = this.enabled
		console.log("supressing")
		console.log(this)
		super.disable()
		this.disabledMode.disable()
	}
	unsuppress() {
		if (this.suppressed == false)
			return
		this.suppressed = false
		this.apply(this.unsuppressState)
	}
}

class SuppressorSwitch extends MonodirectionalModeSwitch {
	enable() {
		console.log("enabling")
		console.log(this)
		if (this.enabled)
			return
		this.enabled = true
		this.children.forEach(child => child.unsuppress())
		this.enableCallbacks.forEach(f => f())
		console.log(this)
		console.log("enabled")
	}
	disable() {
		console.log("disabling")
		console.log(this)
		if (this.enabled == false)
			return
		this.enabled = false
		this.children.forEach(child => child.suppress())
		this.disableCallbacks.forEach(f => f())
		console.log(this)
		console.log("disabled")
	}
}

const modeQuickSettings = new DualSwitch([
	new VisibilitySwitch("mode-logo"),
	new OnClickToggleSwitch("mode")
],[
	new VisibilitySwitch("mode-cancel"),
	new VisibilitySwitch("quick-settings")
])

const modeButton = new DualSwitch([
	new VisibilitySwitch("mode-fullscreen"),
	new OnClickSwitch("mode")
],[
	new SuppressorSwitch([modeQuickSettings])
])
modeButton.apply()

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
