class MonodirectionalModeSwitch {
	constructor( subModeSwitches=[]) {
		this.children = subModeSwitches
		this.enableCallbacks = []
		this.disableCallbacks = []
		this.antiLoop = 0
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
	enable() {
		try {
			if (this.enabled !== true)
				this.unsafe_enable()
		} catch(e) {
			this.antiLoop++
			if(this.antiLoop > 1)
				throw new Error("Failed to properly set all switches")
			try {
				this.disable()
			} catch(e) {
				console.error(e)
			}
		}
		this.antiLoop = 0
	}
	disable() {
		try {
			if (this.enabled !== false)
				this.unsafe_disable()
		} catch(e) {
			this.antiLoop++
			if(this.antiLoop > 1)
				throw new Error("Failed to properly set all switches")
			try {
				this.enable()
			} catch(e) {
				console.error(e)
			}
		}
		this.antiLoop = 0
	}
	unsafe_enable() {
		this.enabled = true
		this.children.forEach(child => child.enable())
		this.enableCallbacks.forEach(f => f())
	}
	unsafe_disable() {
		this.enabled = false
		this.children.forEach(child => child.disable())
		this.disableCallbacks.forEach(f => f())
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

/*class InverseSwitch extends ModeSwitch{
	unsafe_enable() {
		super.unsafe_disable()
		this.enabled = true
	}
	unsafe_disable() {
		super.unsafe_enable()
		this.enabled = false
	}

}*/

class VisibilitySwitch extends ModeSwitch {
	constructor( elemID, subModeSwitches=[]) {
		super(subModeSwitches)
		this.element = document.getElementById(elemID)
	}
	unsafe_enable() {
		super.unsafe_enable()
		this.element.classList.toggle('hidden', false)
	}
	unsafe_disable() {
		super.unsafe_disable()
		this.element.classList.toggle('hidden', true)
	}
}

class OnClickSwitch extends ModeSwitch {
	constructor( elemID, subModeSwitches=[]) {
		super(subModeSwitches)
		this.element = document.getElementById(elemID)
		this.boundHandler = this.disable.bind(this)
	}
	unsafe_enable() {
		super.unsafe_enable()
		this.element.addEventListener("click", this.boundHandler)
	}
	unsafe_disable() {
		super.unsafe_disable()
		this.element.removeEventListener("click", this.boundHandler)
	}
}

class OnClickToggleSwitch extends ModeSwitch {
	constructor( elemID, subModeSwitches=[]) {
		super(subModeSwitches)
		this.element = document.getElementById(elemID)
		this.boundHandler = this.toggle.bind(this)
		this.element.addEventListener("click", this.boundHandler)
	}
}

class FullscreenSwitch extends ModeSwitch {
	constructor( subModeSwitches=[]) {
		super(subModeSwitches)

		document.addEventListener('fullscreenchange', this.handleFullscreenEvent.bind(this))
		this.isFullscreen = () => {}

		console.log(document.documentElement.requestFullScreen)
		console.log(this.requestFullScreen)
	}

	unsafe_enable() {
		super.unsafe_enable()
		console.log("finna request fullscreen")
		var de = window.document.documentElement;

		var requestFullScreen = de.requestFullscreen ||
			de.mozRequestFullScreen ||
			de.webkitRequestFullScreen ||
			de.msRequestFullscreen;

		requestFullScreen.call(de);
	}
	unsafe_disable() {
		console.log("disabling")
		console.log(this)
		super.unsafe_disable()
	}

	isFullscreen() {
		return isFullscreen()
	}

	handleFullscreenEvent() {
		if (this.isFullscreen())
			this.enable()
		else
			this.disable()
	}

}

class DualSwitch extends ModeSwitch {
	constructor( activeSwitches=[], inactiveSwitches=[]) {
		super(activeSwitches)
		this.disabledMode = new MonodirectionalModeSwitch(inactiveSwitches)
		this.disabledMode.disable()
		this.suppressed = false
	}
	unsafe_enable() {
		if (this.suppressed) {
			if (this.unsuppressState)
				return
			throw new Error("target is  suppressed")
		}
		super.unsafe_enable()
		this.disabledMode.disable()
	}
	unsafe_disable() {
		if (this.suppressed) {
			if (this.unsuppressState == false)
				return
			throw new Error("target is  suppressed")
		}
		super.unsafe_disable()
		this.disabledMode.enable()
	}
	suppress() {
		if (this.suppressed)
			return
		if (this.enabled == undefined)
			this.apply()
		this.unsuppressState = this.enabled
		super.disable()
		this.suppressed = true
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
	unsafe_enable() {
		this.enabled = true
		this.children.forEach(child => child.unsuppress())
		this.enableCallbacks.forEach(f => f())
	}
	unsafe_disable() {
		this.enabled = false
		this.children.forEach(child => child.suppress())
		this.disableCallbacks.forEach(f => f())
	}
}


const modeButton = new DualSwitch([
	new VisibilitySwitch("mode-fullscreen"),
	new OnClickSwitch("mode")
],[
	new SuppressorSwitch([
		new DualSwitch([
			new VisibilitySwitch("mode-logo"),
			new OnClickToggleSwitch("mode")
		],[
			new VisibilitySwitch("mode-cancel"),
			new VisibilitySwitch("quick-settings")
		])
	]), new FullscreenSwitch()
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
*/
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
/*
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
