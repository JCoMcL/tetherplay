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

//this should be in a helper lib I think
function ival2sval(ival) {
	return ival * 2 - 1
}

function getElementCenter(element) {
	var bounds = element.getBoundingClientRect()
	return [
		bounds.left + ((bounds.right - bounds.left) / 2),
		bounds.top + ((bounds.bottom - bounds.top) / 2)
	]
}

function getRelativeCoordinates(element, coordinates) {
	var bounds = element.getBoundingClientRect()
	return [
		(coordinates[0] - bounds.x) / bounds.width,
		(coordinates[1] - bounds.y) / bounds.height
	].map(ival2sval)
}

function taxiCabDist(p1, p2 = [0,0]) {
	return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1])
}

function sval2dir4(sval) {
	for (const vec of [[1,0],[0,1],[-1,0],[0,-1]]) {
		if (taxiCabDist(sval, vec) < 1)
			{ return vec }
	}
	return [0,0]
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
			this.children = this.getChildren("button")
			this.directions = this.children.map(child =>
				this.childRelativeCoordinates(child)
			)
		}

		getChildren(tagname) {
			return Array.prototype.slice.call(
				this.element.getElementsByTagName(tagname)
			)
		}

		childRelativeCoordinates(child) {
			return sval2dir4(
				getRelativeCoordinates(this.element, getElementCenter(child))
			)
		}

		directionOfChild(child) {
			var i = this.children.indexOf(child)
			if ( i == -1 ) {
				throw "this child is not ours"
			}
			return this.directions[i]
		}

		onPress(pressEvent = undefined) {
			super.onPress(pressEvent)
			var targ = pressEvent.target //TODO find target be searching up the tree
			if (targ == this.element)
				{ return }
			try {
				this.set( this.directionOfChild(targ) )
			} catch (e) {console.error(e)}
		}

		onRelease(releaseEvent = undefined) {
			super.onRelease(releaseEvent)
			this.set([0,0])
		}
	}
}
