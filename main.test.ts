const sum = (num1: number, num2: number): number => num1 + num2

describe("properly adds 2 numbers", () => {
    it("adds numbers", () => {
        expect(sum(1, 2)).toBe(3)
    })
})