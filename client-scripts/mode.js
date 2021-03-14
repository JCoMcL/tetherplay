class ModeSwitch {
	constructor( subModeSwitches=[]) {
		this.children = subModeSwitches
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
		if (this.enabled)
			return
		this.enabled = true
		this.callChildren("enable")
	}
	disable() {
		if (this.enabled == false)
			return
		this.enabled = false
		this.callChildren("disable")
	}
	toggle() {
		this.apply(!this.enabled)
	}
}

class InverseSwitch extends ModeSwitch {
	enable() {
		super.disable()
		this.enabled = true
	}
	disable() {
		super.enable()
		this.enabled = false
	}

}

class TriggerSwitch extends ModeSwitch {
	enable() {
		try {
			super.enable()
		} catch(e) {
			this.enabled = false
		}
	}
	disable() {
		try {
			super.disable()
		} catch(e) {
			this.enabled = true
		}
	}
}

class CallbackSwitch extends ModeSwitch {
	constructor( switchCallback, subModeSwitches=[]) {
		super( subModeSwitches)
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

class OnClickSwitch extends TriggerSwitch {
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

class OnClickToggleSwitch extends TriggerSwitch {
	constructor( elemID, subModeSwitches=[]) {
		super(subModeSwitches)
		this.element = document.getElementById(elemID)
		this.boundHandler = this.toggle.bind(this)
		this.element.addEventListener("click", this.boundHandler)
	}
}

class DualSwitch extends ModeSwitch {
	constructor( activeSwitches=[], inactiveSwitches=[]) {
		super(activeSwitches)
		this.disabledMode = new ModeSwitch(inactiveSwitches)
		this.disabledMode.disable()
	}
	enable() {
		if (this.suppressed)
			throw new Error("target is  suppressed")
		super.enable()
		this.disabledMode.disable()
	}
	disable() {
		if (this.suppressed)
			throw new Error("target is  suppressed")
		super.disable()
		this.disabledMode.enable()
	}
	suppress() {
		this.suppressed = true
		this.unsuppressState = this.enabled
		super.disable()
		this.disabledMode.disable()
	}
	unsuppress() {
		if (!this.suppressed)
			return
		this.suppressed = false
		this.apply(this.unsuppressState)
	}
}

class SuppressorSwitch extends ModeSwitch {
	constructor( subDualSwitches ) {
		super(subDualSwitches)
	}
	enable() {
		if (this.enabled)
			return
		this.enabled = true
		this.callChildren("unsuppress")
	}
	disable() {
		if (this.enabled == false)
			return
		this.enabled = false
		this.callChildren("suppress")
	}
}

class FullscreenSwitch extends ModeSwitch {
	enable()
}

const modeQuickSettings = new DualSwitch([
	new VisibilitySwitch("mode-logo"),
],[
	new VisibilitySwitch("mode-cancel"),
	new VisibilitySwitch("quick-settings")
])
modeQuickSettings.apply()
new OnClickToggleSwitch("mode", [modeQuickSettings]).apply()

const modeButton = new DualSwitch([
	new VisibilitySwitch("mode-fullscreen")
],[
	new SuppressorSwitch([modeQuickSettings])
])
modeButton.apply()
new OnClickSwitch("mode", [modeButton]).apply()



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
