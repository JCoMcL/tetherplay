const configuration = {
	_indexMap: [
		{id: "gp-ljoy", type: "vec"},
		{id: "gp-west", type: "bool"},
		{id: "gp-south", type: "bool"},
		{id: "gp-select", type: "inst"}
	],

	setup() {
		this._setupIdMap()
	},

	byIndex(i) {
		return this._indexMap[i]
	},
	byId(id) {
		return this._idMap[id]
	},
	hasIndex(i) {
		return  i < this._indexMap.length && 0 <= i
	},
	hasId(id) {
		return  this._idMap[id] !== undefined
	},

	_setupIdMap() {
		this._idMap = {}
		this._indexMap.forEach((item, index) => {
			this._idMap[item.id] = {index: index, type: item.type}
		})
	}

}
configuration.setup()
