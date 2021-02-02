var state = []

function getEventTarget(evt) {
	for (i = 0; i < evt.path.length; i++) {
		var target = evt.path[i]
		if (configuration.hasId(target.id))
			{ return target }
	}
	return undefined
}

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

function getControlByElement(element) {
	return state[configuration.byId(element.id).index]
}

function callControlMethod(element, method, ...args) {
	if (!element)
		{ return }
	return getControlByElement(element)[method](...args)
}

function handlePressEvent(evt) {
	callControlMethod( getEventTarget( evt ), "onPress", evt)
}

function handleReleaseEvent(evt) {
	callControlMethod( getEventTarget( evt ), "onRelease", evt)
}

