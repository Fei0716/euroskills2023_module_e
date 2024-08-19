const {
    MultipleCorrectAnswersStrategy,
} = require("./MultipleCorrectAnswersStrategy");

describe("MultipleCorrectAnswersStrategy", () => {
    test("check answers", () => {

        const multipleCorrectAnswersStrategy = new MultipleCorrectAnswersStrategy([1,2]);

        expect(multipleCorrectAnswersStrategy.checkAnswer([1])).toBeTruthy();
    });
});
