class _Control{
	constructor(element, updateCallback) {
		this.element = element
		this.onUpdate = () => updateCallback(this)
	}
	set(val) {
		this.value = val
		this.onUpdate()
	}
	getChildren(tagname) {
		return Array.prototype.slice.call(
			this.element.getElementsByTagName(tagname)
		)
	}
	onPress(pressEvent = undefined) { }
	onRelease(releaseEvent = undefined) { }
	onDrag(dragEvent = undefined) { }
	valueOf() { return this.value }
}

class VecControl extends _Control {
	constructor(element, updateCallback) {
		super(element, updateCallback)
		this.value = [0,0]
	}

	// convert raw value to native datatype
	processVal(val) {
		return Math.min(Math.max(val*2 -1, -1), 1);
	}
	unProcessVal(val) {
		return (val + 1) / 2
	}

	processVec(vec) {
		return vec.map(this.processVal)
	}

	getEventRelativeCoordinates(evt) {
		return this.processVec(
			getRelativeCoordinates(this.element, [evt.x, evt.y])
		)
	}
	childRelativeCoordinates(child) {
		return this.processVec(
			getRelativeCoordinates(this.element, getElementCenter(child))
		)
	}

	onRelease(releaseEvent = undefined) {
		super.onRelease(releaseEvent)
		this.set([0,0])
	}
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
	]
}

function taxiCabDist(p1, p2 = [0,0]) {
	return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1])
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
	dir4: class Dir4Control extends VecControl {
		constructor(element, updateCallback) {
			super(element, updateCallback)
			this.children = this.getChildren("button")
			this.directions = this.children.map(child =>
				this.childRelativeCoordinates(child)
			)
		}

		processVec(vec) {
			vec = super.processVec(vec)
			for (const dir4 of [[1,0],[0,1],[-1,0],[0,-1]]) {
				if (taxiCabDist(vec, dir4) < 1)
					{ return dir4 }
			}
			return [0,0]
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
	},

	vec8: class Vec8Control extends VecControl {
		constructor(element, updateCallback){
			super(element, updateCallback)
			this.context = this.element.getContext("2d")
			this.drawJoystick(this.value)
		}

		set(val) {
			super.set(val)
			this.drawJoystick()
		}

		drawJoystick(){
			var diameter = Math.min(this.element.width, this.element.height)
			var stickRadius = diameter / 3
			var coordinates = this.value.map( v => this.unProcessVal(v) * diameter);

			(ctx => {
			ctx.clearRect(0, 0, diameter, diameter)
			ctx.beginPath()
			ctx.arc(coordinates[0], coordinates[1], stickRadius, 0, 2*Math.PI)
			ctx.fillStyle = "#080808"
			ctx.fill()
			ctx.stroke()
			})(this.context)
		}

		onPress(pressEvent = undefined){
			super.onPress(pressEvent)
			this.onDrag(pressEvent)
		}

		onDrag(dragEvent = undefined) {
			super.onDrag(dragEvent)
			this.set(this.getEventRelativeCoordinates(dragEvent))
		}
	}
}
