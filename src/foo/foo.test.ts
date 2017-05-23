import foo from "./foo"

test("test only one branch", () => {
	const obj = {}
	expect(foo.input(obj, "value")).toBe(obj)
})
