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

function getControlByElement(element) {
	return state[configuration.byId(element.id).index]
}

function callControlMethod(element, method, ...args) {
	if (!element)
		{ return }
	return getControlByElement(element)[method](...args)
}

function handlePressEvent(evt) {
	evt.preventDefault()
	evt.path = evt.path || (evt.composedPath && evt.composedPath());
	callControlMethod( getEventTarget( evt ), "onPress", evt)
}

function handleReleaseEvent(evt) {
	evt.preventDefault()
	evt.path = evt.path || (evt.composedPath && evt.composedPath());
	callControlMethod( getEventTarget( evt ), "onRelease", evt)
}

function handleDragEvent(evt) {
	evt.preventDefault()
	evt.path = evt.path || (evt.composedPath && evt.composedPath());
	callControlMethod( getEventTarget( evt ), "onDrag", evt)
}
