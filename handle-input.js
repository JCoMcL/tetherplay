function addRequiredListeners(event, stateIndex, defaultState, activeState) {
	var tar = event.currentTarget
	console.log(tar)
	tar.addEventListener('mousedown', setState [stateIndex, activeState])
	tar.addEventListener('mouseup', setState [stateIndex, defaultState])
}
