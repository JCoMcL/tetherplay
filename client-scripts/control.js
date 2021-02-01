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
	onPress() { }
	onRelease() { }
	onDrag() { }
	valueOf() { return this.value }
}

const control = {

	inst: class InstControl extends _Control {
		constructor(element, updateCallback) {
			super(element, updateCallback)
			this.value = undefined
		}
		onPress() {
			this.onUpdate()
		}
		onRelease() { }
	},

	bool: class BoolControl extends _Control {
		constructor(element, updateCallback) {
			super(element, updateCallback)
			this.value = false
		}
		onPress() {
			this.set(true)
		}
		onRelease() {
			this.set(false)
		}
	}
}
