const { QuizManager } = require("./QuizManager");
const {InputReader} = require("./InputReader");

describe("QuizManager", () => {
    test("test invalid constructor call" , ()=>{
        const outputManager = {display: jest.fn()};
        const inputReader = new InputReader();
        expect( () => {new QuizManager([], outputManager , inputReader)}).toThrow(new Error("No questions given"));
    });

    test("test valid constructor call" , ()=>{
        const outputManager = {display: jest.fn()};
        const inputReader = new InputReader();
        const quizManager =  new QuizManager(['test'], outputManager , inputReader)
        expect(quizManager).toBeTruthy();
    });

    test("run quiz",async () => {
        const outputManager = {display: jest.fn()};
        const inputReader = {readAnswers: jest.fn(()=>[1])};
        const checkAnswerMock = jest.fn(() => true);
        const question1 = {
            text: "foo",
            choices: ["bar", "baz"],
            strategy:{
                checkAnswer: checkAnswerMock,
                correctAnswers: [1],
            },
        };
        const question2 = {
            text: "bar",
            choices: ["foo", "fop"],
            strategy:{
                checkAnswer: () => false,
                correctAnswers: [2, 3],
            },
        };
        const question3 = {
            text: "foo",
            choices: ["bar", "baz"],
            strategy:{
                checkAnswer: ()=> false,
                correctAnswers: [2],
            },
        };
        const questions = [question1, question2, question3];
        const quizManager = new QuizManager(questions, outputManager, inputReader);
        await quizManager.startQuiz();

        expect(outputManager.display).toHaveBeenNthCalledWith(1, "Question 1: foo");
        expect(outputManager.display).toHaveBeenNthCalledWith(2, "1. bar");
        expect(outputManager.display).toHaveBeenNthCalledWith(3, "2. baz");
        expect(inputReader.readAnswers).toHaveBeenNthCalledWith(1, question1);
        expect(checkAnswerMock).toHaveBeenCalledWith([1]);
        expect(outputManager.display).toHaveBeenNthCalledWith(4, "Correct!\n","green");

        expect(outputManager.display).toHaveBeenNthCalledWith(5, "Question 2: bar");
        expect(outputManager.display).toHaveBeenNthCalledWith(6, "1. foo");
        expect(outputManager.display).toHaveBeenNthCalledWith(7, "2. fop");
        expect(outputManager.display).toHaveBeenNthCalledWith(8, "Incorrect!\n" + "Correct answers: 2, 3\n", "red");
        expect(outputManager.display).toHaveBeenNthCalledWith(9, "Question 3: foo");
        expect(outputManager.display).toHaveBeenNthCalledWith(10, "1. bar");
        expect(outputManager.display).toHaveBeenNthCalledWith(11, "2. baz");
        expect(outputManager.display).toHaveBeenNthCalledWith(12, "Incorrect!\n" + "Correct answer: 2\n", "red");
        expect(outputManager.display).toHaveBeenNthCalledWith(13, "Quiz finished!");
    });
});
