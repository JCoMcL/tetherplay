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
		if (this.enabled)
			return
		this.enabled = true
		this.children.forEach(child => child.enable())
		this.enableCallbacks.forEach(f => f())
	}
	unsafe_disable() {
		if (this.enabled == false)
			return
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

		var de = window.document.documentElement
		var handler = this.handleFullscreenEvent.bind(this)
		if (de.requestFullscreen) {
			this.requestFullscreen = de.requestFullscreen
			document.addEventListener('fullscreenchange', handler)
			this.isFullscreen = () => {return window.document.fullscreenElement}
		} else if (de.mozRequestFullScreen) {
			this.requestFullscreen = de.mozRequestFullscreen
			document.addEventListener('mozfullscreenchange', handler);
			this.isFullscreen = () => {return window.document.mozFullscreenElement}
		} else if (de.webkitRequestFullScreen) {
			document.addEventListener('webkitfullscreenchange', handler);
			this.requestFullscreen = de.webkitRequestFullscreen
			this.isFullscreen = () => {return window.document.webkitCurrentFullscreenElement}
		} else {
			this.requestFullScreen = () => {}
			this.isFullscreen = () => {return false}
		}
		console.log(this.requestFullScreen)
		console.log(this.isFullscreen)
	}

	enable() {
		super.enable()
		console.log("finna request fullscreen")
		console.log(this.requestFullScreen)
		this.requestFullScreen()
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
		if (this.suppressed)
			return
		if (this.enabled == undefined)
			this.apply()
		this.suppressed = true
		this.unsuppressState = this.enabled
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
		if (this.enabled)
			return
		this.enabled = true
		this.children.forEach(child => child.unsuppress())
		this.enableCallbacks.forEach(f => f())
	}
	disable() {
		if (this.enabled == false)
			return
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
