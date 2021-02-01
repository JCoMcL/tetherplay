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

