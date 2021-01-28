function criticalMisjudgement(severity, description) {
	options = [
		console.error,
		//TODO put logging func here
		function(desc){throw desc},
		window.alert
	]
	for (var i = 0; i <= severity && i < options.length; i++) {
		options[i](description)
	}
}

function assert(expression, errormsg, severity = 0) {
	try {
		if (! expression) {
			criticalMisjudgement(severity, errormsg)
		}
		return expression
	} catch (e) {
		return false
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
		try {
			this.stateStack.releaseWriter(this)
		} catch(e) {
			this.stateStack.reset()
		}
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
	reset() {
		this.states = [this.states[this.states.length - 1]]
	}
	releaseWriter(writer) {
		if (! assert(
				this.states.length > 1,
				"attempt to release writer that was never claimed",
				1
		)) { return }

		var i = this.states.indexOf(writer)
		if (! assert(
				i == -1,
				"attempt to release writer that has already been released",
				1
		)) { return }

		this.states.splice(i, 1)
		if (i == 0)
			this._update()
	}
	valueOf() {
		return this.current().valueOf()
	}
	_update() {
		onStateUpdate(this)
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

function encodeState(index) {
	return JSON.stringify({i:index, v:state[index].valueOf()})
}

function onStateUpdate(which = null) {
	if (which) {
		send(encodeState(state.indexOf(which)))
	} else {
		for(i = 0; i < state.length; i++)
			{send(encodeState(i))}
	}
	showState()
}

function setState(evt, i, val) {
	writer = state[i].addWriter(val)

	// occurs when a release event is not generated for a corresponding press event
	// you can reproduce by opening the context menu while holding down a button
	if (! assert(
			arrayHasElem(activeWriters, evt.index),
			"writer was never properly released")
	) { releaseActiveWriter(evt.index) }
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
	try { writer.release() }
	catch (e) {
		return
	}
	activeWriters[i] = undefined
}
	
