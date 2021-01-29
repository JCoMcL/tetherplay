const eventMap = {
	_configuration: [
		{id: "gp-ljoy", type: "vec"},
		{id: "gp-west", type: "bool"},
		{id: "gp-south", type: "bool"},
		{id: "gp-select", type: "inst"}
	],

	setup() {
		this._setupIdMap()
	},

	byIndex(i) {
		return this._configuration[i]
	},
	byId(id) {
		return this._idMap[id]
	},

	_setupIdMap() {
		this._idMap = {}
		this._configuration.forEach((item, index) => {
			this._idMap[item.id] = {index: index, type: item.type}
		})
	}

}
eventMap.setup()
