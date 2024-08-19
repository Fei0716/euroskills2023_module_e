const { SingleAnswerStrategy } = require("./SingleAnswerStrategy");

describe("SingleAnswerStrategy", () => {
    test("im not single", () => {
        const correctAnswers = [2,2,2];
        expect(()=>{
            new SingleAnswerStrategy(correctAnswers);
        }).toThrowError(new Error(
            `SingleAnswerStrategy requires exactly 1 answer, got ${correctAnswers.length}`
        ) );
    });

    test("check answer" ,() => {
        const singleAnswerStrategy = new SingleAnswerStrategy([2]);
        expect(singleAnswerStrategy.checkAnswer([3])).toBeFalsy();
    });
});
