import bar from "../bar/bar"

export default bar({
	input(state, value = "") {
		if (!value) {
			return null
		}
		return state
	},
})
