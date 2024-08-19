const { MultipleChoiceStrategy } = require("./MultipleChoiceStrategy");

describe("MultipleChoiceStrategy", () => {
    test("test invalid answers length",() =>{
        const multipleChoiceStrategy = new MultipleChoiceStrategy([1,2]);
         expect(multipleChoiceStrategy.checkAnswer([1])).toBeFalsy();
    });

    test("test correct answers", ()=>{
        const multipleChoiceStrategy = new MultipleChoiceStrategy([1,2]);

        expect(multipleChoiceStrategy.checkAnswer([1,2])).toBeTruthy();
    });


});
