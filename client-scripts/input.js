function criticalMisjudgement(severity, description) {
	options = [
		console.error,
		window.alert
	]
	for (var i = 0; i <= severity && i < options.length; i++) {
		options[i](description)
	}
}

function arrayHasElem(a, i) {
	return typeof(a[i]) !== 'undefined'
}

class State {
	constructor(value) {
		this.value = value
	}
	valueOf() {
		return this.value
	}
}

class StateWriter extends State {
	constructor(value, stateStack) {
		super(value)
		this.stateStack = stateStack
	}
	set(value) {
		this.value = value
		this.stateStack.onUpdate(this)
	}
	release() {
		this.stateStack.releaseWriter(this)
	}
}

class StateStack {
	constructor(defaultVal) {
		this.states = [new State(defaultVal)]
	}
	addWriter(initialValue) {
		this.states.unshift( new StateWriter(initialValue, this) )
		this._update()
		return this.current()
	}
	releaseWriter(writer) {
		if (this.states.length == 1) {
			criticalMisjudgement(1, "attempt to release writer that was never claimed")
		}

		var i = this.states.indexOf(writer)
		this.states.splice(i, 1)
		if (i == 0)
			this._update()
	}
	valueOf() {
		return this.current().valueOf()
	}
	_update() {
		onStateUpdate()
	}
	onUpdate(writer) {
		if ( writer === this.current() ) { this._update() }
	}
	current() {
		return this.states[0]
	}
}

var state = [[0, 0], false, false, false].map(val => new StateStack(val))
var activeWriters = []

function onStateUpdate() {
	send(state)
	showState()
}

function setState(evt, i, val) {
	writer = state[i].addWriter(val)

	if (arrayHasElem(activeWriters, evt.index)) {
		// occurs when a release event is not generated for a corresponding press event
		// you can reproduce by opening the context menu while holding down a button
		criticalMisjudgement(0, "writer was never properly released")
		releaseActiveWriter(evt.index)
	}
	activeWriters[evt.index] = writer
}

class PressEvent extends Event {
	constructor(index, typeArg, eventInit) {
		super(typeArg, eventInit)
		this.index = index
	}
}

function getEventIndex(evt) {
	if (evt instanceof TouchEvent)
		return evt.changedTouches[0].identifier + 1
	return 0
}

function handlePressEvent(evt) {
	//TODO add function for finding element to dispatch to which is better than evt.path[0]
	evt.path[0].dispatchEvent(new PressEvent(
		getEventIndex(evt),
		'load', //I'm using onload because it's an event that will never be triggered by default, it's a terrible hack but you'd be surprised how few options there are
		evt
	))
}

function handleReleaseEvent(evt) {
	i = getEventIndex(evt)
	if (! arrayHasElem(activeWriters, i)) {
		// this just means that the last corresponding press didn't do anything, nothing to worry about
		return
	}
	releaseActiveWriter(i)
}

function releaseActiveWriter(i) {
	//FIXME this is a potential race condition, whole function should be atomic
	writer = activeWriters[i]
	activeWriters[i] = undefined
	writer.release()
}
	
