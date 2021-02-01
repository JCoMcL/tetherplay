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
		} catch (e) {
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
		this._update()
	}
	releaseWriter(writer) {
		if (checks.isNot(
				this.states.length == 1,
				"attempt to release writer that was never claimed",
				1
		)) { return }

		var i = this.states.indexOf(writer)
		if (checks.isNot(
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

class Control {
	constructor(type) {
		this.type = type
		this.initial = eventTypes.initial(type)
		this.value = this.initial
	}
	onPress() { }
	onRelease() { }
	onDrag() { }
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

	// occurs when a release event is not generated for a corresponding press event
	// you can reproduce by opening the context menu while holding down a button
	if (checks.isNot(
			checks.arrayHasElem(activeWriters, evt.index),
			"previous writer was never properly released"
	)) { releaseActiveWriter(evt.index) }

	writer = state[i].addWriter(val)
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

function getEventTarget(evt) {
	for (i = 0; i < evt.path.length; i++) {
		var target = evt.path[i]
		if (configuration.hasId(target.id))
			{ return target }
	}
	return undefined
}

function ival2sval(ival) {
	return ival * 2 - 1
}

function getRelativeCoordinates(element, coordinates) {
	var bounds = element.getBoundingClientRect()
	return [
		(coordinates[0] - bounds.x) / bounds.width,
		(coordinates[1] - bounds.y) / bounds.height
	].map(ival2sval)
}

function getControlSetValue(controlType, evt = null, target = null) {
	switch (controlType) {
		case "inst":
			return true
		case "bool":
			return true
		case "vec":
			if (!evt)
				{ throw "evt argument required for " + controlType }
			if (checks.isNot(target == null), "element not given! Trying to find", 0)
				{ target = getEventTarget(evt) }
			return getRelativeCoordinates(target, [evt.clientX, evt.clientY])
	}
}

function handleTouchPress(evt) {
	//evt.preventDefault()
	var driverIndex = evt.changedTouches[0].identifier + 1
	handlePress(evt, driverIndex)
}

function handleMousePress(evt) {
	handlePress(evt, 0)
}

function handlePress(evt, driverIndex) {
	var target = getEventTarget(evt)
	if (!target)
		{ return }

	var control = configuration.byId(target.id)
	var i = control.index
	var val = getControlSetValue(control.type, evt, target)
	evt.index = driverIndex
	setState(evt, i, val)
}

function handleReleaseEvent(evt) {
	i = getEventIndex(evt)
	if (! checks.arrayHasElem(activeWriters, i)) {
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
