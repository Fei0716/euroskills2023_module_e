const { OutputManager } = require("./OutputManager");

describe("OutputManager", () => {
    test("test color red display", ()=>{
        const outputManager = new OutputManager();
        //mock console.log
        console.log = jest.fn();
        outputManager.display("test red", "red")
        expect(console.log).toHaveBeenCalledWith("\x1b[31m%s\x1b[0m" , "test red");
    });


    test("test color green display", () => {
        const outputManager = new OutputManager();
        //mock console.log
        console.log = jest.fn();
        outputManager.display("test green" , "green");
        expect(console.log).toHaveBeenCalledWith("\x1b[32m%s\x1b[0m" , "test green");
    })

    test("test no color display", () =>{
        const outputManager = new OutputManager();
        //mock console.log
        console.log = jest.fn();
        outputManager.display("test no color");
        expect(console.log).toHaveBeenCalledWith("test no color");
    })
});
