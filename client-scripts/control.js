function capitalizeFirstLetter(s) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

class _Control{
	constructor(element, updateCallback) {
		this.element = element
		this.onUpdate = () => updateCallback(this)
	}
	set(val) {
		this.value = val
		this.onUpdate()
	}
	onPress(pressEvent = undefined) { }
	onRelease(releaseEvent = undefined) { }
	onDrag(dragEvent = undefined) { }
	valueOf() { return this.value }
}

const control = {

	inst: class InstControl extends _Control {
		constructor(element, updateCallback) {
			super(element, updateCallback)
			this.value = undefined
		}
		onPress(pressEvent = undefined) {
			super.onPress(pressEvent)
			this.onUpdate()
		}
	},

	bool: class BoolControl extends _Control {
		constructor(element, updateCallback) {
			super(element, updateCallback)
			this.value = false
		}
		onPress(pressEvent = undefined) {
			super.onPress(pressEvent)
			this.set(true)
		}
		onRelease(releaseEvent = undefined) {
			super.onRelease(releaseEvent)
			this.set(false)
		}
	},

	dir4: class Dir4Control extends _Control {
		constructor(element, updateCallback) {
			super(element, updateCallback)
			this.value = [0,0]
		}
		onPress(pressEvent = undefined) {
			super.onPress(pressEvent)
			console.log(pressEvent)
			this.set(true)
		}
		onRelease(releaseEvent = undefined) {
			super.onRelease(releaseEvent)
			this.set([0,0])
		}
	}
}
