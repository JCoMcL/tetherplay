const control = {
	Control: class {
		constructor(element, updateCallback) {
			this.element = element
			this.onUpdate = updateCallback
		}
		_set(val) {
			this.value = val
			this.onUpdate(this)
		}
		onPress() { }
		onRelease() { }
		onDrag() { }
	},

	InstControl: class extends this.Control {
		constructor(element, updateCallback) {
			super(element, updateCallback)
			this.value = undefined
		}
		onPress() {
			this.onUpdate(this)
		}
		onRelease() { }
	},

	BoolControl: class extends this.Control {
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
